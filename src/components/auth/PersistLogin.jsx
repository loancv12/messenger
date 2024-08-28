import React, { useEffect, useRef, useState } from "react";
import usePersist from "../../hooks/usePersist";
import { useDispatch, useSelector } from "react-redux";
import { selectToken, setCredentials } from "../../redux/auth/authSlice";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import LoadingScreen from "../common/LoadingScreen";
import { axiosPublic } from "../../services/axios/axiosClient";

const PersistLogin = () => {
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
          const res = await axiosPublic.get("/auth/refresh");
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
    content = <Outlet />;
  } else {
    // content = <Outlet />;

    if (token) {
      content = <Outlet />;
    } else {
      if (isLoading) {
        content = <LoadingScreen />;
      } else if (isError) {
        console.log("error");
        // state to prevent circular from PersistLogin to PreventLoginAgain
        content = (
          <Navigate to="/auth/login" state={{ cannotPersistLogin: true }} />
        );
      } else if (usedToHaveToken.current) {
        content = (
          <Navigate to="/auth/login" state={{ cannotPersistLogin: true }} />
        );
      }
    }
  }
  return content;
};

export default PersistLogin;
