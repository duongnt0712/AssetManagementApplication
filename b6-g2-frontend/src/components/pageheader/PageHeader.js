import { message } from "antd";
import "./pageHeader.css";
import { Button, Input, DatePicker, Select } from "antd";
import { useState } from "react";
const { Search } = Input;

function TableName(props) {
  return (
    <div className="tableName">
      <strong>{props.tableName}</strong>
    </div>
  );
}
function DateBar(props) {
  return (
    <div className="functionBar">
      <DatePicker
        format={"DD/MM/YYYY"}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </div>
  );
}
function SearchBar(props) {
  const [status, setStatus] = useState("");
  const onChangeSearchBar = (event) => {
    if (event.target.value.length > 255) {
      setStatus("error");
      message.error("Keywords must be less than 255 characters");
    } else {
      setStatus("");
    }
  };
  return (
    <div className="functionBar">
      <Search
        status={status}
        placeholder="Input search text"
        onSearch={props.onSearch}
        onChange={onChangeSearchBar}
        style={{
          width: 200,
        }}
        allowClear
      />
    </div>
  );
}
function SortBar(props) {
  return (
    <div className="functionBar">
      <Select
        labelInValue
        placeholder={props.placeholder}
        style={{
          width: 200,
        }}
        allowClear
        onChange={props.handleChange}
        dropdownMatchSelectWidth={false}
        placement="bottomLeft"
        options={props.menu}
      />
    </div>
  );
}
function CreateBtn(props) {
  return (
    <div className="createButton">
      <Button
        style={{ backgroundColor: "#ee1734", color: "white" }}
        onClick={props.onClick}
      >
        {props.buttonTitle}
      </Button>
    </div>
  );
}

export default function PageHeader(props) {
  const renderComponent = (item) => {
    switch (item.type) {
      case "SortBar":
        return <SortBar {...item.props} />;
      case "DateBar":
        return <DateBar {...item.props} />;
      case "SearchBar":
        return <SearchBar {...item.props} />;
      case "CreateBtn":
        return <CreateBtn {...item.props} />;
      default:
        return;
    }
  };

  return (
    <>
      <div className="pageHeader">
        <TableName tableName={props.tableName} />
        <div className="toolBar">
          {props?.menu?.map((item) => renderComponent(item))}
        </div>
      </div>
    </>
  );
}
