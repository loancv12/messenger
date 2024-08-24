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
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { createImmutableStateInvariantMiddleware } from "@reduxjs/toolkit";
import { setCurrentCvsId } from "../../redux/conversation/conversationSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectChatType, updateShowCvsComp } from "../../redux/app/appSlice";
import { chatTypes } from "../../redux/config";
import { NAVBAR } from "../../config";
import { Nav_Buttons } from "../../layouts/dashboard/Sidebar";
import { generalPath } from "../../routes/paths";

function Conversation() {
  // i tried to use selectChatType get it chatType,
  // but it have some problem with useEffect when useEffect updating chatType run after useEffect calling get msg
  const { chatType } = useOutletContext();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cvsId } = useParams();

  useEffect(() => {
    dispatch(setCurrentCvsId({ type: chatType, conversationId: cvsId }));
  }, [cvsId]);

  const handleBack = () => {
    dispatch(updateShowCvsComp({ open: false }));
    navigate(generalPath[chatType]);
  };

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
          <Header chatType={chatType} />
        </Stack>
      </Box>
      {/* MsG */}
      {/* <SimpleBarStyle> */}

      <Messages menu={true} chatType={chatType} />

      <Footer />
    </Stack>
  );
}

export default Conversation;
