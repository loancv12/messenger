import React, { useEffect, useRef, useState } from "react";
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
  const token = useSelector(selectToken);

  const persist = usePersist();
  const isFirstMount = useRef(true);
  const usedToHaveToken = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (
      isFirstMount.current === false ||
      process.env.NODE_ENV !== "development"
    ) {
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
    }
    return () => {
      isFirstMount.current = false;
    };
  }, []);

  useEffect(() => {
    if (token) {
      usedToHaveToken.current = true;
    }
  }, [token]);

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
      } else if (usedToHaveToken.current) {
        content = <Navigate to="/auth/login" />;
      }
    }
  }
  return content;
};

export default PersistLogin;
