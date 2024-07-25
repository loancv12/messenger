import React, { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance, { axiosNoJWT } from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setCredentials } from "../redux/auth/authSlice";
import useRefresh from "./useRefresh";

function useAxios(comp) {
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
        console.log(error);
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

  return { callAction, ...apiCallState };
}

export default useAxios;
