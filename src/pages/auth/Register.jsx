import { Typography, Stack, Link } from "@mui/material";
import React from "react";
import { Link as LinkRouter } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import AuthSocial from "../../components/auth/AuthSocial";

const Register = () => {
  return (
    <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
      <Typography variant="h4">Get started with Takw</Typography>
      <Stack direction={"row"} spacing={0.5}>
        <Typography variant="body2">Already have an account?</Typography>
        <Link component={LinkRouter} to="/auth/login">
          Sign in
        </Link>
      </Stack>
      {/* Regiter form */}
      <RegisterForm />
      <Typography
        component={"div"}
        color="text.secondary"
        sx={{
          mt: 3,
          typography: "caption",
          textAlign: "center",
        }}
      >
        {"By signing up, I gree to "}
        <Link underline="always" color="text.primary">
          Term of service
        </Link>
        {" and "}
        <Link underline="always" color="text.primary">
          Privacy Policy
        </Link>
      </Typography>
      <AuthSocial />
    </Stack>
  );
};

export default Register;
