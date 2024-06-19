import React from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../redux/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectToken);

  if (token) {
    const decoded = jwtDecode(token);
    const { userId } = decoded.userInfo;

    return { userId };
  }
  return { userId: "" };
};

export default useAuth;
