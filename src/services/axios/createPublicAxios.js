import axios from "axios";
import { BASE_URL } from "../../config";

export function createPublicAxios() {
  const axiosPublic = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  const resInterceptor = axiosPublic.interceptors.response.use(
    (response) => {
      console.log(response);

      if (
        response.headers.hasContentType("application/json") &&
        typeof response.data === "string"
      ) {
        response.data = JSON.parse(response.data);
      }
      return response;
    },
    (error) => {
      if (
        error?.response?.headers?.hasContentType("application/json") &&
        typeof error?.response?.data === "string"
      ) {
        error.response.data = JSON.parse(error?.response?.data);
      }
      return Promise.reject(error);
    }
  );

  return axiosPublic;
}
