import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Divider,
  Radio,
  Table,
  Button,
  Drawer,
  Space,
  Modal,
  Form,
} from "antd";
import "bootstrap/dist/css/bootstrap.css";
import TableINDEX from "../../../components/table";
import PageHeader from "../../../components/pageheader/PageHeader";
import {
  getListUser,
  getListUserAvailabel,
  getUserByUsername,
} from "../../../services";
import { useNavigate, Link } from "react-router-dom";

const UserModal = (props) => {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState("bottom");
  const [selectionType, setSelectionType] = useState("radio");
  const [formAssignment] = Form.useForm();
  const navigate = useNavigate();
  const [deleteStatus, setDeleteStatus] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [sortInput, setSortInput] = useState("");
  let [listUser, setListUser] = useState([]);
  const status = true;
  const [userDisable, setDisableUser] = useState(true);
  const [totalElements, setTotalElements] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedKey, setSelectedKey] = useState([]);
  const [value, setValue] = useState({
    username: "",
    type: "",
    status: "",
    staffCode: "",
    location: {
      id: "",
      name: "",
    },
    lastUpdatedDate: "",
    lastUpdatedBy: "",
    lastName: "",
    joinedDate: "",
    gender: "",
    firstName: "",
    dob: "",
    createdDate: "",
    createdBy: "",
  });
  useEffect(() => {
    if (props.state === "create") {
      if (!selectedKey || selectedKey[0] !== undefined) {
        if (props.userValue.staffCode !== "") {
          setSelectedKey([props.userValue.staffCode]);
        } else {
          setSelectedKey([]);
          setDisableUser(true);
        }
      }
    } else {
      if (selectedKey.length === 0 || selectedKey[0] === undefined) {
        if (props.userDefault.staffCode !== "") {
          setSelectedKey([props.userDefault.staffCode]);
        } else {
          setSelectedKey([]);
        }
      } else {
        if (props.userValue.staffCode !== "") {
          setSelectedKey([props.userValue.staffCode]);
        } else {
          setSelectedKey([]);
        }
      }
    }
  }, [props]);
  useEffect(() => {
    getListUserAvailabel(
      pageIndex - 1,
      searchInput,
      sortInput,
      typeInput,
      status
    ).then((response) => {
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
      if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
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
          temp.unshift(tempRow);
          setListUser(temp);
        } else {
          getUserByUsername(username).then((res) => {
            tempRow = res.data.content;
            temp.slice(0, -1);
            temp.unshift(tempRow);
            setListUser(temp);
          });
        }
      }
      setTotalElements(response.data.content.totalElements);
      setDeleteStatus(0);
    });
  }, [pageIndex, searchInput, typeInput, sortInput, deleteStatus, props]);
  function dateFormat(props) {
    return {
      ...props,
      key: props.staffCode,
    };
  }
  const columns = [
    {
      title: "Staff Code",
      dataIndex: "staffCode",
      sorter: {
        multiple: 1,
      },
      width: "30%",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Full Name",
      dataIndex: "fullName",
      width: "30%",
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
      title: "Type",
      dataIndex: "type",
      sorter: {
        multiple: 4,
      },
      width: "30%",
    },
  ];

  const onChangeSearch = (value) => {
    let searchTerm;
    searchTerm = value || "";
    setSearchInput(searchTerm);
    setPageIndex(1);
  };
  const onChangeSort = (value) => {
    let sortTerm;
    value ? (sortTerm = value.value) : (sortTerm = "");
    setTypeInput(sortTerm);
    setPageIndex(1);
  };

  const handlePageChange = (newpage) => {
    setPageIndex(newpage);
  };
  const handleSort = (sorter) => {
    let isArray = Array.isArray(sorter);
    let orders;
    let tempString = "";
    let finalString = "";
    let arr = [];
    if (!isArray) {
      if (sorter.order === {} || typeof sorter.order === "undefined") {
        finalString = "";
      } else {
        if (sorter.order === "ascend") {
          orders = "asc";
        } else {
          orders = "desc";
        }
        if (sorter.field === "fullName") {
          sorter.field = "firstName";
        }
        finalString = sorter.field + "," + orders;
      }
    } else {
      sorter.map((item) => {
        if (item.order === "ascend") {
          orders = "asc";
        } else {
          orders = "desc";
        }
        if (item.field === "fullName") {
          item.field = "firstName";
        }
        tempString = item.field + "," + orders;
        arr.push(tempString);
      });
      arr.forEach((value, key) => {
        key === 0
          ? (finalString += value + "&")
          : (finalString += "sort=" + value + "&");
      });
      finalString = finalString.slice(0, -1);
    }
    setSortInput(finalString);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onChange = (pagination, filters, sorter, extra) => {
    handleSort(sorter);
  };
  const menu = [
    {
      type: "SearchBar",
      props: {
        onSearch: onChangeSearch,
      },
    },
  ];
  const onClose = () => {
    setOpen(false);
  };
  const showDrawer = () => {
    setOpen(true);
  };
  const submitUser = () => {
    props.setUserValue({
      username: value.username,
      type: value.type,
      status: value.status,
      staffCode: value.staffCode,
      location: value.location,
      lastUpdatedDate: value.lastUpdatedDate,
      lastUpdatedBy: value.lastUpdatedBy,
      lastName: value.lastName,
      joinedDate: value.joinedDate,
      gender: value.gender,
      firstName: value.firstName,
      dob: value.dob,
      createdDate: value.createdDate,
      createdBy: value.createdBy,
    });
    props.close();
  };
  const rowSelection = {
    selectedRowKeys: selectedKey,
    onChange: (selectedRowKeys, selectedRows) => {
      setDisableUser(false);
      setSelectedKey(selectedRowKeys);
      setValue({
        username: selectedRows[0].username,
        type: selectedRows[0].type,
        status: selectedRows[0].status,
        staffCode: selectedRows[0].staffCode,
        location: selectedRows[0].location,
        lastUpdatedDate: selectedRows[0].lastUpdatedDate,
        lastUpdatedBy: selectedRows[0].lastUpdatedBy,
        lastName: selectedRows[0].lastName,
        joinedDate: selectedRows[0].joinedDate,
        gender: selectedRows[0].gender,
        firstName: selectedRows[0].firstName,
        dob: selectedRows[0].dob,
        createdDate: selectedRows[0].createdDate,
        createdBy: selectedRows[0].createdBy,
      });
    },
  };
  return (
    <>
      <Modal
        open={props.show}
        onOk={submitUser}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        closable={false}
        onCancel={props.close}
        width="750px"
        bodyStyle={{ overflowX: "scroll", height: 400 }}
        footer={[
          <div className="formChangePassword">
            <Button
              className="submitButton"
              onClick={submitUser}
              disabled={userDisable}
              type="primary"
            >
              Ok
            </Button>
            <Button onClick={props.close} type="secondary">
              Cancel
            </Button>
          </div>,
        ]}
      >
        <table>
          <tr>
            <td width="85%">
              <span className="header"> Select User</span>
            </td>
            <td>
              <span>
                <PageHeader placeholder={""} menu={menu} />
              </span>
            </td>
          </tr>
        </table>
        <div>
          <TableINDEX
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
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

        <div></div>
      </Modal>
    </>
  );
};

export default UserModal;
