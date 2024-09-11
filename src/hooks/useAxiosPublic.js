import React, { useCallback, useEffect, useState } from "react";
import { axiosPublic } from "../services/axios/axiosClient";

function useAxiosPublic(customConfig = {}) {
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

      const promise = axiosPublic.request({
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
    [axiosPublic]
  );

  return { callAction, ...apiCallState };
}

export default useAxiosPublic;
