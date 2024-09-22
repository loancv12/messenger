import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Stack } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import ResetPwdSchema from "../../hookForm/schema/ResetPwdSchema";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { showSnackbar } from "../../redux/app/appSlice";
import { forgotPwd } from "../../redux/auth/authApi";
import { dispatch } from "../../redux/store";
import LoadingScreen from "../common/LoadingScreen";
import { RHFTextField } from "../hook-form";
import FormProvider from "../hook-form/FormProvider";

const ForgotPasswordForm = () => {
  const defaultValues = {
    email: "demo@gmail.com",
  };

  const methods = useForm({
    resolver: yupResolver(ResetPwdSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = methods;

  const { callAction, isLoading, isError, error } = useAxiosPublic();

  const onSubmit = async (data) => {
    const onSuccess = (res) => {
      dispatch(
        showSnackbar({ severity: "success", message: res.data.message })
      );
    };

    const onFailure = (error) => {
      console.log(error);
      reset();
      setError("afterSubmit", {
        type: "custom",
        message: error?.response?.data?.message ?? "Something wrong",
      });
    };
    await callAction(forgotPwd(data, onSuccess, onFailure));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
        {isLoading && <LoadingScreen />}
        <RHFTextField name="email" label="Email address" autoFocus />
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
          Send request
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default ForgotPasswordForm;
