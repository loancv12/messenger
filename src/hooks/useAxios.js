import React, { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance, { axiosNoJWT } from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setCredentials } from "../redux/auth/authSlice";
import useRefresh from "./useRefresh";

function useAxios(comp) {
  const token = useSelector(selectToken);
  const firstMount = useRef(true);
  const dispatch = useDispatch();
  const refresh = useRefresh();
  const [apiCallState, setApiCallState] = useState({
    isLoading: false,
    isError: false,
    error: null,
    isSuccessful: false,
    isUninitialized: true,
  });

  const callAction = useCallback(
    async (apiAction) => {
      const {
        data,
        method,
        onSuccess = () => {},
        onFailure = () => {},
        ...config
      } = apiAction;
      const dataOrParams = ["GET"].includes(method) ? "params" : "data";
      setApiCallState((prev) => ({ ...prev, isLoading: true }));
      try {
        const res = await axiosInstance.request({
          ...config,
          method,
          [dataOrParams]: data,
        });
        onSuccess(res);
        setApiCallState((prev) => ({
          ...prev,
          error: null,
          isSuccessful: true,
          isError: false,
        }));
      } catch (error) {
        setApiCallState((prev) => ({
          ...prev,
          isError: true,
          error: error,
          isSuccessful: false,
        }));
        onFailure();
      } finally {
        setApiCallState((prev) => ({
          ...prev,
          isLoading: false,
          isUninitialized: false,
        }));
      }
    },
    [axiosInstance]
  );

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

  return { callAction, ...apiCallState };
}

export default useAxios;
