import {
  Form,
  Button,
  DatePicker,
  Typography,
  Space,
  Card,
  Input,
  message,
} from "antd";
import "../../../assets/styles/createAssignment.css";
import { useNavigate, useParams } from "react-router-dom";
import "../../../assets/styles/createUser.css";
import { useEffect, useState } from "react";
import UserModal from "../components/userModal";
import AssetModal from "../components/assetModal";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import { getAssignmentById, updateAssignment } from "../../../services";

const { Search } = Input;
const { Title } = Typography;
const customButton = <Button icon={<SearchOutlined />} />;
function EditAssignment() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [formAssignment] = Form.useForm();
  const [disabledSave, setDisabledSave] = useState(true);
  const { TextArea } = Input;
  const [isFill, setIsFill] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showAsset, setShowAsset] = useState(false);
  const [assignment, setAssignment] = useState({});
  const [isCreateAssignment, setIsCreateAssignment] = useState(false);
  const [defaultValueInput, setDefaultValueInput] = useState({
    user: "",
    asset: "",
  });
  const initialAssignment = {
    id: "",
    asset: "",
    assignedBy: "",
    assignedDate: "",
    assignedTo: "",
    createdBy: "",
    createdDate: "",
    note: "",
    state: "",
  };
  const [assignmentData, setAssignmentData] = useState(initialAssignment);
  const [loading, setIsLoading] = useState(false);
  const [noAssignment, setNoAssignment] = useState(false);
  const [admin, setAdmin] = useState("");
  const [userValue, setUserValue] = useState({
    username: "",
    type: "",
    status: "",
    staffCode: "",
    location: {
      id: "",
      name: "",
    },
    lastUpdatedDate: "",
    lastUpdatedBy: "",
    lastName: "",
    joinedDate: "",
    gender: "",
    firstName: "",
    dob: "",
    createdDate: "",
    createdBy: "",
  });
  const [assetValue, setAssetValue] = useState({
    category: {
      id: "",
      name: "",
    },
    code: "",
    createdBy: "",
    createdDate: "",
    installedDate: "",
    lastUpdatedBy: "",
    lastUpdatedDate: "",
    location: {
      id: "",
      name: "",
    },
    name: "",
    specification: "",
    state: "",
  });
  useEffect(() => {
    getAssignmentById(id).then((data) => {
      setAdmin(JSON.parse(window.localStorage.getItem("user")).username);
      if (data.data != null) {
        const assignment = data.data.content;
        setUserValue(assignment.assignedTo);
        setAssetValue(assignment.asset);
        setAssignmentData({
          id: assignment.id,
          asset: assignment.asset,
          assignedBy: assignment.assignedBy,
          assignedTo: assignment.assignedTo,
          assignedDate: assignment.assignedDate,
          createdBy: assignment.createdBy,
          createdDate: assignment.createdDate,
          note: assignment.note,
          state: assignment.state,
        });
        setIsLoading(true);
        setNoAssignment(false);
      } else {
        setNoAssignment(true);
      }
    });
  }, [id]);

  const onSubmit = async (data) => {
    data.assignedTo = userValue;
    data.asset = assetValue;
    data.assignedDate = data.assignedDate.format("YYYY-MM-DD");
    const assignmentIn = {
      ...data,
      assignedBy: assignmentData.assignedBy,
      createdBy: assignmentData.createdBy,
      createdDate: assignmentData.createdDate,
      state: assignmentData.state,
    };
    setIsCreateAssignment(true);
    setAssignment(assignmentIn);
  };
  useEffect(() => {
    if (isCreateAssignment === true) {
      updateAssignment(assignment, id).then((data) => {
        if (data.data != null) {
          let count = 0;
          if (!!sessionStorage.getItem("turn")) {
            let turn = parseInt(sessionStorage.getItem("turn"));
            count = turn + 1;
          }
          sessionStorage.setItem("turn", count);
          localStorage.setItem("assignment-asset", "1");
          localStorage.setItem("assignment-user", "1");
          localStorage.setItem("count", 0);
          localStorage.setItem("assignment", id);
          message.success("Edit Assignment Successfully!");
          navigate("/assignment");
        } else {
          message.error("Edit Assignment Failed!");
        }
        setIsCreateAssignment(false);
      });
    }
  }, [isCreateAssignment]);

  const disabledDate = (current) => {
    return current.isBefore(moment().subtract(1, "day"));
  };
  const cancel = () => {
    navigate("/assignment");
  };
  const handleFormChange = () => {
    const hasErrors = formAssignment
      .getFieldsError()
      .some(({ errors }) => errors.length);
    if (
      isFill === true &&
      userValue.firstName !== "" &&
      assetValue.code !== ""
    ) {
      setDisabledSave(hasErrors);
    }
  };
  const onValuesChange = (changedValues, allValues) => {
    if (allValues.assignedDate !== undefined && allValues.note !== undefined) {
      setIsFill(true);
    }
  };
  const onSearchUser = (value) => {
    setShowLogin(true);
  };
  const onSearchAsset = (value) => {
    setShowAsset(true);
  };
  useEffect(() => {
    formAssignment.setFieldsValue(defaultValueInput);
    const note = document.getElementById("note").value;
    const date = document.getElementById("date").value;
    if (
      note !== "" &&
      date !== "" &&
      userValue.username !== "" &&
      assetValue.code !== ""
    ) {
      setDisabledSave(false);
    }
  }, [formAssignment, defaultValueInput]);

  useEffect(() => {
    setDefaultValueInput({
      assignedTo: userValue.firstName + " " + userValue.lastName,
      asset: assetValue.name,
      assignedDate: moment(assignmentData.assignedDate, "yyyy-MM-DD"),
      note: assignmentData.note,
    });
  }, [userValue, assetValue]);

  return (
    <Card
      title={
        <Title style={{ color: "#cf2338", fontSize: "30px" }}>
          Edit Assignment
        </Title>
      }
      style={{ color: "#ee1734", width: "50%" }}
    >
      <UserModal
        setUserValue={setUserValue}
        userValue={userValue}
        userDefault={assignmentData.assignedTo}
        state={"edit"}
        show={showLogin}
        close={() => setShowLogin(false)}
      />
      <AssetModal
        setAssetValue={setAssetValue}
        assetValue={assetValue}
        assetDefault={assignmentData.asset}
        state={"edit"}
        show={showAsset}
        close={() => setShowAsset(false)}
      />

      <Form
        form={formAssignment}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        colon={false}
        onFieldsChange={handleFormChange}
        onValuesChange={onValuesChange}
        layout="horizontal"
        onFinish={onSubmit}
        initialValues={defaultValueInput}
      >
        <Form.Item
          label="User"
          name="assignedTo"
          rules={[
            {
              required: true,
              message: "Please enter username",
            },
            {
              whitespace: true,
            },
          ]}
        >
          <Search
            maxLength={256}
            disabled
            className="disable"
            enterButton={customButton}
            onSearch={onSearchUser}
            allowClear={false}
            style={{
              width: "100%",
            }}
          />
        </Form.Item>
        <Form.Item
          label="Asset"
          name="asset"
          rules={[
            {
              required: true,
              message: "Please enter asset name",
            },
            {
              whitespace: true,
            },
          ]}
        >
          <Search
            maxLength={256}
            disabled
            className="disable"
            enterButton={customButton}
            onSearch={onSearchAsset}
            style={{
              width: "100%",
            }}
            allowClear={false}
          />
        </Form.Item>
        <Form.Item
          label="Assigned Date"
          name="assignedDate"
          rules={[
            {
              required: true,
              message: "This field is required!",
            },
          ]}
        >
          <DatePicker
            format={"DD/MM/yyyy"}
            id="date"
            style={{ width: "100%" }}
            disabledDate={disabledDate}
            allowClear={false}
            placeholder={""}
            inputReadOnly={true}
          />
        </Form.Item>
        <Form.Item
          label="Note"
          name="note"
          className="notRequired"
          rules={[
            {
              max: 160,
              message: "The note length should be less than 160 characters",
            },
          ]}
        >
          <TextArea id="note" rows={4} />
        </Form.Item>
        <Space id="space-create">
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              disabled={disabledSave}
              className="submitButton"
            >
              Save
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={cancel} style={{ marginLeft: 20 }}>
              Cancel
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Card>
  );
}

export default EditAssignment;
