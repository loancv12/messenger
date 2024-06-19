import React, { useEffect, useState } from "react";
import usePersist from "../../hooks/usePersist";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setCredentials } from "../../redux/auth/authSlice";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import LoadingScreen from "../LoadingScreen";
import axiosInstance from "../../utils/axios";

const PersistLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persist = usePersist();
  const token = useSelector(selectToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyRefresh = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/auth/refresh");
        const newAccessToken = res.data.data;
        dispatch(setCredentials({ token: newAccessToken }));
        setIsSuccess(true);
      } catch (error) {
        console.log(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (persist && !token) verifyRefresh();
  }, []);

  let content;
  if (!persist) {
    console.log("no persist");
    content = <Outlet />;
  } else {
    // content = <Outlet />;

    if (token) {
      console.log("have token");

      content = <Outlet />;
    } else {
      if (isLoading) {
        console.log("loading");

        content = <LoadingScreen />;
      } else if (isError) {
        console.log("error");

        content = <Navigate to="/auth/login" />;
      }
    }
  }
  return content;
};

export default PersistLogin;
