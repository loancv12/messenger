import React, { useCallback, useEffect, useRef, useState } from "react";
import { axiosPrivate } from "../services/axios/axiosClient";

function useAxiosPrivate(customConfig = {}) {
  const axiosConfig = {
    plainPromise: false,
    ...customConfig,
  };
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

      const promise = axiosPrivate.request({
        ...config,
        method,
        [dataOrParams]: data,
      });

      if (axiosConfig.plainPromise) {
        return promise;
      } else {
        try {
          setApiCallState({ ...defaultState, isLoading: true });
          const res = await promise;
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
      }
    },
    [axiosPrivate]
  );

  return { callAction, ...apiCallState };
}

export default useAxiosPrivate;
