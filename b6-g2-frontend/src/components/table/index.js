import { Table } from "antd";
import React from "react";
const TableINDEX = ({
  columns,
  data,
  loading,
  tableOnchange,
  pagination,
  rowSelection,
  emptyText,
}) => {
  return (
    <Table
      locale={{ emptyText: emptyText }}
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      onChange={tableOnchange}
      loading={loading}
      pagination={{ showSizeChanger: false, ...pagination }}
      showSorterTooltip={false}
    />
  );
};
export default TableINDEX;
