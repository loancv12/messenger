import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { setCurrUserId } from "../../redux/auth/authSlice";
import { fetchCurrUser } from "../../redux/relationShip/relationShipApi";

const RequiredAuth = () => {
  const location = useLocation();
  const isFirstMount = useRef(true);
  const { userId } = useAuth();
  const dispatch = useDispatch();
  const { callAction } = useAxiosPrivate();

  useEffect(() => {
    if (userId) {
      localStorage.setItem("isAuthenticated", true);
      dispatch(setCurrUserId({ currUserId: userId }));

      if (
        isFirstMount.current === false ||
        process.env.NODE_ENV !== "development"
      ) {
        callAction(fetchCurrUser());
      }
    }

    return () => {
      isFirstMount.current = false;
    };
  }, [userId]);
  const content = userId ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
  );

  return content;
};

export default RequiredAuth;
