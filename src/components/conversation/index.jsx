import Footer from "./Footer";
import Header from "./Header";
import {
  Stack,
  Box,
  IconButton,
  useTheme,
  Typography,
  Button,
} from "@mui/material";
import { CaretLeft, ChatCircle, ChatsCircle } from "phosphor-react";
import Messages from "./Messages";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { createImmutableStateInvariantMiddleware } from "@reduxjs/toolkit";
import { setCurrentCvsId } from "../../redux/conversation/conversationSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectChatType } from "../../redux/app/appSlice";

function Conversation({ handleBack }) {
  const theme = useTheme();
  console.log(theme);
  const dispatch = useDispatch();
  const { cvsId } = useParams();
  const chatType = useSelector(selectChatType);

  useEffect(() => {
    dispatch(setCurrentCvsId({ type: chatType, conversationId: cvsId }));
  }, [cvsId]);

  return (
    <Stack
      sx={{
        // height: "100%",
        // maxHeight: "100vh",
        height: "100vh",
        width: "auto",
        position: "relative",
      }}
    >
      <Box
        p={2}
        sx={{
          width: "100%",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8F8F8"
              : theme.palette.background.paper,
          boxShadow: "0 0 2px rgba(0,0,0,.25)",
          zIndex: 2,
        }}
      >
        <Stack direction={"row"} justifyContent={"space-between"}>
          <IconButton
            onClick={handleBack}
            sx={{
              display: { xs: "flex", md: "none" },
              marginRight: "10px",
            }}
          >
            <CaretLeft size={24} color="#1a4858" />
          </IconButton>
          <Header />
        </Stack>
      </Box>
      {/* MsG */}
      {/* <SimpleBarStyle> */}

      <Messages menu={true} />

      <Footer />
    </Stack>
  );
}

export default Conversation;
