import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../hook-form/FormProvider";
import { Alert, Button, IconButton, Stack } from "@mui/material";
import RHFCodes from "../hook-form/RHFCodes";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail } from "../../redux/auth/authApi";
import useAuth from "../../hooks/useAuth";
import { selectEmail, updateEmail } from "../../redux/auth/authSlice";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../common/LoadingScreen";
import { showSnackbar } from "../../redux/app/appSlice";

// {code1: value, code2: value...}
const makeCodeObj = (valueOfKey, otpLength, keyName) => {
  return [...Array(otpLength).keys()].reduce((newObj, i) => {
    // first key start with 1
    newObj[`${keyName}${i + 1}`] = valueOfKey;
    return newObj;
  }, {});
};

const VerifyForm = () => {
  const dispatch = useDispatch();
  const email = useSelector(selectEmail);
  const navigate = useNavigate();

  const otpLength = 6;

  const schemaObj = makeCodeObj(
    Yup.string().required("Code is required"),
    6,
    "code"
  );
  const verifyCodeSchema = Yup.object(schemaObj);

  const defaultValues = makeCodeObj("", 6, "code");

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(verifyCodeSchema),
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
    const otp = Object.values(data).join("");
    const onSuccess = (res) => {
      dispatch(updateEmail({ email: "" }));
      dispatch(
        showSnackbar({ severity: "success", message: res.data.message })
      );
      navigate("/auth/login");
    };

    const onFailure = (error) => {
      console.log(error);
      reset();
      setError("afterSubmit", {
        type: "custom",
        message: error?.response?.data?.message ?? "Something wrong",
      });
    };

    await callAction(verifyEmail({ otp, email }, onSuccess, onFailure));
  };
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.afterSubmit && (
            <Alert severity="error">{errors.afterSubmit.message}</Alert>
          )}
          {isLoading && <LoadingScreen />}
          <RHFCodes
            {...{
              keyName: "code",
              otpLength,
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
            Verify
          </Button>
        </Stack>
      </FormProvider>
    </>
  );
};

export default VerifyForm;
