import axios, { isCancel, AxiosError } from "axios";
import { BASE_URL } from "../config";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  //   withCredentials: true,
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
