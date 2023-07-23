import Axios from "axios";
import { Cookies } from "react-cookie";
import { CONFIG } from "../appConstants/config.js";
import { ENDPOINTS } from "../appConstants/endpoint.js";
import { PATHS } from "../appConstants/path.js";

const PUBLIC_URLS = [ENDPOINTS.LOGIN];

const axios = Axios.create({
  baseURL: CONFIG.API_URL,
  headers: {
    "Content-type": "application/json",
  },
});

let refresh = false;

axios.interceptors.response.use(
  (resp) => resp,

  async (error) => {
    if (
      error.response.status === 401 &&
      !refresh &&
      window.localStorage.getItem("user")
    ) {
      refresh = true;
      const refreshToken = JSON.parse(
        window.localStorage.getItem("user")
      ).refreshToken;

      const response = await axios.post(
        `/auth/refreshToken`,
        { refreshToken },
        { withCredentials: true }
      );
      if (response.status === 200) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data["accessToken"]}`;

        // change refreshToken in localstorage and sessionstorage user item
        let newUser = JSON.parse(window.localStorage.getItem("user"));
        newUser = {
          ...newUser,
          refreshToken: response.data["refreshToken"],
          token: response.data["accessToken"],
        };
        localStorage.setItem("user", JSON.stringify(newUser));
        refresh = false;
        return axios(error.config);
      } else {
        const cookies = new Cookies();
        localStorage.clear();
        cookies.remove(CONFIG.AUTH_TOKEN_KEY);
        setTimeout(() => {
          window.location.href = PATHS.LOGIN;
        }, 500);
      }
    }
    refresh = false;
    return error;
  }
);

axios.interceptors.request.use(
  function (config) {
    //don't add auth header if url match ignore list
    if (
      PUBLIC_URLS.indexOf(config.url) >= 0 ||
      config.url.indexOf("public") >= 0
    ) {
      return config;
    }
    //if token is passed in server side
    if (config && axios.defaults.headers.common["Authorization"]) {
      //modify header here to include token
      Object.assign(config.headers, {
        Authorization: `${axios.defaults.headers.common["Authorization"]}`,
      });
    } else {
      let token;
      if (JSON.parse(window.localStorage.getItem("user"))) {
        token = JSON.parse(window.localStorage.getItem("user")).token;
      } else {
        token = JSON.parse(window.sessionStorage.getItem("user")).token;
      }
      if (token) {
        Object.assign(config.headers, { Authorization: `Bearer ${token}` });
      }
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
const API = {
  get: (endpoint, params = {}) => axios.get(endpoint, { params }),
  post: (endpoint, data = {}) => axios.post(endpoint, data),
  put: (endpoint, data) => axios.put(endpoint, data),
  del: (endpoint, params = {}) => axios.delete(endpoint, { params }),
};

export default API;
