import { Divider, Icon, IconButton, Stack } from "@mui/material";
import { GithubLogo, GoogleLogo, TwitterLogo } from "phosphor-react";
import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { logInWithGg } from "../../redux/auth/authApi";
import { jwtDecode } from "jwt-decode";
import { useGoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/app/appSlice";

const AuthSocial = () => {
  const dispatch = useDispatch();
  const { callAction, isLoading, isSuccessful, isError } =
    useAxiosPublic("login with gg");

  const handleLoginWithGg = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await callAction(logInWithGg({ codeResponse }));
    },
    onError: (err) => {
      console.log(err);
      dispatch(showSnackbar({ severity: "error", message: "Something wrong" }));
    },
    flow: "auth-code",
  });

  return (
    <div>
      <Divider
        sx={{
          my: 2.5,
          typography: "overline",
          color: "text.disabled",
          "&::before, ::after": {
            borderTopStyle: "dashed",
          },
        }}
      >
        OR
      </Divider>
      <Stack direction="row" justifyContent={"center"} spacing={2}>
        <IconButton onClick={handleLoginWithGg}>
          <GoogleLogo />
        </IconButton>
      </Stack>
    </div>
  );
};

export default AuthSocial;
