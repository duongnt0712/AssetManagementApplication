import { React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import PageHeader from "../../../components/pageheader/PageHeader";
import { useNavigate, Link } from "react-router-dom";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TableINDEX from "../../../components/table";
import { Button, Space } from "antd";
import Swal from "sweetalert2";
import {
  getListAssets,
  deleteAsset,
  getListCategories,
  getAssetByCode,
} from "../../../services/index.js";
import {
  dateFormatForAsset,
  handleSort,
  onChangeSearch,
  onChangeSort,
  onPageVisit,
} from "../../../components/methods/methods";
import { useLayoutEffect } from "react";

function Assets() {
  let [listAssets, setListAssets] = useState([]);
  const [totalElements, setTotalElements] = useState();
  const navigate = useNavigate();
  const [dataChange, setDataChange] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [stateInput, setStateInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [sortInput, setSortInput] = useState("");
  const [listCategory, setListCategory] = useState([]);
  useLayoutEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      let temp = localStorage.getItem("assignment-asset");
      let temp1 = localStorage.getItem("returning-asset");
      if (temp === "1") {
        setDataChange(1);
        localStorage.removeItem("assignment-asset");
      }
      if (temp1 === "1") {
        setDataChange(1);
        localStorage.removeItem("returning-asset");
      }
    }
  };
  function getData() {
    getListCategories().then((cateRes) => {
      let listTemp = [];
      cateRes.data.content.forEach((element) => {
        listTemp.push({ label: element.name, value: element.id });
      });
      setListCategory(listTemp);
    });
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
        setListAssets(temp);
      } else {
        let tempRow = temp.find((item) => item.code === assetCode);
        if (tempRow) {
          temp = temp.filter((item) => item.code !== assetCode);
          dateFormatForAsset(tempRow);
          temp.unshift(tempRow);
          setListAssets(temp);
        } else {
          getAssetByCode(assetCode).then((res) => {
            tempRow = dateFormatForAsset(res.data.content);
            temp.slice(0, -1);
            temp.unshift(tempRow);
            setListAssets(temp);
          });
        }
      }
      setTotalElements(response.data.content.totalElements);
      setDataChange(0);
    });
  }
  useEffect(() => {
    onPageVisit();
    getData();
  }, [
    pageIndex,
    searchInput,
    categoryInput,
    stateInput,
    sortInput,
    dataChange,
  ]);

  const handlePageChange = (newpage) => {
    setPageIndex(newpage);
  };
  const sortActionState = (value) => {
    setStateInput(onChangeSort(value));
    setPageIndex(1);
  };
  const sortActionCategory = (value) => {
    setCategoryInput(onChangeSort(value));
    setPageIndex(1);
  };
  const searchAction = (value) => {
    setSearchInput(onChangeSearch(value));
    setPageIndex(1);
  };
  const onChange = (pagination, filters, sorter, extra) => {
    setSortInput(handleSort(sorter));
  };
  const state = [
    {
      label: "Assigned",
      value: "Assigned",
    },
    {
      label: "Available",
      value: "Available",
    },
    {
      label: "Not available",
      value: "Not available",
    },
    {
      label: "Recycled",
      value: "Recycled",
    },
    {
      label: "Waiting for acceptance",
      value: "Waiting for acceptance",
    },
    {
      label: "Waiting for recycling",
      value: "Waiting for recycling",
    },
  ];
  const renderTable = (assignments) => {
    if (assignments.length === 0) {
      return `<span>This asset haven't been assigned yet.</span>`;
    } else {
      let values = "";
      let title = `<tr><td>Assignee</td><td>Assigned date</td><td>Released date</td></tr>`;
      let table = `<table class="table table-bordered">`;
      assignments.forEach((arr) => {
        values += `<tr>`;
        values += `<td>${arr?.assignedTo.username}</td><td>${arr?.assignedDate}</td><td>${arr?.returningRequest?.returnedDate}</td>`;
        values += `</tr>`;
      });

      table += title + values + `</table>`;
      return `<div><span>Assignment history</span></div>` + table;
    }
  };
  function showDetails(record) {
    Swal.fire({
      title: "Asset Details",
      icon: "info",
      width: 600,
      showConfirmButton: false,
      html:
        `<table  class="table " style="text-align :left"><tr><td width="40%">Asset Code</td><td width="60%">${record?.code}</td></tr><tr><td width="40%">Asset Name</td><td width="60%">${record?.name}</td></tr><tr><td width="40%">Category</td><td width="60%">${record?.category.name}</td></tr><tr><td width="40%">Specification</td><td width="60%">${record?.specification}</td></tr><tr><td width="40%">Install Date</td><td width="60%">${record?.installedDate}</td></tr><tr><td width="40%">State</td><td width="60%">${record?.state}</td></tr></table>` +
        renderTable(record?.assignments),
    });
  }
  const columns = [
    {
      title: "Asset Code",
      dataIndex: "code",
      sorter: {
        multiple: 1,
      },
      width: "20%",
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
      title: "Asset Name",
      dataIndex: "name",
      sorter: {
        multiple: 2,
      },
      width: "30%",
      ellipsis: true,
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (text, record) => <span>{record.category.name}</span>,
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
          {record.state !== "Assigned" &&
            record.state !== "Waiting for recycling" && (
              <>
                <Link to={`./edit/${record.code}`}>
                  <div className="icon-custom-small">
                    <EditOutlined className="xIcon" />
                  </div>
                </Link>
                {record.state !== "Recycled" && (
                  <>
                    <Link
                      onClick={() => {
                        Swal.fire({
                          title: "",
                          html: `<div style="font-size:20px">Do you want to delete this asset?</div>`,
                          icon: "warning",
                          confirmButtonText: "Delete",
                          showCancelButton: true,
                          showConfirmButton: true,
                          confirmButtonColor: "#CF2338",
                          confirmButtonText:"Delete"
                        }).then((result) => {
                          if (result.isConfirmed) {
                            if (
                              record.assignments.length > 0 ||
                              record.state === "Not available"
                            ) {
                              Swal.fire({
                                title: "Cannot Delete Asset",
                                icon: "error",
                                showCloseButton: true,
                                allowEscapeKey: true,
                                html:
                                  `<div style="text-align:left">Cannot delete the asset because it belongs to one or more historicals assignments.</div><div  style="text-align:left">If the asset is not able to be used anymore, please update its state in <a href="./asset/edit/` +
                                  `${record.code}` +
                                  `">Edit Asset Page</a></div>`,
                                showConfirmButton: false,
                              });
                            } else {
                              deleteAsset(record.code).then(() => {
                                setDataChange(1);
                                Swal.fire({
                                  title: "Deleted",
                                  icon: "success",
                                  showConfirmButton: true,
                                  confirmButtonColor: "#CF2338",
                                  allowEscapeKey: true,
                                });
                              });
                            }
                          }
                        });
                      }}
                    >
                      <div className="icon-custom-small">
                        <DeleteOutlined className="tickIcon" />
                      </div>
                    </Link>
                  </>
                )}
                {record.state === "Recycled" && (
                  <Button style={{ padding: 0 }} type="link" disabled>
                    <div className="icon-custom-small">
                      <DeleteOutlined />
                    </div>
                  </Button>
                )}
              </>
            )}
          {(record.state === "Assigned" ||
            record.state === "Waiting for recycling") && (
            <>
              <Button style={{ padding: 0 }} type="link" disabled>
                <div className="icon-custom-small">
                  <EditOutlined />
                </div>
              </Button>
              <Button style={{ padding: 0 }} type="link" disabled>
                <div className="icon-custom-small">
                  <DeleteOutlined />
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
      type: "SortBar",
      props: {
        id: "categorySort",
        title: "categorySort",
        menu: listCategory,
        handleChange: sortActionCategory,
        placeholder: "Category",
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
        buttonTitle: "Create new Asset",
        onClick: () => navigate("./create"),
      },
    },
  ];
  return (
    <>
      <PageHeader tableName="Asset list" menu={menu} />
      <TableINDEX
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
    </>
  );
}

export default Assets;
