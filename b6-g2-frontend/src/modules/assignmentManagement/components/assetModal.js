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
import TableINDEX from "../../../components/table";
import PageHeader from "../../../components/pageheader/PageHeader";
import {
  getListAssets,
  deleteAsset,
  getListCategories,
  getAssetByCode,
} from "../../../services";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate, Link } from "react-router-dom";

const AssetModal = (props) => {
  const [selectionType, setSelectionType] = useState("radio");
  let [listAssets, setListAssets] = useState([]);
  const [totalElements, setTotalElements] = useState();
  const navigate = useNavigate();
  const [deleteStatus, setDeleteStatus] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [stateInput, setStateInput] = useState("Available");
  const [categoryInput, setCategoryInput] = useState("");
  const [sortInput, setSortInput] = useState("");
  const [listCategory, setListCategory] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [assetDisable, setAssetDisable] = useState(true);
  const [assetValue, setAssetValue] = useState({
    category: {
      id: "",
      name: "",
    },
    code: "",
    createdBy: "",
    createdDate: "",
    installedDate: "",
    lastUpdatedBy: "",
    lastUpdatedDate: "",
    location: {
      id: "",
      name: "",
    },
    name: "",
    specification: "",
    state: "",
  });
  useEffect(() => {
    if (props.state === "create") {
      if (!selectedRowKey || selectedRowKey[0] !== undefined) {
        if (props.assetValue.code !== "") {
          setSelectedRowKey([props.assetValue.code]);
        } else {
          setSelectedRowKey([]);
          setAssetDisable(true);
        }
      }
    } else {
      if (selectedRowKey.length === 0 || selectedRowKey[0] === undefined) {
        if (props.assetDefault.code !== "") {
          setSelectedRowKey([props.assetDefault.code]);
        } else {
          setSelectedRowKey([]);
        }
      } else {
        if (props.assetValue.code !== "") {
          setSelectedRowKey([props.assetValue.code]);
        } else {
          setSelectedRowKey([]);
        }
      }
    }
  }, [props]);
  useEffect(() => {
    getListCategories().then((cateRes) => {
      let listTemp = [];
      cateRes.data.content.forEach((element) => {
        listTemp.push({ label: element.name, value: element.id });
      });
      setListCategory(listTemp);
    });
    if (props.state === "edit") {
      getListAssets(
        pageIndex - 1,
        searchInput,
        categoryInput,
        sortInput,
        stateInput,
        props.assetDefault.code
      ).then((response) => {
        let temp = response.data.content.content.map(dateFormatForAsset);
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
        if (
          performance.navigation.type === performance.navigation.TYPE_RELOAD
        ) {
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
          setListAssets(temp);
        } else {
          let tempRow = temp.find((item) => item.code === assetCode);
          if (tempRow) {
            temp = temp.filter((item) => item.code !== assetCode);
            temp.unshift(tempRow);
            setListAssets(temp);
          } else {
            getAssetByCode(assetCode).then((res) => {
              tempRow = res.data.content;
              temp.slice(0, -1);
              temp.unshift(tempRow);
              setListAssets(temp);
            });
          }
        }
        setTotalElements(response.data.content.totalElements);
        setDeleteStatus(0);
      });
    } else {
      getListAssets(
        pageIndex - 1,
        searchInput,
        categoryInput,
        sortInput,
        stateInput,
        ""
      ).then((response) => {
        let temp = response.data.content.content.map(dateFormatForAsset);
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
        if (
          performance.navigation.type === performance.navigation.TYPE_RELOAD
        ) {
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
          setListAssets(temp);
        } else {
          let tempRow = temp.find((item) => item.code === assetCode);
          if (tempRow) {
            temp = temp.filter((item) => item.code !== assetCode);
            temp.unshift(tempRow);
            setListAssets(temp);
          } else {
            getAssetByCode(assetCode).then((res) => {
              tempRow = res.data.content;
              temp.slice(0, -1);
              temp.unshift(tempRow);
              setListAssets(temp);
            });
          }
        }
        setTotalElements(response.data.content.totalElements);
        setDeleteStatus(0);
      });
    }
  }, [
    pageIndex,
    searchInput,
    categoryInput,
    stateInput,
    sortInput,
    deleteStatus,
    props,
  ]);
  function dateFormatForAsset(props) {
    return {
      ...props,
      key: props.code,
    };
  }
  function dateFormatForAssignment(props) {
    return {
      ...props,
      assignedDate: props.assignedDate.split("-").reverse().join("-"),
    };
  }
  const onChangeSearch = (value) => {
    let searchTerm;
    searchTerm = value || "";
    setSearchInput(searchTerm);
    setPageIndex(1);
  };
  const onChangeSortState = (value) => {
    let sortTerm;
    value ? (sortTerm = value.value) : (sortTerm = "");

    setStateInput(sortTerm);

    setPageIndex(1);
  };

  const onChangeSortCategory = (value) => {
    let sortTerm;
    value ? (sortTerm = value.value) : (sortTerm = "");

    setCategoryInput(sortTerm);

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
        finalString = sorter.field + "," + orders;
      }
    } else {
      sorter.map((item) => {
        if (item.order === "ascend") {
          orders = "asc";
        } else {
          orders = "desc";
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
  const onChange = (pagination, filters, sorter, extra) => {
    handleSort(sorter);
  };
  const columns = [
    {
      title: "Asset Code",
      dataIndex: "code",
      sorter: {
        multiple: 1,
      },
      width: "30%",
    },
    {
      title: "Asset Name",
      dataIndex: "name",
      sorter: {
        multiple: 2,
      },
      width: "30%",
      ellipsis: true,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (text, record) => <span>{record.category.name}</span>,
      sorter: {
        multiple: 3,
      },
      width: "30%",
    },
  ];
  const menu = [
    {
      type: "SearchBar",
      props: {
        onSearch: onChangeSearch,
      },
    },
  ];
  const rowSelection = {
    selectedRowKeys: selectedRowKey,
    onChange: (selectedRowKeys, selectedRows) => {
      setAssetDisable(false);
      setSelectedRowKey(selectedRowKeys);
      setAssetValue({
        category: selectedRows[0].category,
        code: selectedRows[0].code,
        createdBy: selectedRows[0].createdBy,
        createdDate: selectedRows[0].createdDate,
        installedDate: selectedRows[0].installedDate,
        lastUpdatedBy: selectedRows[0].lastUpdatedBy,
        lastUpdatedDate: selectedRows[0].lastUpdatedDate,
        location: selectedRows[0].location,
        name: selectedRows[0].name,
        specification: selectedRows[0].specification,
        state: selectedRows[0].state,
      });
    },
  };
  const submitAsset = () => {
    props.setAssetValue({
      category: assetValue.category,
      code: assetValue.code,
      createdBy: assetValue.createdBy,
      createdDate: assetValue.createdDate,
      installedDate: assetValue.installedDate,
      lastUpdatedBy: assetValue.lastUpdatedBy,
      lastUpdatedDate: assetValue.lastUpdatedDate,
      location: assetValue.location,
      name: assetValue.name,
      specification: assetValue.specification,
      state: assetValue.state,
    });
    props.close();
  };
  return (
    <>
      <Modal
        closable={false}
        open={props.show}
        onOk={submitAsset}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        onCancel={props.close}
        width="750px"
        bodyStyle={{ overflowX: "scroll", height: 400 }}
        footer={[
          <div className="formChangePassword">
            <Button
              className="submitButton"
              onClick={submitAsset}
              disabled={assetDisable}
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
              <span className="header"> Select Asset</span>
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
            data={listAssets || []}
            pagination={{
              current: pageIndex,
              pageSize: 10,
              total: totalElements,
              onChange: handlePageChange,
              size: "medium",
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default AssetModal;
