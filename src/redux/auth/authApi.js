import { jwtDecode } from "jwt-decode";
import { logIn, logout, updateEmail } from "../auth/authSlice";
import { dispatch, persistor } from "../store";
import { apiAction } from "../mdw/apiMdw";
import { showSnackbar } from "../app/appSlice";

export const logInUser = (formValues) =>
  apiAction({
    url: "/auth/login",
    method: "POST",
    data: { ...formValues },
    onSuccess: (res) => {
      const { data: token, message } = res.data;
      dispatch(
        logIn({
          isLoggedIn: true,
          token,
        })
      );
      const decoded = jwtDecode(token);
      localStorage.setItem("userId", decoded.userId);
    },
  });

export const logOutUser = (formValues) =>
  apiAction({
    url: "/auth/logout",
    method: "POST",
    data: { ...formValues },
    onSuccess: (res) => {
      dispatch(logout());
      window.localStorage.removeItem("userId");
      persistor.purge().then(() => {
        dispatch({ type: "reset" });

        console.log("Persisted state has been cleared.");
      });
    },
  });

export const forgotPwd = (formValues) =>
  apiAction({
    url: "/auth/forgot-password",
    method: "POST",
    data: { ...formValues },
    onSuccess: (res) => {
      console.log(res);
    },
  });

export const resetPwd = (formValues) =>
  apiAction({
    url: "/auth/reset-password",
    method: "POST",
    data: { ...formValues },
    onSuccess: (res) => {
      console.log("res in forgor pwd", res);
      const { data: token } = res.data;
      dispatch(
        logIn({
          isLoggedIn: true,
          token,
        })
      );
    },
  });

export const registerUser = (formValues, onSuccess) =>
  apiAction({
    url: "/auth/register",
    method: "POST",
    data: { ...formValues },
    onSuccess,
  });

export const verifyEmail = (formValues) =>
  apiAction({
    url: "/auth/verify-otp",
    method: "POST",
    data: { ...formValues },
    onSuccess: (res) => {
      console.log("verifyEmail", res);
      const { data: token, message } = res.data;
      dispatch(
        logIn({
          isLoggedIn: true,
          token,
        })
      );
      dispatch(updateEmail({ email: "" }));
      const decoded = jwtDecode(token);
      console.log(decoded);
      localStorage.setItem("userId", decoded.userId);
      dispatch(showSnackbar({ severity: "success", message: message }));
    },
  });

export const resendOtp = (formValues) =>
  apiAction({
    url: "/auth/resend-otp",
    method: "POST",
    data: { ...formValues },
    onSuccess: (res) => {
      const { message } = res.data;
      dispatch(showSnackbar({ severity: "success", message }));
    },
  });
