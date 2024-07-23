import React from "react";
import { dispatch } from "../redux/store";
import { setCredentials } from "../redux/auth/authSlice";
import { axiosNoJWT } from "../utils/axios";

const useRefresh = () => {
  const refresh = async () => {
    const response = await axiosNoJWT.get("/auth/refresh", {
      withCredentials: true,
    });
    dispatch(setCredentials({ token: response.data.data }));
    return response.data.data;
  };
  return refresh;
};

export default useRefresh;
