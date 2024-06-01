import React, { useState } from "react";
import FormProvider from "../../components/hook-form/FormProvider";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Alert, Button, Link, Stack } from "@mui/material";
import { RHFTextField } from "../../components/hook-form";
import { dispatch } from "../../redux/store";
import { forgotPwd } from "../../redux/auth/authApi";
import ResetPwdSchema from "../../hookForm/schema/ResetPwdSchema";

const ResetPasswordForm = () => {
  const defaultValues = {
    email: "demo@gmail.com",
  };

  const methods = useForm({
    resolver: yupResolver(ResetPwdSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    dispatch(forgotPwd(data));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit}</Alert>
        )}
        <RHFTextField name="email" label="Email address" />
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

export default ResetPasswordForm;
