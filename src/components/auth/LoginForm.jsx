import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
} from "@mui/material";
import { Eye, EyeSlash } from "phosphor-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { string } from "yup";
import { RHFTextField } from "../../components/hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import usePersist from "../../hooks/usePersist";
import { logInUser } from "../../redux/auth/authApi";
import { setCredentials } from "../../redux/auth/authSlice";
import transformObj, { transformPwd } from "../../utils/transform";
import LoadingScreen from "../common/LoadingScreen";

const LoginForm = () => {
  const [showPwd, setShowPwd] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [persist, setPersist] = usePersist();

  const { callAction, isLoading, isError, error } = useAxiosPublic();

  const handleToggle = () => {
    setPersist((prev) => !prev);
  };

  const LoginSchema = Yup.object({
    email: Yup.string()
      .required("Emal is required")
      .email("Email must be a valid email"),
    pwd: string().required("Password is required"),
  });
  const defaultValues = {
    email: "demo2@gmail.com",
    pwd: "user123",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    const onFailure = (error) => {
      console.log(error);
      reset();
      setError("afterSubmit", {
        type: "custom",
        message: error?.response?.data?.message ?? "Something wrong",
      });
    };

    const onSuccess = (res) => {
      const { data: token, message } = res.data;
      dispatch(
        setCredentials({
          token,
        })
      );
      const prevPath = location.state.from;
      console.log("run navifate", prevPath);
      navigate(prevPath || "/direct-chat");
    };

    const solveData = transformObj(data, transformPwd);

    await callAction(logInUser(solveData, onSuccess, onFailure));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
        {isLoading && <LoadingScreen />}
        <RHFTextField
          name="email"
          label="Email address"
          autoComplete="email"
          autoFocus
        />
        <RHFTextField
          name="pwd"
          label="Password"
          autoComplete="current-password"
          type={showPwd ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={(e) => setShowPwd((prev) => !prev)}>
                  {showPwd ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack
        direction="row"
        alignItems={"flex-end"}
        justifyContent={"space-between"}
        sx={{ my: 2 }}
      >
        <label htmlFor="persist">
          <input
            type="checkbox"
            className="form__checkbox"
            id="persist"
            onChange={handleToggle}
            checked={persist}
          />
          Trust This Device
        </label>
        <Link
          variant="body2"
          to="/auth/forgot-password"
          component={RouterLink}
          color="inherit"
          underline="always"
          sx={{ cursor: "Pointer" }}
        >
          Forgot password
        </Link>
      </Stack>
      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        sx={{
          bgcolor: "text.primary",
          color: (theme) =>
            theme.palette.mode === "light" ? "common.white" : "#000",
          "&:hover": {
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "grey.000",
          },
        }}
      >
        Login
      </Button>
    </FormProvider>
  );
};

export default LoginForm;
