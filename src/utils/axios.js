import axios, { isCancel, AxiosError } from "axios";
import { BASE_URL } from "../config";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-type": "application/json" },
  withCredentials: true,
});

// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     return Promise.reject(
//       (error.response && error.response.data) || "Something went wrong"
//     );
//   }
// );

export default axiosInstance;
