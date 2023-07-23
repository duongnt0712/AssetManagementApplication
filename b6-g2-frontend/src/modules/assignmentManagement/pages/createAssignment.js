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
import dayjs from "dayjs";
import "../../../assets/styles/createAssignment.css";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/createUser.css";
import { useEffect, useState } from "react";
import { setUserModalShow } from "../components/commonUser";
import UserModal from "../components/userModal";
import AssetModal from "../components/assetModal";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import { createNewAssignment } from "../../../services";

const { Search } = Input;
const { Title } = Typography;
const customButton = <Button icon={<SearchOutlined />} />;
function CreateAssignment() {
  const navigate = useNavigate();
  const [formAssignment] = Form.useForm();
  const [disabledSave, setDisabledSave] = useState(true);
  const { TextArea } = Input;
  const [isFill, setIsFill] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showAsset, setShowAsset] = useState(false);
  const [assignment, setAssignment] = useState({});
  const [isCreateAssignment, setIsCreateAssignment] = useState(false);
  const [defaultValueInput, setDefaultValueInput] = useState({
    user: "",
    asset: "",
    assignedDate: moment(),
  });
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

  const onSubmit = async (data) => {
    data.assignedTo = userValue;
    data.asset = assetValue;
    data.assignedDate = data.assignedDate.format("YYYY-MM-DD");
    setIsCreateAssignment(true);
    setAssignment(data);
  };
  useEffect(() => {
    if (isCreateAssignment === true) {
      createNewAssignment(assignment).then((data) => {
        if (data.data != null) {
          let count = 0;
          if (!!sessionStorage.getItem("turn")) {
            let turn = parseInt(sessionStorage.getItem("turn"));
            count = turn + 1;
          }
          sessionStorage.setItem("turn", count);
          localStorage.setItem("count", 0);
          localStorage.setItem("assignment-asset", "1");
          localStorage.setItem("assignment", data.data.id);
          message.success("Create Assignment Successfully!");
          navigate("/assignment");
        } else {
          message.error("Create Assignment Failed!");
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
  const onValuesChange = (changedValues, allValues) => {};
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
    if (date !== "" && userValue.username !== "" && assetValue.code !== "") {
      setDisabledSave(false);
    }
  }, [formAssignment, defaultValueInput]);
  useEffect(() => {
    setDefaultValueInput({
      assignedTo: userValue.firstName + " " + userValue.lastName,
      asset: assetValue.name,
    });
  }, [userValue, assetValue]);
  return (
    <Card
      title={
        <Title style={{ color: "#cf2338", fontSize: "30px" }}>
          Create New Assignment
        </Title>
      }
      style={{ color: "#ee1734", width: "50%" }}
    >
      <UserModal
        setUserValue={setUserValue}
        state={"create"}
        userValue={userValue}
        show={showLogin}
        close={() => setShowLogin(false)}
      />
      <AssetModal
        setAssetValue={setAssetValue}
        state={"create"}
        assetValue={assetValue}
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
              message: "This field is required!",
            },
            {
              max: 255,
              message: "The username name length should be 1-255 characters",
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
              message: "This field is required!",
            },
            {
              max: 255,
              message: "The asset length should be 1-255 characters",
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
          className="notRequired"
          name="note"
          required={false}
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

export default CreateAssignment;
