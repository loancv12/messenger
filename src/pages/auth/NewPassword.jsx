import { Link, Stack, Typography } from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import NewPasswordForm from "../../components/auth/NewPasswordForm";

const NewPassword = () => {
  return (
    <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
      <Typography variant="h3" paragraphs="true">
        Reset password
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 5 }}>
        Please set your new password
      </Typography>
      {/* // New password Form */}
      <NewPasswordForm />
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

export default NewPassword;
