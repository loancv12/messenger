import { logout, setCredentials, updateEmail } from "../auth/authSlice";
import { dispatch, persistor } from "../store";
import { apiAction } from "../../utils/apiAction";
import { showSnackbar } from "../app/appSlice";

export const logInUser = (formValues) =>
  apiAction({
    url: "/auth/login",
    method: "POST",
    data: { ...formValues },
    onSuccess: (res) => {
      const { data: token, message } = res.data;
      console.log("set token", token);
      dispatch(
        setCredentials({
          token,
        })
      );
    },
  });

export const logInWithGg = (formValues) =>
  apiAction({
    url: "/auth/login/google",
    method: "POST",
    data: { ...formValues },
    onSuccess: (res) => {
      console.log("set token", res);
      const { data: token, message } = res.data;
      dispatch(
        setCredentials({
          token,
        })
      );
    },
  });

export const refresh = () =>
  apiAction({
    url: "/auth/refresh",
    onSuccess: (res) => {
      const { data: token, message } = res.data;
      dispatch(
        setCredentials({
          token,
        })
      );
    },
  });
export const logOutUser = (clientId) =>
  apiAction({
    url: "/auth/logout",
    method: "POST",
    data: { clientId },
    onSuccess: (res) => {
      dispatch(logout());
      localStorage.removeItem("isAuthenticated", true);
      localStorage.removeItem("userId");
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
        setCredentials({
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
        setCredentials({
          token,
        })
      );
      dispatch(updateEmail({ email: "" }));
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
