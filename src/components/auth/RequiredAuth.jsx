import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequiredAuth = () => {
  const location = useLocation();
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
    } else {
      localStorage.setItem("userId", null);
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
