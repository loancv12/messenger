import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { DEFAULT_PATH } from "../../config";

// this component prevent navigate to login, register,resetPassword, ForgotPassword. verify when user already login
// when user login again, the jwt cookie was override,
const PreventLoginAgain = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated");
  const location = useLocation();
  const stateLocation = location.state;

  useEffect(() => {
    if (stateLocation?.cannotPersistLogin && isAuthenticated) {
      localStorage.removeItem("isAuthenticated");
    }
  }, [isAuthenticated]);
  const content = stateLocation?.cannotPersistLogin ? (
    <Outlet />
  ) : isAuthenticated ? (
    <Navigate to={DEFAULT_PATH} />
  ) : (
    <Outlet />
  );
  // const content = <Outlet />;
  return content;
};

export default PreventLoginAgain;
