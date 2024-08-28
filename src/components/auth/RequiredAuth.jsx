import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { setCurrUserId } from "../../redux/auth/authSlice";

const RequiredAuth = () => {
  const location = useLocation();
  const { userId } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) {
      localStorage.setItem("isAuthenticated", true);
      dispatch(setCurrUserId({ currUserId: userId }));
    }
  }, [userId]);
  const content = userId ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );

  return content;
};

export default RequiredAuth;
