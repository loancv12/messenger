import { Box, Stack } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

export const FullScreen = () => {
  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        position: "fixed",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: "#000000",
        color: "#fff",
        "&::-webkit-scrollbar": {
          width: 0,
        },
        /* IE and Edge */
        // scrollbarWidth: " none",
        /* Firefox */
        msOverflowStyle: "none",

        "& .MuiPaper-root": {
          overflowY: "unset",
        },
      }}
    >
      <Outlet />
    </Stack>
  );
};
