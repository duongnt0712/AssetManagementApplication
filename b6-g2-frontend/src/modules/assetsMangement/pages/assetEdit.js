import {
  Form,
  Input,
  Button,
  Radio,
  Select,
  DatePicker,
  Typography,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";
import { Card } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../assets/styles/editAsset.css";
import { getAssetByCode, updateAsset } from "../../../services";
const { Title } = Typography;

const initialAsset = {
  code: "",
  name: "",
  category: "",
  specification: "",
  installedDate: "",
  state: "",
  location: "",
  createdBy: "",
  createdDate: "",
  lastUpdatedBy: "",
  lastUpdatedDate: "",
};

const EditAsset = () => {
  let { code } = useParams();
  const [click, setClick] = useState(true);
  const [assetData, setAssetData] = useState(initialAsset);
  const [loading, setIsLoading] = useState(false);
  const [noAsset, setNoAsset] = useState(false);
  const [admin, setAdmin] = useState("");
  useEffect(() => {
    getAssetByCode(code).then((data) => {
      setAdmin(JSON.parse(window.localStorage.getItem("user")).username);
      if (data.data != null) {
        const asset = data.data.content;
        setAssetData({
          code: asset.code,
          name: asset.name,
          category: {
            id: asset.category.id,
            name: asset.category.name,
          },
          specification: asset.specification,
          installedDate: asset.installedDate,
          state: asset.state,
          createdBy: asset.createdBy,
          createdDate: asset.createdDate,
          location: {
            id: asset.location.id,
            name: asset.location.name,
          },
        });
        setIsLoading(true);
        setNoAsset(false);
      } else {
        setNoAsset(true);
      }
    });
  }, [code]);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    data.installedDate = data.installedDate.format("yyyy-MM-DD");
    var regexPattern = /\s+/g;
    var name = data.name.replace(regexPattern, " ");
    data.name = name.trim();
    data.specification = data.specification.trim();
    const assetInfor = {
      ...data,
      category: {
        id: assetData.category.id,
        name: assetData.category.name,
      },
      code: assetData.code,
      createdBy: assetData.createdBy,
      createdDate: assetData.createdDate,
      location: {
        id: assetData.location.id,
        name: assetData.location.name,
      },
      lastUpdatedBy: admin,
    };
    if (click === true) {
      setClick(false);
      const edit = await updateAsset(assetInfor, code);
      const editData = edit?.data;
      if (editData) {
        let count = 0;
        if (!!sessionStorage.getItem("turn")) {
          let turn = parseInt(sessionStorage.getItem("turn"));
          count = turn + 1;
        }
        sessionStorage.setItem("turn", count);
        localStorage.setItem("assetCode", editData.code);
        localStorage.setItem("count", 0);
        message.success("Edit Asset Successfully!");
        navigate("/asset");
      } else {
        message.error("Edit Asset Failed!");
      }
    }
  };
  const cancel = () => {
    navigate("/asset");
  };

  const checkDisableBtn = (name, specification, installedDate) => {
    if (name === undefined ||
      name.trim() === "" ||
      name.length > 255 ||
      specification === undefined ||
      specification.trim() === "" ||
      specification.length > 255 ||
      installedDate === undefined ||
      installedDate === null) {
      document.getElementById("btn").disabled = true;
      document.getElementById("btn").style.backgroundColor = "lightcoral";
    } else {
      document.getElementById("btn").disabled = false;
      document.getElementById("btn").style.backgroundColor = "#cf2338";
    }
  };

  return (
    <Card
      title={
        <Title style={{ color: "#cf2338", fontSize: "30px" }}>Edit Asset</Title>
      }
      style={{ color: "#ee1734", width: "50%" }}
    >
      {noAsset && <div>No Asset Data</div>}
      {loading && (
        <>
          <Form
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
            className="editAssetForm"
            layout="horizontal"
            onFinish={onSubmit}
            colon={false}
            initialValues={{
              name: assetData.name,
              state: assetData.state,
              category: assetData.category.name,
              specification: assetData.specification,
              installedDate: moment(assetData.installedDate, "yyyy-MM-DD"),
            }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please enter Asset Name",
                },
                {
                  max: 255,
                  message: "The Asset Name length should be 1-255 characters",
                },
                {
                  whitespace: true,
                  message: "Please enter Asset Name",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value !== undefined) {
                      checkDisableBtn(
                        getFieldValue("name"),
                        getFieldValue("specification"),
                        getFieldValue("installedDate")
                      );

                      if (value.length > 255 || value.trim() === "") {
                        return Promise.reject();
                      } else {
                        return Promise.resolve();
                      }
                    }
                  },
                }),
              ]}
            >
              <Input allowClear/>
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true }]}
            >
              <Select disabled></Select>
            </Form.Item>

            <Form.Item
              label="Specification"
              name="specification"
              rules={[
                {
                  required: true,
                  message: "Please enter Asset Specification",
                },
                {
                  max: 255,
                  message:
                    "The Asset Specification length should be 1-255 characters",
                },
                {
                  whitespace: true,
                  message: "Please enter Asset Specification",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value !== undefined) {
                      checkDisableBtn(
                        getFieldValue("name"),
                        getFieldValue("specification"),
                        getFieldValue("installedDate")
                      );
                      if (value.length > 255 || value.trim() === "") {
                        return Promise.reject();
                      } else {
                        return Promise.resolve();
                      }
                    }
                  },
                }),
              ]}
            >
              <Input.TextArea rows={4} allowClear/>
            </Form.Item>

            <Form.Item
              label="Installed Date"
              name="installedDate"
              rules={[
                {
                  required: true,
                  message: "Please enter Installed Date",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (value !== undefined) {
                      checkDisableBtn(
                        getFieldValue("name"),
                        getFieldValue("specification"),
                        getFieldValue("installedDate")
                      );
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <DatePicker
                format={"DD/MM/yyyy"}
                allowClear={false}
                style={{ width: "100%" }}
                placeholder={""}
                inputReadOnly={true}
              />
            </Form.Item>
            <Form.Item
              label="State"
              className="state"
              name="state"
              rules={[
                {
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    checkDisableBtn(
                      getFieldValue("name"),
                      getFieldValue("specification"),
                      getFieldValue("installedDate")
                    );
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Radio.Group>
                <Radio value="Available">Available </Radio>
                <br></br>
                <Radio value="Not available">Not available</Radio>
                <br></br>
                <Radio value="Waiting for recycling">
                  Waiting for recycling
                </Radio>
                <br></br>
                <Radio value="Recycled">Recycled</Radio>
              </Radio.Group>
            </Form.Item>

            <Space id="space">
              <Form.Item
                wrapperCol={{
                  offset: 8,
                  span: 16,
                }}
              >
                <Button
                  disabled
                  id="btn"
                  type="primary"
                  htmlType="submit"
                  style={{ backgroundColor: "lightcoral", color: "white" }}
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
        </>
      )}
    </Card>
  );
};

export default EditAsset;
