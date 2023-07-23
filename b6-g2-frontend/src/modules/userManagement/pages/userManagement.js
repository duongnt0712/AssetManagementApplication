import { React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import PageHeader from "../../../components/pageheader/PageHeader";
import { useNavigate, Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TableINDEX from "../../../components/table";
import { Space } from "antd";
import Swal from "sweetalert2";
import {
  getListUser,
  disableUser,
  getUserByUsername,
} from "../../../services/index.js";
import {
  handleSort,
  onChangeSearch,
  onChangeSort,
  onPageVisit,
} from "../../../components/methods/methods";
import { useLayoutEffect } from "react";
function User() {
  const navigate = useNavigate();
  const [dataChangeStatus, setDataChangeStatus] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [sortInput, setSortInput] = useState("");
  let [listUser, setListUser] = useState([]);
  const [totalElements, setTotalElements] = useState();

  useEffect(() => {
    onPageVisit();
    getListUser(pageIndex - 1, searchInput, sortInput, typeInput).then(
      (response) => {
        let temp = response.data.content.content.map(dateFormat);
        const username = localStorage.getItem("username");
        let count = 0;
        if (!!localStorage.getItem("count")) {
          count = parseInt(localStorage.getItem("count"), 10);
        }

        if (
          performance.navigation.type === performance.navigation.TYPE_NAVIGATE
        ) {
          count = count + 1;
          localStorage.setItem("count", count);
          if (count > 0) {
            localStorage.removeItem("count");
            localStorage.removeItem("username");
          }
        }
        if (
          performance.navigation.type === performance.navigation.TYPE_RELOAD
        ) {
          count = count + 1;
          localStorage.setItem("count", count);
          if (parseInt(sessionStorage.getItem("turn"), 10) == 0) {
            if (count > 0) {
              localStorage.removeItem("count");
              localStorage.removeItem("username");
            }
          } else {
            if (count > 0) {
              localStorage.removeItem("count");
              localStorage.removeItem("username");
            }
          }
        }

        if (!username) {
          setListUser(temp);
        } else {
          let tempRow = temp.find((item) => item.username === username);
          if (tempRow) {
            temp = temp.filter((item) => item.username !== username);
            tempRow = dateFormat(tempRow);
            temp.unshift(tempRow);
            setListUser(temp);
          } else {
            getUserByUsername(username).then((res) => {
              tempRow = dateFormat(res.data.content);
              temp.slice(0, -1);
              temp.unshift(tempRow);
              setListUser(temp);
            });
          }
        }
        setTotalElements(response.data.content.totalElements);
        setDataChangeStatus(0);
      }
    );
  }, [pageIndex, searchInput, typeInput, sortInput, dataChangeStatus]);
  function dateFormat(props) {
    return {
      ...props,
      dob: props.dob.split("-").reverse().join("-"),
      joinedDate: props.joinedDate.split("-").reverse().join("-"),
    };
  }
  const role = [
    {
      label: "Admin",
      value: "ADMIN",
    },
    {
      label: "Staff",
      value: "STAFF",
    },
  ];
  const columns = [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      sorter: {
        multiple: 1,
      },
      width: "15%",
      render: (text) => <a>{text}</a>,
      onCell: (record) => {
        return {
          onClick: () => {
            Swal.fire({
              title: "User Details",
              icon: "info",
              showConfirmButton: false,
              html: `<table  class="table" style="text-align :left"><tr><td width="40%">Staff Code</td><td width="60%">${record.staffCode}</td></tr><tr><td width="40%">Full Name</td><td width="60%">${record.firstName} ${record.lastName}</td></tr><tr><td width="40%">Username</td><td width="60%">${record.username}</td></tr><tr><td width="40%">Date of Birth</td><td width="60%">${record.dob}</td></tr><tr><td width="40%">Gender</td><td width="60%">${record.gender}</td></tr><tr><td width="40%">Type</td><td width="60%">${record.type}</td></tr><tr><td width="40%">Location</td><td width="60%">${record.location.name}</td></tr></table>`,
            });
          },
        };
      },
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      width: "20%",
      ellipsis: true,
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
      sorter: {
        multiple: 2,
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      width: "20%",
      ellipsis: true,
    },
    {
      title: "Joined Date",
      dataIndex: "joinedDate",
      sorter: {
        multiple: 3,
      },
      width: "20%",
    },
    {
      title: "Type",
      dataIndex: "type",
      sorter: {
        multiple: 4,
      },
      width: "15%",
    },
    {
      title: null,
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <Space>
          <>
            <Link to={`./edit/${record.username}`}>
              <div className="icon-custom-small">
                <EditOutlined className="xIcon" />
              </div>
            </Link>
            <Link
              onClick={() => {
                Swal.fire({
                  title: "",
                  html: `<div style="font-size:20px">Do you want to disable this user?</div>`,
                  icon: "question",
                  confirmButtonText: "Disable",
                  showCancelButton: true,
                  showConfirmButton: true,
                  confirmButtonColor: "#CF2338",
                  confirmButtonText:"Disable",
                }).then((result) => {
                  if (result.isConfirmed) {
                    disableUser(record.username).then((res) => {
                      if (res.data.content === false) {
                        Swal.fire({
                          title: "Error!",
                          icon: "error",
                          html: "There are valid assignments belonging to this user. Please close all assignments before disabling user.",
                          showCloseButton: true,
                          showConfirmButton: false,
                        });
                      } else {
                        setDataChangeStatus(1);
                        Swal.fire({
                          title: "Disabled",
                          icon: "success",
                          showConfirmButton: true,
                          confirmButtonColor: "#CF2338",
                          allowEscapeKey: true,
                        });
                      }
                    });
                  }
                });
              }}
            >
              <div className="icon-custom-small">
                <DeleteOutlined className="tickIcon" />
              </div>
            </Link>
          </>
        </Space>
      ),
    },
  ];

  const searchAction = (value) => {
    setSearchInput(onChangeSearch(value));
    setPageIndex(1);
  };
  const sortAction = (value) => {
    setTypeInput(onChangeSort(value));
    setPageIndex(1);
  };

  const handlePageChange = (newpage) => {
    setPageIndex(newpage);
  };
  const onChange = (pagination, filters, sorter, extra) => {
    setSortInput(handleSort(sorter));
  };
  const menu = [
    {
      type: "SortBar",
      props: {
        menu: role,
        handleChange: sortAction,
        placeholder: "Type",
      },
    },
    {
      type: "SearchBar",
      props: {
        onSearch: searchAction,
      },
    },
    {
      type: "CreateBtn",
      props: {
        buttonTitle: "Create new User",
        onClick: () => navigate("./create"),
      },
    },
  ];
  return (
    <div>
      <PageHeader tableName="User list" menu={menu} />
      <TableINDEX
        tableOnchange={onChange}
        columns={columns}
        totalElements={totalElements}
        data={listUser || []}
        pagination={{
          current: pageIndex,
          pageSize: 10,
          total: totalElements,
          onChange: handlePageChange,
          size: "medium",
        }}
      />
    </div>
  );
}

export default User;
