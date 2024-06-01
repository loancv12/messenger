import React from "react";
import { useSelector } from "react-redux";
import { selectToken } from "../redux/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectToken);

  if (token) {
    const decoded = jwtDecode(token);
    const { userId, email } = decoded;

    return { userId, email, isLoggedIn: true };
  }
  return { userId: "", email: "", isLoggedIn: false };
};

export default useAuth;
