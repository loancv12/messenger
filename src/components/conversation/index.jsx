import Footer from "./Footer";
import Header from "./Header";
import { Stack, useTheme, Typography, Button } from "@mui/material";
import Messages from "./Messages";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
  selectCvssDefinedChatType,
  setCurrentCvsId,
} from "../../redux/conversation/conversationSlice";
import { useDispatch, useSelector } from "react-redux";

function Conversation() {
  const { chatType } = useOutletContext();

  const dispatch = useDispatch();
  const { cvsId } = useParams();
  const cvss = useSelector((state) =>
    selectCvssDefinedChatType(state, chatType)
  );

  const [isValidCvsId, setIsValidCvsId] = useState(false);

  useLayoutEffect(() => {
    // check cvsId valid
    const isValidCvsId = cvss.find((cvs) => cvs.id === cvsId);
    setIsValidCvsId(isValidCvsId);

    // update current cvsId
    if (isValidCvsId) {
      dispatch(setCurrentCvsId({ type: chatType, conversationId: cvsId }));
    }
  }, [cvsId, cvss]);

  let content;
  if (!isValidCvsId) {
    content = (
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        sx={{
          height: "100vh",
          width: "auto",
        }}
      >
        <Typography variant="body1">This conversation is not found</Typography>
      </Stack>
    );
  } else {
    content = (
      <Stack
        sx={{
          height: "100vh",
          width: "auto",
          position: "relative",
        }}
      >
        <Header chatType={chatType} />
        <Messages menu={isValidCvsId} chatType={chatType} />
        <Footer />
      </Stack>
    );
  }
  return content;
}

export default Conversation;
