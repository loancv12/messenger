import {
  Box,
  Stack,
  useTheme,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Grid,
} from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSidebar } from "../../redux/app/appSlice";
import { fa, faker } from "@faker-js/faker";
import { SHARED_DOCS, SHARED_LINKS } from "../../data";
import { DocMsg, LinkMsg } from "../conversation/MsgTypes";
import Messages from "../conversation/Messages";

const StarredMessages = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  return (
    <Box width={320} height="100vh">
      <Stack height={"100%"} width={"100%"}>
        {/* Header */}
        <Box
          sx={{
            boxShadow: "0 0 2px rgba(0,0,0,.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "F8F8F8"
                : theme.palette.background.paper,
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            height={"100%"}
            p={2}
            spacing={2}
          >
            <IconButton
              onClick={() => {
                dispatch(updateSidebar({ type: "CONTACT" }));
              }}
            >
              <CaretLeft />
            </IconButton>
            <Typography>Starred Messages</Typography>
          </Stack>
        </Box>
        {/* Body */}

        <Stack
          p={3}
          spacing={2}
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          <Messages />
        </Stack>
      </Stack>
    </Box>
  );
};

export default StarredMessages;
