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
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../services";
import "../../../assets/styles/createUser.css";
import { useState } from "react";
import { Card } from "antd";
const { Title } = Typography;

function CreateUser() {
  const [click, setClick] = useState(true);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    var regexPattern = /\s+/g;
    var firstName = data.firstName.replace(regexPattern, " ");
    var lastName = data.lastName.replace(regexPattern, " ");
    data.firstName = firstName.trim();
    data.lastName = lastName.trim();
    data.dob = data.dob.format("yyyy-MM-DD");
    data.joinedDate = data.joinedDate.format("yyyy-MM-DD");
    if (click === true) {
      setClick(false);
      const create = await createUser(data);
      const createData = create?.data;
      if (createData) {
        let count = 0;
        if (!!sessionStorage.getItem("turn")) {
          let turn = parseInt(sessionStorage.getItem("turn"));
          count = turn + 1;
        }
        sessionStorage.setItem("turn", count);
        localStorage.setItem("username", createData.username);
        localStorage.setItem("count", 0);
        message.success("Create User Successfully!");
        navigate("/user");
      } else {
        message.error("Create User Failed!");
      }
    }
  };
  const cancel = () => {
    navigate("/user");
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };
  let newDate = new Date();
  const checkDisableBtn = (firstName, lastName, dob, joinedDate, type) => {
    if (
      firstName === undefined ||
      firstName.trim() === "" ||
      firstName.length > 50 ||
      lastName === undefined ||
      lastName.trim() === "" ||
      lastName.length > 50 ||
      dob === undefined ||
      dob === null ||
      newDate.getFullYear() - dob.year() < 18 ||
      joinedDate === undefined ||
      joinedDate === null ||
      dob > joinedDate ||
      joinedDate.year() - dob.year() < 18 ||
      joinedDate.day() === 0 || joinedDate.day() === 6 ||
      type === undefined
    ) {
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
        <Title style={{ color: "#cf2338", fontSize: "30px" }}>
          Create New User
        </Title>
      }
      style={{ color: "#ee1734", width: "50%" }}
    >
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        colon={false}
        layout="horizontal"
        className="createUserForm"
        onFinish={onSubmit}
        initialValues={{
          gender: "FEMALE",
        }}
      >
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            {
              required: true,
              message: "Please enter your First Name",
            },
            {
              max: 50,
              message: "The First Name length should be 1-50 characters",
            },
            {
              whitespace: true,
              message: "Please enter your First Name",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value !== undefined) {
                  checkDisableBtn(
                    value,
                    getFieldValue("lastName"),
                    getFieldValue("dob"),
                    getFieldValue("joinedDate"),
                    getFieldValue("type")
                  );

                  if (value.length > 50 || value.trim() === "") {
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
          label="Last Name"
          name="lastName"
          rules={[
            {
              required: true,
              message: "Please enter your Last Name",
            },
            {
              max: 50,
              message: "The Last Name length should be 1-50 characters",
            },
            {
              whitespace: true,
              message: "Please enter your Last Name",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (value !== undefined) {
                  checkDisableBtn(
                    getFieldValue("firstName"),
                    value,
                    getFieldValue("dob"),
                    getFieldValue("joinedDate"),
                    getFieldValue("type")
                  );
                  if (value.length > 50 || value.trim() === "") {
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
          label="Date of Birth"
          name="dob"
          rules={[
            {
              required: true,
              message: "Please input date of birth!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                checkDisableBtn(
                  getFieldValue("firstName"),
                  getFieldValue("lastName"),
                  value,
                  getFieldValue("joinedDate"),
                  getFieldValue("type")
                );
                let newDate = new Date();
                let year = newDate.getFullYear();

                if (value === null) {
                  document.getElementById("btn").disabled = true;
                  return Promise.reject();
                }
                const age = year - value.year();
                if (age < 18) {
                  return Promise.reject(
                    "User is under 18. Please select a different date"
                  );
                } else {
                  return Promise.resolve();
                }
              },
            }),
          ]}
        >
          <DatePicker
            format={"DD/MM/yyyy"}
            style={{ width: "100%" }}
            allowClear={false}
            placeholder={""}
            disabledDate={disabledDate}
            inputReadOnly={true}
          />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Radio.Group style={{ width: 300 }}>
            <Radio value="FEMALE"> Female </Radio>
            <Radio value="MALE">Male </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Joined Date"
          name="joinedDate"
          dependencies={["dob"]}
          rules={[
            {
              required: true,
              message: "Please input joined of date!",
            },

            ({ getFieldValue }) => ({
              validator(_, value) {
                checkDisableBtn(
                  getFieldValue("firstName"),
                  getFieldValue("lastName"),
                  getFieldValue("dob"),
                  value,
                  getFieldValue("type")
                );

                if (getFieldValue("dob") == null) {
                  return Promise.reject("Please input date of birth first");
                }
                if (value == null) {
                  document.getElementById("btn").disabled = true;
                  return Promise.reject();
                }

                if (value !== null && getFieldValue("dob") !== null) {
                  if (getFieldValue("dob") > value) {
                    return Promise.reject(
                      "Joined date is not later than Date of Birth. Please select a different date"
                    );
                  } else {
                    if (value.year() - getFieldValue("dob").year() < 18) {
                      return Promise.reject(
                        "User is under 18. Please select a different date"
                      );
                    } else {
                      if (value.day() === 0 || value.day() === 6) {
                        return Promise.reject(
                          "Joined date is Saturday or Sunday. Please select a different date"
                        );
                      } else {
                        return Promise.resolve();
                      }
                    }
                  }
                }
              },
            }),
          ]}
        >
          <DatePicker
            format={"DD/MM/yyyy"}
            style={{ width: "100%" }}
            allowClear={false}
            placeholder={""}
            disabledDate={disabledDate}
            inputReadOnly={true}
          />
        </Form.Item>
        <Form.Item
          label="Type"
          name="type"
          rules={[
            {
              required: true,
              message: "Please choose type of user!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                checkDisableBtn(
                  getFieldValue("firstName"),
                  getFieldValue("lastName"),
                  getFieldValue("dob"),
                  getFieldValue("joinedDate"),
                  value
                );
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Select>
            <Select.Option value="STAFF">Staff</Select.Option>
            <Select.Option value="ADMIN">Admin</Select.Option>
          </Select>
        </Form.Item>
        <Space id="space-create">
          <Form.Item>
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
            <Button onClick={cancel}>Cancel</Button>
          </Form.Item>
        </Space>
      </Form>
    </Card>
  );
}

export default CreateUser;
