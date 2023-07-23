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
  Modal,
  Divider,
  Card,
} from "antd";
import "../../../assets/styles/createAsset.css";
import { useNavigate } from "react-router-dom";
import {
  createNewAsset,
  createNewCategory,
  getListCategories,
} from "../../../services";
import "../../../assets/styles/createUser.css";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
const { Title } = Typography;

function CreateAsset() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formAsset] = Form.useForm();
  const [disabledSave, setDisabledSave] = useState(true);
  const [disabledSaveCate, setDisabledSaveCate] = useState(true);
  const { TextArea } = Input;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isCreatNewCate, setIsCreateNewCate] = useState(false);
  const [newCate, setNewCate] = useState();
  const [valueSelect, setValueSelect] = useState({});
  const [isFill, setIsFill] = useState(false);
  const [isFillCate, setIsFillCate] = useState(false);
  const [defaultValueSelect, setDefaultValueSelect] = useState({
    state: "Available",
    category: {
      label: "",
      key: "",
    },
  });
  const [asset, setAsset] = useState({
    name: "",
    category: {
      id: "",
      name: "",
    },
    specification: "",
    installedDate: "",
    state: "",
  });
  const [category, setCategory] = useState({
    name: "",
    prefix: "",
  });
  const [isCreateNewAsset, setIsCreateNewAsset] = useState(false);
  const onSubmit = async (data) => {
    if (data.category === undefined && newCate !== undefined) {
      data.category = newCate.value;
      setNewCate(undefined);
    }
    let result = categories.filter((obj) => {
      return obj.id === data.category;
    })[0];
    if (result === undefined) {
      result = categories.filter((obj) => {
        return obj.id === data.category.value;
      })[0];
    }
    data.category = result;
    data.installedDate = data.installedDate.format("YYYY-MM-DD");
    setAsset(data);
    setIsCreateNewAsset(true);
  };
  useEffect(() => {
    if (isCreatNewCate === false) {
      getListCategories().then((data) => {
        if (data.data != null) {
          let listTemp = [];
          data.data.content.forEach((element) => {
            listTemp.push({ label: element.name, value: element.id });
          });
          setCategories(data.data.content);
          if (newCate) {
            let tempRow = listTemp.find((item) => item.value === newCate);
            setValueSelect(defaultValueSelect);
            setDefaultValueSelect({
              state: "Available",
              category: tempRow,
            });
          }
        } else {
        }
      });
    }
  }, [isCreatNewCate]);
  useEffect(() => {
    if (isCreateNewAsset === true) {
      createNewAsset(asset).then((data) => {
        if (data.data != null) {
          let count = 0;
          if (!!sessionStorage.getItem("turn")) {
            let turn = parseInt(sessionStorage.getItem("turn"));
            count = turn + 1;
          }
          sessionStorage.setItem("turn", count);
          localStorage.setItem("count", 0);
          localStorage.setItem("assetCode", data.data.code);
          message.success("Create Asset Successfully");
          navigate("/asset");
        } else {
          message.error("Create Asset Failed");
        }
        setIsCreateNewAsset(false);
      });
    }
  }, [isCreateNewAsset]);

  useEffect(() => {
    formAsset.setFieldsValue(defaultValueSelect);
  }, [formAsset, defaultValueSelect]);

  const onSubmitCate = async (data) => {
    setCategory(data);
    setIsCreateNewCate(true);
    setIsModalOpen(false);
    form.resetFields();
  };
  useEffect(() => {
    if (isCreatNewCate === true) {
      createNewCategory(category).then((data) => {
        if (data.data != null) {
          message.success("Create Category Successfully!");
          setNewCate(data.data.content.id);
        } else {
          if (data.response.data.error === "begin 0, end 2, length 1") {
            message.error("The min length of category name is 2 character!");
          } else {
            message.error(data.response.data.error);
          }
        }
        setIsCreateNewCate(false);
        if (data?.data?.content) {
          const name = document.getElementById("name").value;
          const specification = document.getElementById("specification").value;
          const date = document.getElementById("date").value;
          if (name && specification && date) {
            setDisabledSave(false);
          }
          setValueSelect({
            name: data?.data?.content.name,
            id: data?.data?.content.id,
          });
        }
      });
    }
  }, [isCreatNewCate, valueSelect]);

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const cancel = () => {
    navigate("/asset");
  };
  const handleFormChange = () => {
    const hasErrors = formAsset
      .getFieldsError()
      .some(({ errors }) => errors.length);
    if (isFill === true) {
      setDisabledSave(hasErrors);
    }
  };
  const handleFormCate = () => {
    const hasErrors = form.getFieldsError().some(({ errors }) => errors.length);
    if (isFillCate === true) {
      setDisabledSaveCate(hasErrors);
    }
    handleCateId();
  };
  const onValuesChange = (changedValues, allValues) => {
    if (
      allValues.name !== undefined &&
      allValues.specification !== undefined &&
      allValues.installedDate !== undefined &&
      (allValues.category.label !== "" || newCate)
    ) {
      setIsFill(true);
    }
  };
  const addItem = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };
  const handleCateId = () => {
    setIsFillCate(true);
    let index = 2;
    const cateName = document
      .getElementById("cateName")
      .value.split(" ")
      .join("");
    if (cateName.length >= 2) {
      document.getElementById("prefix").value =
        cateName + " - " + cateName.slice(0, index).toUpperCase();
    } else {
      document.getElementById("prefix").value = "";
    }
    let catePrefix = cateName.slice(0, index).toUpperCase();
    categories.forEach((element) => {
      if (catePrefix === element.id) {
        index++;
        document.getElementById("prefix").value =
          cateName + " - " + cateName.slice(0, index).toUpperCase();
        catePrefix = cateName.slice(0, index).toUpperCase();
      }
    });
  };
  return (
    <Card
      title={
        <Title style={{ color: "#cf2338", fontSize: "30px" }}>
          Create New Asset
        </Title>
      }
      style={{ color: "#ee1734", width: "50%" }}
    >
      <>
        <Modal
          className="modalCreateCategory"
          title="Create new category"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width="400px"
        >
          <Form
            labelCol={{
              span: 10,
            }}
            wrapperCol={{
              span: 15,
            }}
            colon={false}
            form={form}
            layout="horizontal"
            onFieldsChange={handleFormCate}
            onFinish={onSubmitCate}
            autoComplete="off"
            initialValues={{
              prefix: "",
            }}
          >
            <Form.Item
              label="Category name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "This field is required!",
                },
                {
                  whitespace: true,
                  message: "Please enter category name!",
                },
              ]}
            >
              <Input
                onPaste={handleCateId}
                onChange={handleCateId}
                autoComplete="off"
                id="cateName"
                style={{ width: 190 }}
              />
            </Form.Item>
            <Form.Item
              className="notRequired"
              label="Category ID"
              name="prefix"
            >
              <Input id="prefix" disabled style={{ width: 190 }} />
            </Form.Item>
            <Space style={{ marginLeft: 187 }}>
              <Form.Item
                wrapperCol={{
                  offset: 1,
                  span: 10,
                }}
              >
                <Button
                  type="primary"
                  disabled={disabledSaveCate}
                  htmlType="submit"
                  className="btnSubmitCategory"
                >
                  Save
                </Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={handleCancel} style={{ marginLeft: 6 }}>
                  Cancel
                </Button>
              </Form.Item>
            </Space>
          </Form>
        </Modal>
      </>
      <Form
        form={formAsset}
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
        initialValues={defaultValueSelect}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "This field is required!",
            },
            {
              max: 255,
              message: "The asset name length should be 1-255 characters",
            },
            {
              whitespace: true,
              message: "Please enter category name!",
            },
          ]}
        >
          <Input allowClear id="name" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="category"
          rules={[
            {
              required: true,
              message: "Category",
            },
          ]}
        >
          <Select
            id="cate"
            placeholder=""
            dropdownRender={(menu) => (
              <>
                <div className="selectCateBox">{menu}</div>
                <Divider
                  style={{
                    margin: "8px 0",
                  }}
                />
                <Space
                  className="buttonSubmitCate"
                  style={{
                    padding: "0 0px 8px",
                  }}
                >
                  <Button type="text" onClick={addItem}>
                    {<PlusOutlined />} Add item
                  </Button>
                </Space>
              </>
            )}
            options={categories.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Specification"
          name="specification"
          rules={[
            {
              required: true,
              message: "This field is required!",
            },
            {
              max: 255,
              message:
                "The Asset Specification length should be 1-255 characters",
            },
            {
              whitespace: true,
              message: "Please enter specification of asset",
            },
          ]}
        >
          <TextArea allowClear id="specification" rows={4} />
        </Form.Item>
        <Form.Item
          label="Installed date"
          name="installedDate"
          rules={[
            {
              required: true,
              message: "This field is required!",
            },
          ]}
        >
          <DatePicker
            allowClear={false}
            format={"DD/MM/yyyy"}
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
          ]}
        >
          <Radio.Group>
            <Radio value="Available">Available</Radio>
            <br></br>
            <Radio value="Not available">Not available</Radio>
          </Radio.Group>
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

export default CreateAsset;
