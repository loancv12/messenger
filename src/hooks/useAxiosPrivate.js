import React, { useCallback, useEffect, useRef, useState } from "react";
import { axiosPrivate } from "../services/axios/axiosClient";

function useAxiosPrivate({ plainPromise = false }) {
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
      setApiCallState({ ...defaultState, isLoading: true });
      const callWithWrapper = async () => {
        try {
          const res = await axiosPrivate.request({
            ...config,
            method,
            [dataOrParams]: data,
          });
          onSuccess(res);
          setApiCallState({ ...defaultState, isSuccessful: true });
        } catch (error) {
          console.log(error);
          setApiCallState({ ...defaultState, error, isError: true });
          onFailure(error);
        } finally {
          setApiCallState((prev) => ({
            ...prev,
            isLoading: false,
            isUninitialized: false,
          }));
        }
      };
      const callNoWrapper = async () => {
        const res = await axiosPrivate.request({
          ...config,
          method,
          [dataOrParams]: data,
        });
        onSuccess(res);
      };
      const callApi = plainPromise ? callNoWrapper : callWithWrapper;
      return callApi();
    },
    [axiosPrivate]
  );

  return { callAction, ...apiCallState };
}

export default useAxiosPrivate;
