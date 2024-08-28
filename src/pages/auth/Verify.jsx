import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import VerifyForm from "../../components/auth/VerifyForm";
import { useDispatch, useSelector } from "react-redux";
import { selectEmail } from "../../redux/auth/authSlice";
import { resendOtp } from "../../redux/auth/authApi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const Verify = () => {
  const email = useSelector(selectEmail);
  const { callAction, isLoading, isError, error } = useAxiosPrivate();

  const dispatch = useDispatch();
  const handleResentOtp = async () => {
    try {
      await callAction(resendOtp({ email }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h3" paragraphs="true">
          Please verify your otp
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{ mb: 5 }}
        >
          <Typography sx={{ color: "text.secondary" }}>
            Sent otp to email ({email})
          </Typography>
          <Button onClick={handleResentOtp}>Not receive OTP? Resent otp</Button>
        </Stack>
        {/* Verify form */}
        <VerifyForm />
      </Stack>
    </>
  );
};

export default Verify;
