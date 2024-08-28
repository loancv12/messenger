import { Divider, Icon, IconButton, Stack } from "@mui/material";
import { GithubLogo, GoogleLogo, TwitterLogo } from "phosphor-react";
import React, { useEffect, useState } from "react";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import { logInWithGg } from "../../redux/auth/authApi";
import { jwtDecode } from "jwt-decode";

const AuthSocial = () => {
  const { callAction, isLoading, isSuccessful, isError } =
    useAxiosPublic("login with gg");

  // You can get id_token (JWT) if you are using the personalized button for authentication.
  // when use GoogleLogin, it return credentialResponse includes credentials,
  // we can use jwtDecode to get directly email or other userInfos
  // when use useGoogleLogin, it return tokenResponse includes: access_token, ...
  // access_token can be used to fetch direct data from GG API
  // Authenticating the user involves obtaining an ID token and validating it.
  // useGoogleLogin hook is wrapping the Authorization part
  // https://www.googleapis.com/oauth2/v3/userinfo
  // flow: 'implicit', // implicit is the default
  // my web have BE, so should use authorization code flow
  // in authorization code flow, when use useGoogleLogin, it return codeResponse includes: code, scope, authuser

  const handleLoginWithGg = async () => {
    await callAction(logInWithGg());
  };

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
