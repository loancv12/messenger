import React, { useState } from "react";
import FormProvider from "../../components/hook-form/FormProvider";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
} from "@mui/material";
import { RHFTextField } from "../../components/hook-form";
import { Eye, EyeSlash } from "phosphor-react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/auth/authApi";
import transform from "../../utils/transform";
import { useNavigate } from "react-router-dom";
import { showSnackbar } from "../../redux/app/appSlice";
import { updateEmail } from "../../redux/auth/authSlice";
import RegisterSchema from "../../hookForm/schema/RegisterSchema";

const RegisterForm = () => {
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "demo@gmail.com",
    pwd: "user123",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSuccess = (res) => {
    console.log(res);
    dispatch(showSnackbar({ severity: "success", message: res.data.message }));
    dispatch(updateEmail({ email: res.data.data.email }));

    navigate("/auth/verify");
  };

  const onSubmit = async (data) => {
    const transformMap = {
      pwd: {
        newKey: "password",
      },
    };
    const transformData = transform(data, transformMap);

    dispatch(registerUser(transformData, onSuccess));
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit}</Alert>
        )}
        <Stack spacing={2} direction={{ sx: "column", sm: "row" }}>
          <RHFTextField name="firstName" label="First Name" />
          <RHFTextField name="lastName" label="Last Name" />
        </Stack>
        <RHFTextField name="email" label="Email" />
        <RHFTextField
          name="pwd"
          label="Password"
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
          Register
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default RegisterForm;
