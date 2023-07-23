import { useLayoutEffect } from "react";
import Swal from "sweetalert2";

export const onPageVisit = () => {
  window.addEventListener("popstate", function (event) {
    Swal.close();
  });
};
export const dateFormatForAsset = (props) => {
  return {
    ...props,
    installedDate: props.installedDate.split("-").reverse().join("-"),
    assignments: props.assignments.map(dateFormatForAssignment),
  };
};
export const dateFormatForReturning = (props) => {
  return {
    ...props,
    returnedDate: props?.returnedDate?.split("-").reverse().join("-"),
  };
};
export const dateFormatForAssignment = (props) => {
  return {
    ...props,
    assignedDate: props.assignedDate.split("-").reverse().join("-"),
    returningRequest: dateFormatForReturning(props.returningRequest),
  };
};
export const onChangeSearch = (value) => {
  let searchTerm;
  searchTerm = value || "";
  return searchTerm;
};
export const onChangeSort = (value) => {
  let sortTerm;
  if (value) {
    if (value.value) {
      sortTerm = value.value;
    } else {
      sortTerm = value.format("yyyy-MM-DD");
    }
  } else sortTerm = "";
  return sortTerm;
};
export const handleSort = (sorter) => {
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
  return finalString;
};
