import { logout, setCredentials, updateEmail } from "../auth/authSlice";
import { dispatch, persistor } from "../store";
import { apiAction } from "../../utils/apiAction";
import { showSnackbar } from "../app/appSlice";

export const logInUser = (formValues, onFailure) =>
  apiAction({
    url: "/auth/login",
    method: "POST",
    data: { ...formValues },
    onSuccess: (res) => {
      const { data: token, message } = res.data;
      dispatch(
        setCredentials({
          token,
        })
      );
    },
    onFailure,
  });

export const logInWithGg = (formValues) =>
  apiAction({
    url: "/auth/login/google",
    method: "POST",
    data: { ...formValues },
    onSuccess: (res) => {
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

export const forgotPwd = (formValues, onSuccess, onFailure) =>
  apiAction({
    url: "/auth/forgot-password",
    method: "POST",
    data: { ...formValues },
    onSuccess,
    onFailure,
  });

export const resetPwd = (formValues, onSuccess, onFailure) =>
  apiAction({
    url: "/auth/reset-password",
    method: "POST",
    data: { ...formValues },
    onSuccess,
    onFailure,
  });

export const registerUser = (formValues, onSuccess, onFailure) =>
  apiAction({
    url: "/auth/register",
    method: "POST",
    data: { ...formValues },
    onSuccess,
    onFailure,
  });

export const verifyEmail = (formValues, onSuccess, onFailure) =>
  apiAction({
    url: "/auth/verify-otp",
    method: "POST",
    data: { ...formValues },
    onSuccess,
    onFailure,
  });

export const resendOtp = (formValues, onSuccess) =>
  apiAction({
    url: "/auth/resend-otp",
    method: "POST",
    data: { ...formValues },
    onSuccess,
  });
