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
import { useSearchParams } from "react-router-dom";
import { dispatch } from "../../redux/store";
import { resetPwd } from "../../redux/auth/authApi";
import NewPwdSchema from "../../hookForm/schema/NewPwdSchema";

const NewPasswordForm = () => {
  const [showPwd, setShowPwd] = useState(false);

  const defaultValues = {
    newPwd: "",
    confirmPwd: "",
  };

  const methods = useForm({
    resolver: yupResolver(NewPwdSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;
  let [searchParams] = useSearchParams();

  const onSubmit = async (data) => {
    const token = searchParams.get("token");
    dispatch(resetPwd({ password: data.newPwd, token }));
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit}</Alert>
        )}
        <RHFTextField
          name="newPwd"
          label="New password"
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
        <RHFTextField
          name="confirmPwd"
          label="Confirm password"
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
          Submit
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default NewPasswordForm;
