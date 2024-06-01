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
import { useDispatch, useSelector } from "react-redux";
import { selectChatType, updateShowCvsComp } from "../../redux/app/appSlice";
import { selectCurrCvs } from "../../redux/conversation/conversationSlice";
import NoChatSVG from "../../assets/Illistration/NoChat";
import useLocales from "../../hooks/useLocales";
import toCamelCase from "../../utils/toCamelCase";

function Conversation({ handleBack }) {
  const dispatch = useDispatch();
  const chatType = useSelector(selectChatType);
  const currentCvs = useSelector((state) => selectCurrCvs(state, chatType));

  const { translate } = useLocales();

  const theme = useTheme();
  return (
    <>
      {!currentCvs ? (
        <Stack
          spacing={2}
          sx={{ height: "100%", width: "100%" }}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <NoChatSVG />
          <Button
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
            }}
            endIcon={<ChatsCircle size={32} />}
            onClick={() => dispatch(updateShowCvsComp({ open: false }))}
          >
            {translate(`conversation.${toCamelCase("Start Chat")}`)}
          </Button>
          <Typography
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
            variant="subtitle2"
          >
            {translate(`conversation.${toCamelCase("Start Chat")}`)}
          </Typography>
        </Stack>
      ) : (
        <Stack
          sx={{
            // height: "100%",
            // maxHeight: "100vh",
            height: "100vh",
            width: "auto",
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
      )}
    </>
  );
}

export default Conversation;
