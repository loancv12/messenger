import { Stack, useTheme } from "@mui/material";
import { memo, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  selectCvssDefinedChatType,
  setCurrentCvsId,
} from "../../redux/conversation/conversationSlice";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";

const Conversation = memo(({ chatType }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { cvsId } = useParams();
  const cvss = useSelector((state) =>
    selectCvssDefinedChatType(state, chatType)
  );

  const [isValidCvsId, setIsValidCvsId] = useState(false);

  useLayoutEffect(() => {
    const isValidCvsId = cvss.find((cvs) => cvs.id === cvsId);
    setIsValidCvsId(isValidCvsId);

    if (isValidCvsId) {
      dispatch(setCurrentCvsId({ type: chatType, conversationId: cvsId }));
    }
  }, [cvsId, cvss]);

  if (!isValidCvsId) return;

  return (
    <Stack
      sx={{
        height: "100vh",
        width: "auto",
        position: "relative",
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.background.paper
            : theme.palette.action.focus,
      }}
    >
      <Header chatType={chatType} />
      <Messages menu={isValidCvsId} chatType={chatType} />
      <Footer />
    </Stack>
  );
});

export default Conversation;
