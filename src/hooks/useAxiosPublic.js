import React, { useCallback, useEffect, useState } from "react";
import { axiosPublic } from "../services/axios/axiosClient";

function useAxiosPublic() {
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
        const res = await axiosPublic.request({
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
    [axiosPublic]
  );

  return { callAction, ...apiCallState };
}

export default useAxiosPublic;
