import { Divider, IconButton, Stack } from "@mui/material";
import { GithubLogo, GoogleLogo, TwitterLogo } from "phosphor-react";
import React from "react";

const AuthSocial = () => {
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
        <IconButton>
          <GoogleLogo color="#000" />
        </IconButton>
        <IconButton>
          <GithubLogo color="#000" />
        </IconButton>
        <IconButton>
          <TwitterLogo color="#1c9cdd" />
        </IconButton>
      </Stack>
    </div>
  );
};

export default AuthSocial;
