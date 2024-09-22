import { Container, Stack } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Logo from "../../assets/Images/logo.ico";
import { DEFAULT_PATH } from "../../config";
import useAuth from "../../hooks/useAuth";

const CenterScreenLayout = () => {
  const { userId } = useAuth();
  if (userId) {
    return <Navigate to={DEFAULT_PATH} />;
  }
  return (
    <>
      <Container sx={{ mt: 5 }} maxWidth="sm">
        <Stack spacing={5}>
          <Stack
            alignItems={"center"}
            sx={{ width: "100%" }}
            direction="column"
          >
            <img src={Logo} alt="logo" style={{ height: 120, width: 120 }} />
          </Stack>
        </Stack>
        {/* <div>Main Layout</div> */}
        <Outlet />
      </Container>
    </>
  );
};

export default CenterScreenLayout;
