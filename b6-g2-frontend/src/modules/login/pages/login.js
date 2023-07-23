import React, { useEffect, useState } from "react";
import "../../../assets/styles/login.css";
import Button from "react-bootstrap/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { login, changePassword } from "../../../services";
import { message, Modal, Layout } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import "bootstrap/dist/css/bootstrap.css";
import nashtechLogo from "../../../assets/img/nashtech-logo.jpg";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import useAuth from "../../../hooks/useAuth";

const { Header, Content, Footer } = Layout;
function Login() {
  window.addEventListener("storage", (event) => {
    if (event.storageArea == localStorage) {
      let user = localStorage.getItem("user");
      if (user !== undefined) {
        navigate("/");
      }
    }
  });
  const [user, setUser] = useState({ username: "", password: "" });
  const { auth, setAuth } = useAuth();
  const [userData, setUserData] = useState({
    token: "",
    refreshToken: "",
    type: "",
    username: "",
    role: "",
    isFirstTimeLogin: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [onFirstTimeUsername, setonFirstTimeUsername] = useState(true);
  const [onFirstTimePassword, setonFirstTimePassword] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [newPasswordShown, setNewPasswordShown] = useState(false);
  const [enableChangePassword, setEnableChangePassword] = useState(true);
  const [enableLogin, setEnableLogin] = useState(true);
  const [isFillPassword, setIsFillPassword] = useState(false);
  const submitLogin = (event) => {
    event.preventDefault();
    if (onFirstTimeUsername === false && onFirstTimePassword === false) {
      const userAccount = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
      };
      setIsLogin(true);
      setUser(userAccount);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
    if (isLogin === true) {
      setIsLogin(false);
      login(user)
        .then((res) => {
          if (res?.data) {
            const userInfo = JSON.stringify(res.data);
            setUserData(userInfo);
            setAuth({ isAuthenticated: true });
            sessionStorage.setItem("user", userInfo);
            if (res.data.isFirstTimeLogin === true) {
              setIsModalOpen(true);
            } else {
              localStorage.setItem("user", userInfo);
              message.success("Login successfully!");
              navigate("/");
            }
          } else {
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            message.error(res.response.data.error);
            setEnableLogin(true);
            setonFirstTimePassword(true);
            setonFirstTimeUsername(true);
          }
        })
        .catch((error) => {
          message.error("Username is incorrect. Please try again");
          document.getElementById("username").value = "";
          document.getElementById("password").value = "";
          setEnableLogin(true);
          setonFirstTimePassword(true);
          setonFirstTimeUsername(true);
        });
    }
  }, [user]);
  function checkInput(input, err, span) {
    var format = /[!-\/:-@[-`{-~]/;
    const username = document.getElementById(input).value;
    let minCharacter = 2;
    let maxCharacter = 50;
    if (input === "password" || input === "newPassword") {
      minCharacter = 8;
      maxCharacter = 1000;
    }
    if (username === "") {
      if (input === "username") {
        document.getElementById(err).innerHTML = "Please enter your username!";
      } else {
        document.getElementById(err).innerHTML = "Please enter your password!";
      }
    } else if (username.indexOf(" ") >= 0) {
      if (input === "username") {
        document.getElementById(err).innerHTML =
          "Username must not contain space!";
      } else {
        document.getElementById(err).innerHTML =
          "Password must not contain space!";
      }
    } else if (
      username.length < minCharacter ||
      username.length > maxCharacter
    ) {
      if (input === "username") {
        document.getElementById(err).innerHTML =
          "Username must be 2-50 characters!";
      } else {
        document.getElementById(err).innerHTML =
          "Password must be at least 8 characters!";
      }
    } else if (format.test(username) && input === "username") {
      document.getElementById(err).innerHTML =
        "Username should contain alphabet and numeric characters!";
    } else {
      document.getElementById(err).innerHTML = "";
    }
    if (document.getElementById(err).innerHTML === "") {
      const inputField = document.getElementById(input);
      inputField.style.borderColor = "black";
    } else {
      const inputField = document.getElementById(input);
      inputField.style.borderColor = "red";
    }
    if (input === "username") {
      setonFirstTimeUsername(false);
    } else if (input === "newPassword") {
      setIsFillPassword(true);
    } else {
      setonFirstTimePassword(false);
    }
  }
  function formChange() {
    const username = document.getElementById("errUsername").innerHTML;
    const password = document.getElementById("errPassword").innerHTML;

    if (
      username === "" &&
      password === "" &&
      onFirstTimeUsername === false &&
      onFirstTimePassword === false
    ) {
      setEnableLogin(false);
    } else {
      setEnableLogin(true);
    }

    if (isFillPassword === true) {
      const newPass = document.getElementById("errNewPass").innerHTML;
      if (newPass === "") {
        setEnableChangePassword(false);
      } else {
        setEnableChangePassword(true);
      }
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
    const err = document.getElementById("errNewPass").innerHTML;
    const newPass = document.getElementById("newPassword").value;
    if (err === "") {
      setIsChangePassword(true);
      setPassword(newPass);
    } else {
      message.error("Enter valid new password!");
    }
  };
  const showPassword = (pass) => {
    if (pass === "changePass") {
      setNewPasswordShown(!newPasswordShown);
    } else {
      setPasswordShown(!passwordShown);
    }
  };
  useEffect(() => {
    if (isChangePassword === true) {
      setIsChangePassword(false);
      changePassword(user.username, password, "").then((res) => {
        if (res?.data) {
          localStorage.setItem("user", window.sessionStorage.getItem("user"));
          message.success("Login successfully!");
          document.getElementById("newPassword").value = "";
          navigate("/");
        } else {
          message.error("Something went error!");
          sessionStorage.clear();
          localStorage.clear();
          document.getElementById("newPassword").value = "";
        }
      });
      setIsModalOpen(false);
    }
  }, [password]);
  const handleCancel = () => {
    message.error("Please change your password!");
  };
  return (
    <Layout className="layout">
      <Header className="mainHeader">
        <Container fluid>
          <img
            src={nashtechLogo}
            alt="nashtech company"
            // className="img-logo"
            width="100px"
          ></img>
          <br></br>
        </Container>
      </Header>
      <Content className="content">
        <Container fluid className="mainContent">
          <Row>
            <form onChange={formChange} onSubmit={submitLogin}>
              <Modal
                className="modalMainLayout"
                title="Change password"
                closable={false}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                width="400px"
                height="238px"
              >
                <span>
                  This is the first time you logged in.<br></br>
                  You have to change your password to continue.
                </span>
                <input
                  className="input"
                  id="newPassword"
                  onPaste={() => checkInput("newPassword", "errNewPass")}
                  onChange={() => checkInput("newPassword", "errNewPass")}
                  type={newPasswordShown ? "text" : "password"}
                  required
                ></input>
                <span
                  onClick={() => showPassword("changePass")}
                  id="changePass"
                  className="eyeIcon"
                >
                  {newPasswordShown ? (
                    <EyeInvisibleOutlined />
                  ) : (
                    <EyeOutlined />
                  )}
                </span>

                <div className="err" id="errNewPass"></div>
                <div className="formChangePassword">
                  <button
                    disabled={enableChangePassword}
                    type="button"
                    onClick={handleOk}
                    id="btnSubmitChangePassword"
                    className="btnChangePass"
                  >
                    Save
                  </button>
                </div>
              </Modal>
              <div className="loginBody">
                <div className="inputBox">
                  <input
                    id="username"
                    className="inputLogin"
                    onPaste={() =>
                      checkInput("username", "errUsername", "spanUsername")
                    }
                    onChange={() =>
                      checkInput("username", "errUsername", "spanUsername")
                    }
                    type="text"
                    required
                  ></input>
                  <span id="spanUsername" className="holder">
                    Username
                  </span>
                  <div className="err" id="errUsername"></div>
                </div>
                <div className="inputBox">
                  <input
                    id="password"
                    className="inputLogin"
                    style={{}}
                    onPaste={() =>
                      checkInput("password", "errPassword", "spanPassword")
                    }
                    onChange={() =>
                      checkInput("password", "errPassword", "spanPassword")
                    }
                    type={passwordShown ? "text" : "password"}
                    required
                  ></input>
                  <span id="spanPassword" className="holder">
                    Password
                  </span>
                  <span
                    onClick={() => showPassword("password")}
                    id="password"
                    className="field-icon"
                  >
                    {passwordShown ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                  </span>
                  <div className="err" id="errPassword"></div>
                </div>
                <Button
                  disabled={enableLogin}
                  id="loginButton"
                  type="submit"
                  className="buttonLogin"
                  variant="secondary"
                >
                  Login
                </Button>{" "}
              </div>
            </form>
          </Row>
        </Container>
      </Content>
    </Layout>
  );
}

export default Login;
