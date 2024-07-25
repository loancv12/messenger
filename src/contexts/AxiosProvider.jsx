import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../redux/auth/authSlice";
import useRefresh from "../hooks/useRefresh";
import axiosInstance from "../utils/axios";

const AxiosProvider = ({ children }) => {
  const token = useSelector(selectToken);
  const firstMount = useRef(true);
  const dispatch = useDispatch();
  const refresh = useRefresh();
  useEffect(() => {
    let reqInterceptor, resInterceptor;
    if (!firstMount.current) {
      reqInterceptor = axiosInstance.interceptors.request.use(
        (config) => {
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );

      resInterceptor = axiosInstance.interceptors.response.use(
        (response) => {
          if (
            response.headers.hasContentType("application/json") &&
            typeof response.data === "string"
          ) {
            response.data = JSON.parse(response.data);
          }
          return response;
        },
        async (error) => {
          const prevReq = error?.config;

          if (error?.response?.status === 403 && !prevReq?.sent) {
            prevReq.sent = true;
            const newAccessToken = await refresh();
            prevReq.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosInstance(prevReq);
          }
          return Promise.reject(error);
        }
      );
    }
    return () => {
      firstMount.current = false;
      axiosInstance.interceptors.request.clear();
      axiosInstance.interceptors.response.clear();
    };
  }, [token]);

  return <>{children}</>;
};

export default AxiosProvider;
