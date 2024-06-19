import axiosInstance from "../../utils/axios";
import { showSnackbar } from "../app/appSlice";
import { setCredentials } from "../auth/authSlice";

export function apiAction({
  url = "",
  method = "GET",
  headers,
  data = null,
  onApiStart = () => {},
  onApiEnd = () => {},
  onUploadProgress = () => {},
  onDownloadProgress = () => {},
  onSuccess = () => {},
  onFailure = () => {},
  transformResponse = [
    function (data) {
      // Do whatever you want to transform the data

      return data;
    },
  ],
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
      onSuccess,
      onFailure,
      onUploadProgress,
      onDownloadProgress,
      transformResponse,
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
      headers,
      data,
      onApiStart,
      onApiEnd,
      onSuccess,
      onFailure,
      onUploadProgress,
      onDownloadProgress,
      transformResponse,
    } = action.payload;

    const dataOrParams = ["GET"].includes(method) ? "params" : "data";

    onApiStart();

    if (getState().auth.token) {
      axiosInstance.interceptors.request.use(
        function (config) {
          const accessToken = getState().auth.token;
          config.headers.Authorization = `Bearer ${accessToken}`;
          return config;
        },
        function (error) {
          return Promise.reject(error);
        }
      );
      axiosInstance.interceptors.response.use(
        function (response) {
          return response;
        },
        async function (error) {
          const prevRequest = error?.config;
          if (error.response.status === 403 && !prevRequest?.sent) {
            prevRequest.sent = true;
            try {
              const res = await axiosInstance.get("/auth/refresh");
              const newAccessToken = res.data.data;
              dispatch(setCredentials({ token: newAccessToken }));
              return axiosInstance(prevRequest);
            } catch (error) {
              if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log("Error", error.message);
              }
            }
          }
          return Promise.reject(error);
        }
      );
    }

    axiosInstance.interceptors.response.use(
      function (response) {
        if (
          response.headers.hasContentType("application/json") &&
          typeof response.data === "string"
        ) {
          response.data = JSON.parse(response.data);
        }
        return response;
      },
      function (error) {
        return Promise.reject(error);
      }
    );

    axiosInstance
      .request({
        url,
        method,
        headers,
        onDownloadProgress,
        onUploadProgress,
        transformResponse,
        [dataOrParams]: data,
      })
      .then((res) => {
        onSuccess(res);
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          showSnackbar({
            severity: "error",
            message: err?.response?.data?.message ?? err.message,
          })
        );
        onFailure(err);
      })
      .finally(() => {
        onApiEnd();
      });
  };
export default apiMiddleware;
