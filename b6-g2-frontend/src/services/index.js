import { ENDPOINTS } from "../appConstants/endpoint.js";
import API from "./API";
const { get, del, put, post } = API;
export const getUserByUsername = async (username) => {
  return get(`${ENDPOINTS.USER}/${username}`);
};

export const createUser = async (data) => {
  return post(ENDPOINTS.USER, data);
};

export const getAllUser = async () => {
  return get(`${ENDPOINTS.USER}`);
};

export const getListUser = async (page, search, sort, type) => {
  return get(
    `${ENDPOINTS.USER}?page=${page}&&search=${search}&&sort=${sort}&&type=${type}`
  );
};
export const getListUserAvailabel = async (
  page,
  search,
  sort,
  type,
  status
) => {
  return get(
    `${ENDPOINTS.USER}?page=${page}&&search=${search}&&sort=${sort}&&type=${type}&&status=${status}`
  );
};
export const updateUser = async (data, username) => {
  return put(`${ENDPOINTS.USER}/${username}`, data);
};

export const disableUser = async (username) => {
  return post(`${ENDPOINTS.USER}/${username}/disable`);
};

export const login = async (data) => {
  return post(`${ENDPOINTS.LOGIN}`, data);
};
export const changePassword = async (username, password, oldPass) => {
  let oldPassword;
  if (oldPass) {
    oldPassword = encodeURIComponent(oldPass);
  }
  const newPassword = encodeURIComponent(password);
  return post(
    `${ENDPOINTS.USER}/password?password=${newPassword}&oldPassword=${oldPassword}`
  );
};
export const getAssets = async () => {
  return get(`${ENDPOINTS.ASSETS}`);
};
export const getListAssets = async (
  page,
  search,
  categories,
  sort,
  state,
  assetCode
) => {
  return get(
    `${ENDPOINTS.ASSETS}?page=${page}&&search=${search}&&category=${categories}&&sort=${sort}&&state=${state}&&assetCode=${assetCode}`
  );
};
export const getAssetByCode = async (code) => {
  return get(`${ENDPOINTS.ASSETS}/${code}`);
};
export const deleteAsset = async (code) => {
  return post(`${ENDPOINTS.ASSETS}/${code}`);
};
export const getListCategories = async () => {
  return get(`${ENDPOINTS.CATEGORIES}`);
};
export const createNewCategory = async (data) => {
  return post(`${ENDPOINTS.CATEGORIES}`, data);
};
export const createNewAsset = async (data) => {
  return post(`${ENDPOINTS.ASSETS}`, data);
};
export const updateAsset = async (data, code) => {
  return put(`${ENDPOINTS.ASSETS}/${code}`, data);
};
export const getListReturningRequest = async (
  page,
  search,
  returnedDate,
  sort,
  state
) => {
  return get(
    `${ENDPOINTS.RETURNINGS}?page=${page}&&search=${search}&&returnedDate=${returnedDate}&&sort=${sort}&&state=${state}`
  );
};
export const createReturningRequest = async (data) => {
  return post(`${ENDPOINTS.RETURNINGS}`, data);
};
export const completeReturning = async (data) => {
  return post(`${ENDPOINTS.RETURNINGS}/${data}/complete`);
};
export const deleteReturningRequest = async (code) => {
  return del(`${ENDPOINTS.RETURNINGS}/${code}`);
};

export const createNewAssignment = async (data) => {
  return post(`${ENDPOINTS.ASSIGNMENTS}`, data);
};
export const getAssignmentById = async (id) => {
  return get(`${ENDPOINTS.ASSIGNMENTS}/${id}`);
};

export const updateAssignment = async (data, id) => {
  return put(`${ENDPOINTS.ASSIGNMENTS}/${id}`, data);
};

export const getListAssginments = async (
  page,
  search,
  assignedDate,
  sort,
  state
) => {
  return get(
    `${ENDPOINTS.ASSIGNMENTS}?page=${page}&&search=${search}&&assignedDate=${assignedDate}&&sort=${sort}&&state=${state}`
  );
};
export const getListAssginmentsUser = async (
  username,
  page,
  search,
  assignedDate,
  sort,
  state
) => {
  return get(
    `${ENDPOINTS.ASSIGNMENTS}/${username}?page=${page}&&search=${search}&&assignedDate=${assignedDate}&&sort=${sort}&&state=${state}`
  );
};
export const getAssignmentByCode = async (code) => {
  return get(`${ENDPOINTS.ASSIGNMENTS}/${code}`);
};
export const deleteAssignment = async (id, data) => {
  return post(`${ENDPOINTS.ASSIGNMENTS}/${id}/respond`, data);
};
export const responForAssignment = async (id, state) => {
  return post(`${ENDPOINTS.ASSIGNMENTS}/${id}/respond`, state);
};
export const getListReturnings = async () => {
  return get(`${ENDPOINTS.RETURNINGS}`);
};
export const getReturningtByCode = async (code) => {
  return get(`${ENDPOINTS.RETURNINGS}/${code}`);
};
export const getListReport = async (page, sort) => {
  return get(`${ENDPOINTS.REPORTS}?page=${page}&&sort=${sort}`);
};
export const exportReport = async () => {
  return get(`${ENDPOINTS.REPORTS}/export`, {
    responseType: "blob",
  });
};
