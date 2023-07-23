import { React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import PageHeader from "../../../components/pageheader/PageHeader";
import { useNavigate, Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined, UndoOutlined } from "@ant-design/icons";
import TableINDEX from "../../../components/table";
import { Button, Space } from "antd";
import Swal from "sweetalert2";
import {
  getListAssginments,
  getAssignmentByCode,
  deleteAssignment,
  createReturningRequest,
} from "../../../services";
import {
  dateFormatForAssignment,
  handleSort,
  onChangeSearch,
  onChangeSort,
  onPageVisit,
} from "../../../components/methods/methods";
import { useLayoutEffect } from "react";
function Assignment() {
  let [listAssginments, setListAssignment] = useState([]);
  const [totalElements, setTotalElements] = useState();
  const navigate = useNavigate();
  const [dataChange, setDataChange] = useState(0);
  const [returningStatus, setReturningStatus] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [assignedDateInput, setassignedDateInput] = useState("");
  const [sortInput, setSortInput] = useState("");
  useLayoutEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      let temp = localStorage.getItem("returning-assignment");
      if (temp === "1") {
        setDataChange(1);
        localStorage.removeItem("returning-assignment");
      }
    }
  };
  useEffect(() => {
    onPageVisit();
    getListAssginments(
      pageIndex - 1,
      searchInput,
      assignedDateInput,
      sortInput,
      stateInput
    ).then((response) => {
      let temp = response.data.content.content.map(dateFormatForAssignment);
      const assignment = localStorage.getItem("assignment");
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
          localStorage.removeItem("assignment");
        }
      }
      if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
        count = count + 1;
        localStorage.setItem("count", count);
        if (parseInt(sessionStorage.getItem("turn"), 10) === 0) {
          if (count > 0) {
            localStorage.removeItem("count");
            localStorage.removeItem("assignment");
          }
        } else {
          if (count > 0) {
            localStorage.removeItem("count");
            localStorage.removeItem("assignment");
          }
        }
      }

      if (!assignment) {
        setListAssignment(temp);
      } else {
        const id = parseInt(assignment, 10);
        let tempRow = temp.find((item) => item.id === id);

        if (tempRow) {
          temp = temp.filter((item) => item.id !== id);
          dateFormatForAssignment(tempRow);
          temp.unshift(tempRow);
          setListAssignment(temp);
        } else {
          getAssignmentByCode(id).then((res) => {
            tempRow = dateFormatForAssignment(res.data.content);
            temp.slice(0, -1);
            temp.unshift(tempRow);
            setListAssignment(temp);
          });
        }
      }
      setTotalElements(response.data.content.totalElements);
      setDataChange(0);
      setReturningStatus(0);
    });
  }, [
    pageIndex,
    searchInput,
    assignedDateInput,
    stateInput,
    sortInput,
    dataChange,
    returningStatus,
  ]);
  const searchAction = (value) => {
    setSearchInput(onChangeSearch(value));
    setPageIndex(1);
  };
  const sortActionState = (value) => {
    setStateInput(onChangeSort(value));
    setPageIndex(1);
  };
  const sortActionAssginedDate = (value) => {
    setassignedDateInput(onChangeSort(value));
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
      title: "Assigned To",
      dataIndex: "assignedTo.username",
      render: (text, record) => <span>{record.assignedTo.username}</span>,
      sorter: {
        multiple: 3,
      },
      width: "20%",
    },
    {
      title: "Assigned By",
      dataIndex: "assignedBy.username",
      render: (text, record) => <span>{record.assignedBy.username}</span>,
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
              <Link to={`./edit/${record.id}`}>
                <div className="icon-custom-small">
                  <EditOutlined className="xIcon" />
                </div>
              </Link>
              <Link
                onClick={() => {
                  Swal.fire({
                    title: "",
                    html: `<div style="font-size:20px">Do you want to delete this assignment?</div>`,
                    icon: "warning",
                    confirmButtonText: "Delete",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonColor: "#CF2338",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      deleteAssignment(record.id, { state: "Declined" }).then(
                        () => {
                          localStorage.setItem("assignment-asset", "1");
                          setDataChange(1);
                          Swal.fire({
                            title: "Deleted",
                            icon: "success",
                            showConfirmButton: true,
                            confirmButtonColor: "#CF2338",
                            allowEscapeKey: true,
                          });
                        }
                      );
                    }
                  });
                }}
              >
                <div className="icon-custom-small">
                  <DeleteOutlined className="tickIcon" />
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
                  <EditOutlined className="xIcon-disable" />
                </div>
              </Button>
              <Button style={{ padding: 0 }} type="link" disabled>
                <div className="icon-custom-small">
                  <DeleteOutlined className="tickIcon-disable" />
                </div>
              </Button>
              <Link
                onClick={() => {
                  Swal.fire({

                    title: "",
                    html: `<div style="font-size:20px">Do you want to create a returning request for this asset?</div>`,
                    icon: "question",
                    confirmButtonText: "Create",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonColor: "#CF2338",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      localStorage.setItem("assignment-request", "1");
                      const data = {
                        assignment: {
                          ...dateFormatForAssignment(record),
                        },
                      };
                      createReturningRequest(data).then(() => {
                        setReturningStatus(1);
                        Swal.fire({
                          title: "Created",
                          icon: "success",
                          showConfirmButton: true,
                          confirmButtonColor: "#CF2338",
                          allowEscapeKey: true,
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
                  <EditOutlined className="xIcon-disable" />
                </div>
              </Button>
              <Button style={{ padding: 0 }} type="link" disabled>
                <div className="icon-custom-small">
                  <DeleteOutlined className="tickIcon-disable" />
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
      type: "SortBar",
      props: {
        id: "stateSort",
        title: "stateSort",
        menu: state,
        handleChange: sortActionState,
        placeholder: "State",
      },
    },
    {
      type: "DateBar",
      props: {
        placeholder: "Assigned Date",
        onChange: sortActionAssginedDate,
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
        buttonTitle: "Create new Assignment",
        onClick: () => navigate("./create"),
      },
    },
  ];
  return (
    <>
      <PageHeader tableName="Assignment list" menu={menu} />
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

export default Assignment;
