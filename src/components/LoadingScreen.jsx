// import { Spinner } from "phosphor-react";
import { Box, Stack, styled } from "@mui/material";
import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingScreen;
