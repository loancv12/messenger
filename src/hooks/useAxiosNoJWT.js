import React, { useCallback, useEffect, useState } from "react";
import { axiosNoJWT } from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../redux/auth/authSlice";
import { apiAction } from "../utils/apiAction";

function useAxiosNoJWT() {
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
        const res = await axiosNoJWT.request({
          ...config,
          method,
          [dataOrParams]: data,
        });
        onSuccess(res);
        setApiCallState((prev) => ({ ...prev, isSuccessful: true }));
      } catch (error) {
        setApiCallState((prev) => ({ ...prev, isError: true, error: error }));
        onFailure();
      } finally {
        setApiCallState((prev) => ({
          ...prev,
          isLoading: false,
          isUninitialized: false,
        }));
      }
    },
    [axiosNoJWT]
  );

  useEffect(() => {
    const resInterceptor = axiosNoJWT.interceptors.response.use(
      (response) => {
        if (
          response.headers.hasContentType("application/json") &&
          typeof response.data === "string"
        ) {
          response.data = JSON.parse(response.data);
        }
        return response;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosNoJWT.interceptors.response.eject(resInterceptor);
    };
  }, []);

  return { callAction, ...apiCallState };
}

export default useAxiosNoJWT;
