import React, { useState } from "react";
import FormProvider from "../../components/hook-form/FormProvider";
import * as Yup from "yup";
import { object, string, number, date } from "yup";
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
import { Link as RouterLink } from "react-router-dom";
import { logInUser } from "../../redux/auth/authApi";
import { useDispatch } from "react-redux";
import transform from "../../utils/transform";
import usePersist from "../../hooks/usePersist";

const LoginForm = () => {
  const [showPwd, setShowPwd] = useState(false);
  const dispatch = useDispatch();
  const [persist, setPersist] = usePersist();

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
    try {
      // Submit data
      console.log(data);

      const tranformerMap = {
        pwd: {
          newKey: "password",
        },
      };
      const transformData = transform(data, tranformerMap);
      dispatch(logInUser(transformData));
    } catch (error) {
      console.log(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit}</Alert>
        )}
        <RHFTextField name="email" label="Email address" autoComplete="email" />
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
          to="/auth/reset-password"
          component={RouterLink}
          color="inherit"
          underline="always"
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
