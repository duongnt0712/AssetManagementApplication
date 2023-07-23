import { React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import PageHeader from "../../../components/pageheader/PageHeader";
import { Link } from "react-router-dom";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import TableINDEX from "../../../components/table";
import { Button, Space } from "antd";
import Swal from "sweetalert2";
import {
  getListReturningRequest,
  deleteReturningRequest,
  completeReturning,
} from "../../../services";
import {
  handleSort,
  onChangeSearch,
  onChangeSort,
  onPageVisit,
  dateFormatForReturning,
} from "../../../components/methods/methods";
import { useLayoutEffect } from "react";
function ReturnAsset() {
  let [listRequests, setListRequests] = useState([]);
  const [totalElements, setTotalElements] = useState();
  const [functioned, setFunctioned] = useState(0);
  const [returningStatus, setReturningStatus] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [returnedDateInput, setReturnedDateInput] = useState("");
  const [sortInput, setSortInput] = useState("");
  useLayoutEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const onVisibilityChange = () => {
    let temp = localStorage.getItem("assignment-request");

    if (document.visibilityState === "visible") {
      if (temp === "1") {
        localStorage.removeItem("assignment-request");
        setFunctioned(1);
      }
    }
  };
  useEffect(() => {
    onPageVisit();
    getListReturningRequest(
      pageIndex - 1,
      searchInput,
      returnedDateInput,
      sortInput,
      stateInput
    ).then((response) => {
      let temp = response.data.content.content;
      setListRequests(temp);
      setTotalElements(response.data.content.totalElements);
      setFunctioned(0);
      setReturningStatus(0);
    });
  }, [
    pageIndex,
    searchInput,
    returnedDateInput,
    stateInput,
    sortInput,
    functioned,
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
  const sortActionReturnedDate = (value) => {
    setReturnedDateInput(onChangeSort(value));
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
      label: "Completed",
      value: "Completed",
    },
    {
      label: "Waiting for returning",
      value: "Waiting for returning",
    },
  ];

  const columns = [
    {
      title: "No.",
      dataIndex: "id",
      sorter: {
        multiple: 1,
      },
      width: "10%",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Asset Code",
      dataIndex: "assignment.asset.code",
      sorter: {
        multiple: 1,
      },
      width: "20%",
      render: (text, record) => <span>{record.assignment.asset.code}</span>,
    },
    {
      title: "Asset Name",
      dataIndex: "assignment.asset.name",
      sorter: {
        multiple: 2,
      },
      width: "30%",
      ellipsis: true,
      render: (text, record) => <span>{record.assignment.asset.name}</span>,
    },
    {
      title: "Requested By",
      dataIndex: "requestedBy",
      render: (text, record) => <span>{record.requestedBy.username}</span>,
      sorter: {
        multiple: 3,
      },
      width: "20%",
    },
    {
      title: "Assigned Date",
      dataIndex: "assignment.assignedDate",
      render: (text, record) => (
        <span>
          {record.assignment.assignedDate?.split("-").reverse().join("-")}
        </span>
      ),
      sorter: {
        multiple: 3,
      },
      width: "20%",
    },
    {
      title: "Accepted By",
      dataIndex: "acceptedBy",
      render: (text, record) => <span>{record.acceptedBy?.username}</span>,
      sorter: {
        multiple: 3,
      },
      width: "20%",
    },
    {
      title: "Returned Date",
      dataIndex: "returnedDate",
      render: (text, record) => (
        <span>{record.returnedDate?.split("-").reverse().join("-")}</span>
      ),
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
          {record.state === "Waiting for returning" && (
            <>
              <Link
                onClick={() => {
                  Swal.fire({
                    title: "",
                    html: `<div style="font-size:20px">Do you want to mark this returning request as "Completed"? </div>`,
                    icon: "question",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonColor: "#CF2338",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      completeReturning(record.id).then(() => {
                        localStorage.setItem("returning-asset", "1");
                        localStorage.setItem("returning-assignment", "1");
                        setFunctioned(1);
                        Swal.fire({
                          title: "Completed",
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
                  <CheckOutlined className="tickIcon" />
                </div>
              </Link>
              <Link
                onClick={() => {
                  Swal.fire({
                    title: "",
                    html: `<div style="font-size:20px">Do you want to cancel this returning request?</div>`,
                    icon: "warning",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                    showCancelButton: true,
                    showConfirmButton: true,
                    confirmButtonColor: "#CF2338",
                    confirmButtonText: "Yes",
                    cancelButtonText: "No",
                  }).then((result) => {
                    if (result.isConfirmed) {
                      deleteReturningRequest(record.id).then(() => {
                        localStorage.setItem("returning-assignment", "1");
                        setFunctioned(1);
                        Swal.fire({
                          title: "Deleted",
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
                  <CloseOutlined className="xIcon" />
                </div>
              </Link>
            </>
          )}
          {record.state === "Declined" && (
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
        placeholder: "Returned Date",
        onChange: sortActionReturnedDate,
      },
    },
    {
      type: "SearchBar",
      props: {
        onSearch: searchAction,
      },
    },
  ];
  return (
    <>
      <PageHeader tableName="Request list" menu={menu} />
      <TableINDEX
        tableOnchange={onChange}
        columns={columns}
        totalElements={totalElements}
        data={listRequests || []}
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

export default ReturnAsset;
