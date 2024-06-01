import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import AuthSocial from "../../components/auth/AuthSocial";
import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  return (
    <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
      <Typography variant="h4">Login To Takw</Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">New account?</Typography>
        <Link to="/auth/register" component={RouterLink} variant="subtitle">
          Create an account
        </Link>
      </Stack>
      {/* Form */}
      <LoginForm />
      {/* Auth Social */}
      <AuthSocial />
    </Stack>
  );
};

export default Login;
