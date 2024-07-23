import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setCredentials } from "../../redux/auth/authSlice";
import axiosInstance, { axiosNoJWT } from "../../utils/axios";
import useRefresh from "../../hooks/useRefresh";

const SetupAxios = ({ children }) => {
  const token = useSelector(selectToken);
  const dispatch = useDispatch();
  const refresh = useRefresh();

  return <>{children}</>;
};

export default SetupAxios;
