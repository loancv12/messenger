import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../hook-form/FormProvider";
import { Button, IconButton, Stack } from "@mui/material";
import RHFCodes from "../hook-form/RHFCodes";
import { useDispatch, useSelector } from "react-redux";
import transform from "../../utils/transform";
import { verifyEmail } from "../../redux/auth/authApi";
import useAuth from "../../hooks/useAuth";
import { selectEmail } from "../../redux/auth/authSlice";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

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

  const { handleSubmit, formState } = methods;

  const { callAction, isLoading, isError, error } = useAxiosPrivate();

  const onSubmit = async (data) => {
    const otp = Object.values(data).join("");
    try {
      await callAction(verifyEmail({ otp, email }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {/* custom otp Input */}
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
