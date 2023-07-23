import { Breadcrumb, Divider } from "antd";
import {
  HomeOutlined,
  SolutionOutlined,
  FileAddOutlined,
  FormOutlined,
  AreaChartOutlined,
  DesktopOutlined,
  ScheduleOutlined,
  SyncOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const BreadcrumbCustom = (props) => {
  const breadcrumbMap = [
    {
      url: "/",
      name: "Home",
      icon: <HomeOutlined />,
    },
    {
      url: "/user",
      name: "Manage User",
      icon: <SolutionOutlined />,
    },
    // {
    //   url: "/auth",
    //   name: "Unauthorization",
    //   icon: <ExclamationCircleOutlined />,
    // },
    {
      url: "/user/create",
      name: "Create New User",
      icon: <FileAddOutlined />,
    },
    {
      url: "/user/edit",
      name: "Edit User",
      icon: <FormOutlined />,
    },
    {
      url: "/asset",
      name: "Manage Asset",
      icon: <DesktopOutlined />,
    },
    {
      url: "/asset/create",
      name: "Create New Asset",
      icon: <FileAddOutlined />,
    },
    {
      url: "/asset/edit",
      name: "Edit Asset",
      icon: <FormOutlined />,
    },
    {
      url: "/assignment",
      name: "Manage Assignment",
      icon: <ScheduleOutlined />,
    },
    {
      url: "/assignment/create",
      name: "Create New Assignment",
      icon: <FileAddOutlined />,
    },
    {
      url: "/assignment/edit",
      name: "Edit Assignment",
      icon: <FormOutlined />,
    },
    {
      url: "/return",
      name: "Request for returning",
      icon: <SyncOutlined />,
    },
    {
      url: "/return/create",
      name: "Create New Request",
      icon: <FileAddOutlined />,
    },
    {
      url: "/return/edit",
      name: "Edit Request",
      icon: <FormOutlined />,
    },
    {
      url: "/report",
      name: "Report",
      icon: <AreaChartOutlined />,
    },
  ];
  const { username } = useParams();
  const { code } = useParams();
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    let url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    let currentBreadcrumb = breadcrumbMap.find((bc) => bc.url === url);
    let url1;
    if (url.endsWith("/edit")) {
      url1 = `/${pathSnippets.slice(0, index + 1).join("/")}/${
        username || code || ""
      }`;
      const matchedUrl = url.split("/", 3).join("/");
      currentBreadcrumb = breadcrumbMap.find((bc) => bc.url === matchedUrl);
    }
    if (url.includes("/edit")) {
      const matchedUrl = url.split("/", 3).join("/");
      currentBreadcrumb = breadcrumbMap.find((bc) => bc.url === matchedUrl);
    }
    return (
      <Breadcrumb.Item key={currentBreadcrumb.url}>
        {currentBreadcrumb.icon}
        <Link to={url1 || url}>{currentBreadcrumb.name}</Link>
      </Breadcrumb.Item>
    );
  });
  if (pathSnippets.includes("edit")) {
    extraBreadcrumbItems.splice(-1);
  }
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <HomeOutlined />
      <Link to="/">Home</Link>
    </Breadcrumb.Item>,
  ].concat(extraBreadcrumbItems);
  return (
    <div className="breadCrumb">
      <Breadcrumb>{breadcrumbItems}</Breadcrumb>
      <Divider />
    </div>
  );
};
export default BreadcrumbCustom;
