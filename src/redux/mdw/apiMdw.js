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
    axios.defaults.baseURL = BASE_URL || "";
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.headers.common["Authorization"] = `Bearer ${
      getState().auth.token
    }`;

    axios
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
