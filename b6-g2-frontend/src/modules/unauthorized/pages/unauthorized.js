import { Layout } from "antd";
import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import nashtechLogo from "../../../assets/img/nashtech-logo.jpg";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import "../../../assets/styles/unAuthentication.css";
const { Header, Content, Footer } = Layout;

const Unauthorization = () => {
  return (
    <Layout className="layout">
      <Header className="mainHeader">
        <Container fluid>
          <img src={nashtechLogo} alt="nashtech company" width="100px"></img>
          <br></br>
        </Container>
      </Header>
      <Content className="content">
        <Container fluid className="contentBody">
          <Row>
            <div className="authMess">
              <ion-icon name="warning-outline"></ion-icon>
              You not have permission to access this page!!!
            </div>
          </Row>
        </Container>
      </Content>
      <Footer className="mainFooter">
        <Container fluid className="footerContainer">
          © 2022 NashTech<br></br>
          Part of Nash Squared.
        </Container>
      </Footer>
    </Layout>
  );
};
export default Unauthorization;
