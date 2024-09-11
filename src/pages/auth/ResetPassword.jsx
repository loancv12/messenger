import { Link, Stack, Typography } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
      <Typography
        variant="h2"
        sx={{
          fontSize: "2rem !important",
        }}
      >
        Reset password
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 5 }}>
        Please set your new password. Please note that this action make all
        other logged devices log out.
      </Typography>
      {/* // New password Form */}
      <ResetPasswordForm />
      <Link
        component={RouterLink}
        to="/auth/login"
        color="inherit"
        variant="subtitle2"
        sx={{ mt: 3, mx: "auto" }}
        alignItems={"center"}
        display={"flex"}
      >
        <CaretLeft />
        Return to sign in
      </Link>
    </Stack>
  );
};

export default ResetPassword;
