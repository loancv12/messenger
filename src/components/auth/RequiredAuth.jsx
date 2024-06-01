import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequiredAuth = () => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const content = isLoggedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );

  return content;
};

export default RequiredAuth;
