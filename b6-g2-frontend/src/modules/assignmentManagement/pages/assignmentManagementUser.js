import { React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import PageHeader from "../../../components/pageheader/PageHeader";
import "../../../assets/styles/assignmentManagementUser.css";
import { useNavigate, Link } from "react-router-dom";
import { UndoOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import TableINDEX from "../../../components/table";
import { Button, Space } from "antd";
import Swal from "sweetalert2";
import {
  getListAssginments,
  getListAssginmentsUser,
  responForAssignment,
  createReturningRequest,
} from "../../../services";
import {
  dateFormatForAssignment,
  handleSort,
  onChangeSearch,
  onPageVisit,
} from "../../../components/methods/methods";
function AssignmentUser() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  let [listAssginments, setListAssignment] = useState([]);
  const [totalElements, setTotalElements] = useState();
  const navigate = useNavigate();
  const [deleteStatus, setDeleteStatus] = useState(0);
  const [returningStatus, setReturningStatus] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [assignedDateInput, setassignedDateInput] = useState("");
  const [sortInput, setSortInput] = useState("");
  useEffect(() => {
    onPageVisit();

    getListAssginmentsUser(
      user.username,
      pageIndex - 1,
      searchInput,
      assignedDateInput,
      sortInput,
      stateInput
    ).then((response) => {
      let temp = response.data.content.content.map(dateFormatForAssignment);
      const assetCode = localStorage.getItem("assetCode");
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
          localStorage.removeItem("assetCode");
        }
      }
      if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        count = count + 1;
        localStorage.setItem("count", count);
        if (parseInt(sessionStorage.getItem("turn"), 10) === 0) {
          if (count > 0) {
            localStorage.removeItem("count");
            localStorage.removeItem("assetCode");
          }
        } else {
          if (count > 0) {
            localStorage.removeItem("count");
            localStorage.removeItem("assetCode");
          }
        }
      }
      if (!assetCode) {
        setListAssignment(temp);
      } else {
        let tempRow = temp.find((item) => item.code === assetCode);
        if (tempRow) {
          temp = temp.filter((item) => item.code !== assetCode);
          dateFormatForAssignment(tempRow);
          temp.unshift(tempRow);
          setListAssignment(temp);
        } else {
          getListAssginments(assetCode).then((res) => {
            tempRow = res.data.content;
            temp.slice(0, -1);
            temp.unshift(tempRow);
            setListAssignment(temp);
          });
        }
      }
      setTotalElements(response.data.content.totalElements);
      setDeleteStatus(0);
      setReturningStatus(0);
    });
  }, [
    pageIndex,
    searchInput,
    assignedDateInput,
    stateInput,
    sortInput,
    deleteStatus,
    returningStatus,
  ]);
  const searchAction = (value) => {
    setSearchInput(onChangeSearch(value));
    setPageIndex(1);
  };
  const handlePageChange = (newpage) => {
    setPageIndex(newpage);
  };
  const onChange = (pagination, filters, sorter, extra) => {
    setSortInput(handleSort(sorter));
  };
  const state = [
    {
      label: "Accepted",
      value: "Accepted",
    },
    {
      label: "Waiting for acceptance",
      value: "Waiting for acceptance",
    },
    {
      label: "Returning",
      value: "Returning",
    },
  ];
  function showDetails(record) {
    Swal.fire({
      title: "Detailed Assignment Information",
      icon: "info",
      width: 600,
      showConfirmButton: false,
      html: `<table  class="table " style="text-align :left"><tr><td width="40%">Asset Code</td><td width="60%">${record?.asset.code}</td></tr><tr><td width="40%">Asset Name</td><td width="60%">${record?.asset.name}</td></tr><tr><td width="40%">Specification</td><td width="60%">${record?.asset.specification}</td></tr><tr><td width="40%">Assigned to</td><td width="60%">${record?.assignedTo.username}</td></tr><tr><td width="40%">Assigned by</td><td width="60%">${record?.assignedBy.username}</td></tr><tr><td width="40%">Assigned Date</td><td width="60%">${record?.assignedDate}</td></tr><tr><td width="40%">State</td><td width="60%">${record?.state}</td></tr><tr><td width="40%">Note</td><td width="60%">${record?.note}</td></tr></table>`,
    });
  }
  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      sorter: {
        multiple: 1,
      },
      width: "10%",
      render: (text) => <a>{text}</a>,
      onCell: (record) => {
        return {
          onClick: () => {
            showDetails(record);
          },
        };
      },
    },
    {
      title: "Asset Code",
      dataIndex: "asset.code",
      sorter: {
        multiple: 1,
      },
      width: "20%",
      render: (text, record) => <span>{record.asset.code}</span>,
    },
    {
      title: "Asset Name",
      dataIndex: "asset.name",
      sorter: {
        multiple: 2,
      },
      width: "30%",
      ellipsis: true,
      render: (text, record) => <span>{record.asset.name}</span>,
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy.username",
      render: (text, record) => <a>{record.assignedBy.username}</a>,
      sorter: {
        multiple: 3,
      },
      width: "20%",
    },
    {
      title: "Assigned Date",
      dataIndex: "assignedDate",
      render: (text, record) => <span>{record.assignedDate}</span>,
      sorter: {
        multiple: 3,
      },
      width: "20%",
    },
    {
      title: "State",
      dataIndex: "state",
      sorter: {
        multiple: 4,
      },
      width: "20%",
      render: (text) => <span>{text}</span>,
    },
    {
      title: null,
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <Space>
          {record.state === "Waiting for acceptance" && (
            <>
              <Link
                onClick={() => {
                  Swal.fire({
                    title: `Do you want to accept this assignment?`,
                    icon: "question",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonColor: "#CF2338",
                    confirmButtonText: "Accept",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      localStorage.setItem("case", "assginment");
                      responForAssignment(record.id, {
                        state: "Accepted",
                      }).then((data) => {
                        setDeleteStatus(1);
                        Swal.fire({
                          title: "Accepted",
                          icon: "success",
                          showConfirmButton: true,
                          confirmButtonColor: "#CF2338",
                          allowEscapeKey: true,
                          timer: 3000,
                        });
                      });
                    }
                  });
                }}
              >
                <div className="icon-custom-small">
                  <CheckOutlined className="tickIcon" />
                </div>
              </Link>
              <Link
                onClick={() => {
                  Swal.fire({
                    title: `Do you want to decline this assignment?`,
                    icon: "warning",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonColor: "#CF2338",
                    confirmButtonText: "Decline",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      responForAssignment(record.id, {
                        state: "Declined",
                      }).then((data) => {
                        setDeleteStatus(1);
                        Swal.fire({
                          title: "Declined",
                          icon: "success",
                          showConfirmButton: true,
                          confirmButtonColor: "#CF2338",
                          allowEscapeKey: true,
                          timer: 3000,
                        });
                      });
                    }
                  });
                }}
              >
                <div className="icon-custom-small">
                  <CloseOutlined className="xIcon" />
                </div>
              </Link>
              <Button style={{ padding: 0 }} type="link" disabled>
                <div className="icon-custom-small">
                  <UndoOutlined rotate={150} />
                </div>
              </Button>
            </>
          )}
          {record.state === "Accepted" && (
            <>
              <Button style={{ padding: 0 }} type="link" disabled>
                <div className="icon-custom-small">
                  <CheckOutlined className="tickIcon-disable" />
                </div>
              </Button>
              <Button style={{ padding: 0 }} type="link" disabled>
                <div className="icon-custom-small">
                  <CloseOutlined className="xIcon-disable" />
                </div>
              </Button>
              <Link
                onClick={() => {
                  Swal.fire({
                    title: `Do you want to create a returning request for this asset?`,
                    icon: "question",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonColor: "#CF2338",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      let respon = {
                        assignment: {
                          ...record,
                          assignedDate: record.assignedDate
                            .split("-")
                            .reverse()
                            .join("-"),
                        },
                      };
                      createReturningRequest(respon).then((data) => {
                        setReturningStatus(1);
                        Swal.fire({
                          title: "Created",
                          icon: "success",
                          showConfirmButton: true,
                          confirmButtonColor: "#CF2338",
                          allowEscapeKey: true,
                          timer: 3000,
                        });
                      });
                    }
                  });
                }}
              >
                <div className="icon-custom-small">
                  <UndoOutlined rotate={150} />
                </div>
              </Link>
            </>
          )}
          {record.state === "Returning" && (
            <>
              <Button style={{ padding: 0 }} type="link" disabled>
                <div className="icon-custom-small">
                  <CheckOutlined className="tickIcon-disable" />
                </div>
              </Button>
              <Button style={{ padding: 0 }} type="link" disabled>
                <div className="icon-custom-small">
                  <CloseOutlined className="xIcon-disable" />
                </div>
              </Button>
              <Button style={{ padding: 0 }} type="link" disabled>
                <div className="icon-custom-small">
                  <UndoOutlined rotate={150} />
                </div>
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];
  const menu = [
    {
      type: "SearchBar",
      props: {
        onSearch: searchAction,
      },
    },
  ];
  return (
    <>
      <table>
        <tr>
          <td width="85%">
            <span className="header">Assignment list</span>
          </td>
          <td>
            <span>
              <PageHeader placeholder={""} menu={menu} />
            </span>
          </td>
        </tr>
      </table>
      <TableINDEX
        tableOnchange={onChange}
        columns={columns}
        totalElements={totalElements}
        data={listAssginments || []}
        pagination={{
          current: pageIndex,
          pageSize: 10,
          total: totalElements,
          onChange: handlePageChange,
          size: "medium",
        }}
      />
    </>
  );
}

export default AssignmentUser;
