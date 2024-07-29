import React, { useCallback, useEffect, useRef, useState } from "react";
import axiosInstance, { axiosNoJWT } from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setCredentials } from "../redux/auth/authSlice";
import useRefresh from "./useRefresh";

function useAxios(comp) {
  const defaultState = {
    isLoading: false,
    isError: false,
    error: null,
    isSuccessful: false,
    isUninitialized: true,
  };
  const [apiCallState, setApiCallState] = useState(defaultState);

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
      console.log("set loading tru");
      setApiCallState({ ...defaultState, isLoading: true });
      try {
        const res = await axiosInstance.request({
          ...config,
          method,
          [dataOrParams]: data,
        });
        onSuccess(res);
        setApiCallState({ ...defaultState, isSuccessful: true });
      } catch (error) {
        console.log(error);
        setApiCallState({ ...defaultState, error, isError: true });

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
