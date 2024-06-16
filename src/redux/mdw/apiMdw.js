import axios from "axios";
import { BASE_URL } from "../../config";
import axiosInstance from "../../utils/axios";
import { showSnackbar } from "../app/appSlice";

// export const
export const apiError = (err) =>
  showSnackbar({
    severity: "error",
    message: err?.response?.data?.message ?? err.message,
  });

export function apiAction({
  url = "",
  method = "GET",
  headers,
  data = null,
  onApiStart = null,
  onApiEnd = null,
  onUploadProgress = () => {},
  onDownloadProgress = () => {},
  onSuccess = () => {},
  onFailure = () => {},
}) {
  return {
    type: "api",
    payload: {
      url,
      method,
      headers,
      data,
      onApiStart,
      onApiEnd,
      onUploadProgress,
      onDownloadProgress,
      onSuccess,
      onFailure,
    },
  };
}

const apiMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    next(action);
    if (action.type !== "api") {
      return;
    }
    const {
      url,
      method,
      data,
      onApiStart,
      onApiEnd,
      onSuccess,
      onFailure,
      headers,
      onUploadProgress,
      onDownloadProgress,
    } = action.payload;

    const dataOrParams = ["GET"].includes(method) ? "params" : "data";

    if (onApiStart) {
      onApiStart();
    }

    // axios default configs
    // axios.defaults.baseURL = BASE_URL || "";
    // axios.defaults.headers.common["Content-Type"] = "application/json";
    // axios.defaults.headers.common["Authorization"] = `Bearer ${
    //   getState().auth.token
    // }`;
    // axios.defaults.withCredentials = "includes";
    if (getState().auth.token) {
      const accessToken = getState().auth.token;
      axiosInstance.interceptors.request.use(
        function (config) {
          // Do something before request is sent
          console.log("config at interceptors", config);
          config.headers.Authorization = `Bearer ${accessToken}`;
          return config;
        },
        function (error) {
          // Do something with request error
          console.log("error at interceptors", config);

          return Promise.reject(error);
        }
      );
      axiosInstance.interceptors.response.use(
        function (response) {
          // Any status code that lie within the range of 2xx cause this function to trigger
          // Do something with response data
          console.log("res at intercepter", response);
          if (response.status === 403) {
            // TODO
          }
          return response;
        },
        function (error) {
          // Any status codes that falls outside the range of 2xx cause this function to trigger
          // Do something with response error
          return Promise.reject(error);
        }
      );
    }

    axiosInstance
      .request({
        url,
        method,
        headers,
        onDownloadProgress,
        onUploadProgress,

        [dataOrParams]: data,
      })
      .then((res) => {
        const { data } = res;
        onSuccess(res);
      })
      .catch((err) => {
        console.log(err);
        dispatch(apiError(err));
        if (onFailure) {
          onFailure(err);
        }
      })
      .finally(() => {
        if (onApiEnd) {
          onApiEnd();
        }
      });
  };
export default apiMiddleware;
