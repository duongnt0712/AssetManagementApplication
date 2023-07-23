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
import moment from "moment";
import { Card } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../../assets/styles/editUser.css";
import { getUserByUsername, updateUser } from "../../../services";
const { Title } = Typography;

const initialUser = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  joinedDate: "",
  type: "",
  createdBy: "",
  createdDate: "",
  lastUpdatedBy: "",
  lastUpdatedDate: "",
  location: "",
  staffCode: "",
  status: "",
  username: "",
};

const EditUser = () => {
  let { username } = useParams();
  const [click, setClick] = useState(true);
  const [userData, setUserData] = useState(initialUser);
  const [loading, setIsLoading] = useState(false);
  const [noUser, setNoUser] = useState(false);
  const [admin, setAdmin] = useState("");
  useEffect(() => {
    getUserByUsername(username).then((data) => {
      setAdmin(JSON.parse(window.localStorage.getItem("user")).username);
      if (data.data != null) {
        const user = data.data.content;
        setUserData({
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          type: user.type,
          dob: user.dob,
          joinedDate: user.joinedDate,
          createdBy: user.createdBy,
          createdDate: user.createdDate,
          staffCode: user.staffCode,
          status: user.status,
          username: user.username,
          location: {
            id: user.location.id,
            name: user.location.name,
          },
        });
        setIsLoading(true);
        setNoUser(false);
      } else {
        setNoUser(true);
      }
    });
  }, [username]);
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    data.dob = data.dob.format("yyyy-MM-DD");
    data.joinedDate = data.joinedDate.format("yyyy-MM-DD");
    const userInfor = {
      ...data,
      createdBy: userData.createdBy,
      createdDate: userData.createdDate,
      staffCode: userData.staffCode,
      status: userData.status,
      username: userData.username,
      location: {
        id: userData.location.id,
        name: userData.location.name,
      },
      lastUpdatedBy: admin,
    };
    if (click === true) {
      setClick(false);
      const edit = await updateUser(userInfor, username);
      const editData = edit?.data;
      if (editData) {
        let count = 0;
        if (!!sessionStorage.getItem("turn")) {
          let turn = parseInt(sessionStorage.getItem("turn"));
          count = turn + 1;
        }
        sessionStorage.setItem("turn", count);
        localStorage.setItem("username", editData.username);
        localStorage.setItem("count", 0);
        message.success("Edit User Successfully!");
        navigate("/user");
      } else {
        message.error("Edit User Failed!");
      }
    }
  };
  const disabledDate = (current) => {
    return current && current > dayjs().endOf("day");
  };

  const cancel = () => {
    navigate("/user");
  };
  let newDate = new Date();
  const checkDisableBtn = (dob, joinedDate, type) => {
    if (
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
    <>
      <Card
        title={
          <Title style={{ color: "#cf2338", fontSize: "30px" }}>
            Edit User
          </Title>
        }
        style={{ color: "#ee1734", width: "50%" }}
      >
        {noUser && <div>No User Data</div>}
        {loading && (
          <>
            <Form
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              className="editUserForm"
              layout="horizontal"
              onFinish={onSubmit}
              colon={false}
              initialValues={{
                firstName: userData.firstName,
                lastName: userData.lastName,
                gender: userData.gender,
                type: userData.type,
                dob: moment(userData.dob, "yyyy-MM-DD"),
                joinedDate: moment(userData.joinedDate, "yyyy-MM-DD"),
              }}
            >
              <Form.Item
                className="notRequired"
                label="First Name"
                name="firstName"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                className="notRequired"
                label="Last Name"
                name="lastName"
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                label="Date of Birth"
                name="dob"
                rules={[
                  {
                    required: true,
                    message: "This field is required",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      checkDisableBtn(
                        getFieldValue("dob"),
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
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      checkDisableBtn(
                        getFieldValue("dob"),
                        getFieldValue("joinedDate"),
                        getFieldValue("type")
                      );
                      return Promise.resolve();
                    },
                  }),
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
                    message: "This field is required",
                  },

                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      checkDisableBtn(
                        getFieldValue("dob"),
                        getFieldValue("joinedDate"),
                        getFieldValue("type")
                      );
                      if (getFieldValue("dob") == null) {
                        return Promise.reject(
                          "Please input date of birth first"
                        );
                      }
                      if (value === null) {
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
                        getFieldValue("dob"),
                        getFieldValue("joinedDate"),
                        getFieldValue("type")
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
              <Space id="space-edit">
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
    </>
  );
};

export default EditUser;
