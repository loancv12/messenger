import { Box, IconButton, Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import ProfileForm from "../../../components/profile/ProfileForm";

const Profile = () => {
  const theme = useTheme();

  return (
    <>
      <Stack
        direction={"row"}
        sx={{
          width: "100%",
        }}
      >
        {/* Left */}
        <Box
          sx={{
            height: "100vh",
            width: "100%",
            p: { xs: 2, md: 4 },
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8F8F8"
                : theme.palette.background.default,
            boxShadow: "0 0 2px rgba(0,0,0,.25)",
          }}
        >
          <Stack spacing={2} p={3} sx={{ maxHeight: "100vh" }}>
            {/* Header */}
            <Stack
              direction={"row"}
              spacing={2}
              alignItems={"center"}
              justifyContent={{ xs: "flex-end", md: "unset" }}
            >
              <Typography variant="h5">Profile</Typography>
            </Stack>
            {/* Form */}
            <ProfileForm />
          </Stack>
        </Box>
        {/* Right */}
      </Stack>
    </>
  );
};

export default Profile;
