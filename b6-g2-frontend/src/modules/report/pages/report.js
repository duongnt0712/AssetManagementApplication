import { React, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import PageHeader from "../../../components/pageheader/PageHeader";
import TableINDEX from "../../../components/table";
import { exportReport, getListReport } from "../../../services";
import { saveAs } from "file-saver";
import { Buffer } from "buffer";
import { handleSort } from "../../../components/methods/methods";

function Report() {
  const [pageIndex, setPageIndex] = useState(1);
  const [sortInput, setSortInput] = useState("");
  const [totalElements, setTotalElements] = useState();
  let [listReport, setListReport] = useState([]);
  useEffect(() => {
    getListReport(pageIndex - 1, sortInput).then((response) => {
      setListReport(response.data.content.content);
      setTotalElements(response.data.content.totalElements);
    });
  }, [pageIndex, sortInput]);
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      ellipsis: true,
      sorter: {
        multiple: 1,
      },
      width: "15%",
    },
    {
      title: "Total",
      dataIndex: "total",
      sorter: {
        multiple: 2,
      },
      width: "10%",
    },
    {
      title: "Assigned",
      dataIndex: "assigned",
      sorter: {
        multiple: 3,
      },
      width: "10%",
    },
    {
      title: "Available",
      dataIndex: "available",
      sorter: {
        multiple: 4,
      },
      width: "10%",
    },
    {
      title: "Not available",
      dataIndex: "notAvailable",
      sorter: {
        multiple: 5,
      },
      width: "12%",
    },
    {
      title: "Recycled",
      dataIndex: "recycled",
      sorter: {
        multiple: 6,
      },
      width: "10%",
    },
    {
      title: "Waiting for acceptance",
      dataIndex: "waitingForAcceptance",
      sorter: {
        multiple: 7,
      },
    },
    {
      title: "Waiting for recycling",
      dataIndex: "waitingForRecycling",
      sorter: {
        multiple: 8,
      },
    },
  ];
  const handlePageChange = (newpage) => {
    setPageIndex(newpage);
  };
  const onChange = (pagination, filters, sorter, extra) => {
    setSortInput(handleSort(sorter));
  };
  const menu = [
    {
      type: "CreateBtn",
      props: {
        buttonTitle: "Export",
        onClick: () =>
          exportReport().then((response) => {
            const byteArray = Uint8Array.from(
              Buffer.from(response.data, "base64")
            );
            const blob = new Blob([byteArray], {
              type: response.headers["Content-Type"],
            });
            saveAs(blob, "report.xlsx");
          }),
      },
    },
  ];
  return (
    <div>
      <PageHeader tableName="Report" menu={menu} />
      <TableINDEX
        tableOnchange={onChange}
        columns={columns}
        totalElements={totalElements}
        data={listReport || []}
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

export default Report;
