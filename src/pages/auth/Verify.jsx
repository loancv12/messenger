import { Alert, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import VerifyForm from "../../components/auth/VerifyForm";
import { useDispatch, useSelector } from "react-redux";
import { selectEmail } from "../../redux/auth/authSlice";
import { resendOtp } from "../../redux/auth/authApi";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import CountdownTimer from "../../components/auth/CountDownTimer";
import { Link } from "react-router-dom";
import LoadingScreen from "../../components/common/LoadingScreen";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { showSnackbar } from "../../redux/app/appSlice";

const Verify = () => {
  const getOtpExpiryTime = () => {
    return Date.now() + 10 * 1000;
  };
  const email = useSelector(selectEmail);
  const { callAction, isLoading, isError, error } = useAxiosPublic();
  const [otpExpiryTime, setOtpExpiryTime] = useState(getOtpExpiryTime);
  const [timeUp, setTimeUp] = useState(false);

  const dispatch = useDispatch();
  const handleResentOtp = async () => {
    const onSuccess = (res) => {
      const { message } = res.data;
      dispatch(showSnackbar({ severity: "success", message }));
      setTimeUp(false);
      const test = getOtpExpiryTime();
      setOtpExpiryTime(test);
    };
    await callAction(resendOtp({ email }, onSuccess));
  };

  const handleTimeUp = () => {
    setTimeUp(true);
  };
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        {isError && (
          <Alert severity="error">
            {error?.response?.data?.message ?? "Something wrong"}
          </Alert>
        )}
        {isLoading && <LoadingScreen />}
        <Typography
          variant="h2"
          sx={{
            fontSize: "2rem !important",
          }}
        >
          Verify your otp
        </Typography>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          sx={{ mb: 5 }}
        >
          {email ? (
            <Typography sx={{ color: "text.secondary" }}>
              Sent otp to {email}
            </Typography>
          ) : (
            <Link to="/auth/register">You must register again</Link>
          )}
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <CountdownTimer
              otpExpiryTime={otpExpiryTime}
              handleTimeUp={handleTimeUp}
              timeUp={timeUp}
            />
            <Button onClick={handleResentOtp} disabled={!timeUp}>
              {" "}
              Resent otp
            </Button>
          </Stack>
        </Stack>
        {/* Verify form */}
        <VerifyForm />
      </Stack>
    </>
  );
};

export default Verify;
