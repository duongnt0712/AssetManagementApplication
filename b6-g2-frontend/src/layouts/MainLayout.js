import { Dropdown, Layout, Menu, message, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  CaretDownOutlined,
} from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.css";
import nashtechLogo from "../assets/img/logoNashtech.jpg";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { changePassword } from "../services";
import useAuth from "../hooks/useAuth";
import BreadcrumbCustom from "../components/breadcrumbCustom/BreadcrumbCustom";
import Swal from "sweetalert2";
const { Header, Content, Footer } = Layout;

const Main = () => {
  window.addEventListener("storage", (event) => {
    if (event.storageArea == localStorage) {
      let user = localStorage.getItem("user");
      if (user === undefined) {
        handleLogoutOk();
        navigate("/login");
      }
    }
  });

  const { auth, setAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [isModalLogoutOpen, setIsModalLogoutOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [isModalChangePasswordOpen, setIsModalChangePasswordOpen] =
    useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [oldPasswordShown, setOldPasswordShown] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [fillNewPass, setFillNewPass] = useState(false);
  const [fillOldPass, setFillOldPass] = useState(false);
  const [enableChangePassword, setEnableChangePassword] = useState(true);
  let items = [
    {
      key: "",
      label: "Home",
      url: "/",
    },
    {
      key: "user",
      label: "Manage User",
      url: "/user",
    },
    {
      key: "asset",
      label: "Manage Asset",
      url: "/asset",
    },
    {
      key: "assignment",
      label: "Manage Assignment",
      url: "/assignment",
    },
    {
      key: "return",
      label: "Request for returning",
      url: "/return",
    },
    {
      key: "report",
      label: "Report",
      url: "/report",
    },
  ];
  if (userData?.role === "STAFF") {
    items = [
      {
        key: "home",
        label: "Home",
        url: "/",
      },
    ];
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <a onClick={(event) => changePasswordModal(event)}>Change password</a>
      </Menu.Item>
      <Menu.Item>
        <a onClick={(event) => logout(event)}>Log out</a>
      </Menu.Item>
    </Menu>
  );
  function logout(event) {
    event.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      html: `<span>Do you want to log out?</span>`,
      icon: "error",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#CF2338",
      confirmButtonText: "Log out",
      width: "400px",
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogoutOk();
      }
    });
  }
  const handleLogoutOk = () => {
    if (localStorage.getItem("user")) {
      sessionStorage.clear();
      localStorage.clear();
      setAuth({ isAuthenticated: false });
      message.success("Log out successfully!");
      navigate("/");
    }
  };
  const handleLogoutCancel = () => {
    setIsModalLogoutOpen(false);
  };
  const handleConfirmChangePassSuccess = () => {
    setIsModalConfirmOpen(false);
  };
  function changePasswordModal(event) {
    setIsModalChangePasswordOpen(true);
  }
  const handleChangePasswordOk = () => {
    const oldPassErr = document.getElementById("errOldPass").innerHTML;
    const newPassErr = document.getElementById("errNewPass").innerHTML;

    if (oldPassErr === "" && newPassErr === "") {
      setFillNewPass("false");
      setFillOldPass("false");
      setIsChangePassword(true);
    } else {
      message.error("Please enter correct input!");
    }
  };
  const showNewPassword = (password) => {
    if (password === "oldPass") {
      setOldPasswordShown(!oldPasswordShown);
    } else {
      setNewPasswordShown(!newPasswordShown);
    }
  };
  useEffect(() => {
    if (isChangePassword === true) {
      const oldPass = document.getElementById("oldPass").value;
      const newPass = document.getElementById("newPass").value;
      setIsChangePassword(false);
      changePassword("", newPass, oldPass).then((res) => {
        if (res?.data) {
          document.getElementById("oldPass").value = "";
          document.getElementById("newPass").value = "";
          setIsModalChangePasswordOpen(false);
          setOldPasswordShown(false);
          setNewPasswordShown(false);
          setEnableChangePassword(true);
          Swal.fire({
            html: `<span>Your password has been changed successfully!</span>`,
            icon: "success",
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonColor: "rgb(207, 35, 56)",
            confirmButtonText: "OK",
            width: "400px",
          }).then((result) => {
            if (result.isConfirmed) {
            }
          });
        } else {
          setEnableChangePassword(true);
          setFillNewPass(true);
          setFillOldPass(true);
          document.getElementById("errOldPass").innerHTML =
            res.response.data.error;
        }
      });
    }
  });
  const handleChangePasswordCancel = () => {
    setIsModalChangePasswordOpen(false);
    setFillNewPass("false");
    setFillOldPass("false");
    document.getElementById("oldPass").value = "";
    document.getElementById("newPass").value = "";
    document.getElementById("errOldPass").innerHTML = "";
    document.getElementById("errNewPass").innerHTML = "";
    const inputOldPass = document.getElementById("oldPass");
    inputOldPass.style.borderColor = "black";
    const inputNewPass = document.getElementById("newPass");
    inputNewPass.style.borderColor = "black";
    setEnableChangePassword(true);
    setOldPasswordShown(false);
    setNewPasswordShown(false);
  };
  function checkInput(input, err) {
    if (input === "oldPass") {
      setFillOldPass(true);
    } else {
      setFillNewPass(true);
    }
    const oldPass = document.getElementById("oldPass").value;
    const newPass = document.getElementById("newPass").value;
    const password = document.getElementById(input).value;
    let minCharacter = 8;
    if (oldPass === newPass && oldPass && newPass) {
      const inputField = document.getElementById("newPass");
      inputField.style.borderColor = "red";
      document.getElementById("errNewPass").innerHTML =
        "The new password must be different with your old one, please try again!";
      if (oldPass.length >= 8) {
        const inputField1 = document.getElementById("oldPass");
        inputField1.style.borderColor = "black";
        document.getElementById("errOldPass").innerHTML = "";
      }
    } else {
      if (input === "oldPass" && fillNewPass === true) {
        checkInput("newPass", "errNewPass");
      }
      if (password === "") {
        document.getElementById(err).innerHTML = "This field is required!";
      } else if (password.indexOf(" ") >= 0) {
        document.getElementById(err).innerHTML =
          "Password must not contain space!";
      } else if (password.length < minCharacter) {
        document.getElementById(
          err
        ).innerHTML = `Password must be at least 8 characters`;
      } else {
        if (input === "oldPass" && oldPass !== newPass) {
          checkInput("newPass", "errNewPass");
        }
        document.getElementById(err).innerHTML = "";
      }
    }
    const errOldPass = document.getElementById("errOldPass").innerHTML;
    const errNewPass = document.getElementById("errNewPass").innerHTML;
    if (document.getElementById(err).innerHTML === "") {
      const inputField = document.getElementById(input);
      inputField.style.borderColor = "black";
    } else {
      const inputField = document.getElementById(input);
      inputField.style.borderColor = "red";
    }
    if (
      errOldPass === "" &&
      errNewPass === "" &&
      fillNewPass === true &&
      fillOldPass === true
    ) {
      setEnableChangePassword(false);
    } else {
      setEnableChangePassword(true);
    }
  }
  window.addEventListener("popstate", (event) => {
    setIsModalLogoutOpen(false);
    setIsModalChangePasswordOpen(false);
  });
  return (
    <Layout className="layout">
      <Header className="mainHeader">
        <Container>
          <Row>
            <Col md={11} xs={12}></Col>
            <Col className="menuHeader" md={1}>
              <div>
                {userData ? (
                  <Dropdown.Button icon={<CaretDownOutlined />} overlay={menu}>
                    <span>{userData.username}</span>
                  </Dropdown.Button>
                ) : (
                  <Link to="/login">
                    <Button
                      type="button"
                      className="loginButton"
                      variant="dark"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </Header>
      <Content className="content">
        <Container fluid className="mainContent">
          <Row>
            <Col md={2} xs={12}>
              <>
                <Modal
                  className="modalMainLayout"
                  title="Change Password"
                  open={isModalChangePasswordOpen}
                  onCancel={handleChangePasswordCancel}
                  footer={null}
                  closable={false}
                  keyboard={true}
                  width="450px"
                  height="241px"
                >
                  <div>
                    <table>
                      <tr>
                        <td style={{ width: "29%" }}>Old password</td>
                        <td>
                          <input
                            onChange={() => checkInput("oldPass", "errOldPass")}
                            onPaste={() => checkInput("oldPass", "errOldPass")}
                            type={oldPasswordShown ? "text" : "password"}
                            className="input"
                            id="oldPass"
                          ></input>
                          <span
                            onClick={() => showNewPassword("oldPass")}
                            className="fieldIcon"
                          >
                            {oldPasswordShown ? (
                              <EyeInvisibleOutlined />
                            ) : (
                              <EyeOutlined />
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <p
                            style={{ height: "20px" }}
                            id="errOldPass"
                            className="err"
                          ></p>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ width: "29%" }}>New password</td>
                        <td>
                          <input
                            onChange={() => checkInput("newPass", "errNewPass")}
                            onPaste={() => checkInput("newPass", "errNewPass")}
                            type={newPasswordShown ? "text" : "password"}
                            className="input"
                            id="newPass"
                          ></input>
                          <span
                            onClick={() => showNewPassword("newPass")}
                            id="showPassword"
                            className="fieldIcon"
                          >
                            {newPasswordShown ? (
                              <EyeInvisibleOutlined />
                            ) : (
                              <EyeOutlined />
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <p id="errNewPass" className="err"></p>
                        </td>
                      </tr>
                    </table>
                    <div className="formChangePassword">
                      <button
                        disabled={enableChangePassword}
                        type="button"
                        onClick={handleChangePasswordOk}
                        id="btnSubmitChangePassword"
                        className="btnChangePass"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleChangePasswordCancel}
                        id="btnCancelChangePassword"
                        className="btnChangePass"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Modal>
              </>

              <div className="menuItem">
                <div>
                  <img
                    src={nashtechLogo}
                    alt="nashtech company"
                    className="img-logo"
                  ></img>
                  <div className="title">Online Asset Management</div>
                </div>
                <Menu
                  className="menuButton"
                  selectedKeys={[location.pathname.split("/")[1]]}
                  style={{
                    listStyle: "none",
                  }}
                >
                  {items?.map((item) => (
                    <Menu.Item key={item.key}>
                      <Button className="button" variant="danger">
                        <div className="label">{item.label}</div>
                        <Link to={item.url} />
                      </Button>{" "}
                    </Menu.Item>
                  ))}
                </Menu>
              </div>
            </Col>
            <Col md={10}>
              <div className="outlet">
                <BreadcrumbCustom />
                <Outlet />
              </div>
            </Col>
          </Row>
        </Container>
      </Content>
      <div className="mainFooter">
        <Container fluid className="footerContainer">
          © 2022 NashTech - Part of Nash Squared.
        </Container>
      </div>
    </Layout>
  );
};
export default Main;
