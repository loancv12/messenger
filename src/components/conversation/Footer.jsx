import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Badge,
  Box,
  Fab,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { LinkSimple, PaperPlaneTilt } from "phosphor-react";
import React, { useEffect, useRef, useState } from "react";
import InputHidden from "./InputHidden";
import PreviewFiles from "./PreviewFiles";
// import { socket } from "../../socket";
import { add } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { msgInterval } from "../../config";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { selectChatType, showSnackbar } from "../../redux/app/appSlice";
import { chatTypes } from "../../redux/config";
import { selectCurrCvs } from "../../redux/conversation/conversationSlice";
import { uploadFile } from "../../redux/message/messageApi";
import {
  clearReplyMessage,
  handleNewMessages,
  selectLastMsgCreatedTime,
  selectReplyMsg,
} from "../../redux/message/messageSlice";
import instance from "../../socket";
import AddSticker from "./AddSticker";
import ChatInput from "./ChatInput";
import HandleCamera from "./HandleCamera";

const Actions = [
  {
    color: "#4da5fe",
    icon: InputHidden,
    title: "Doc/Photo/Video",
  },
  {
    color: "#1b8cfe",
    icon: AddSticker,
    y: 172,
    title: "Stickers",
  },
  {
    color: "#0172e4",
    icon: HandleCamera,
    y: 242,
    title: "Image",
  },
];

const makeFormData = ({
  conversationId,
  chatType,
  isReply,
  replyMsgId,
  from,
  to,
  files,
}) => {
  let formData = new FormData();
  formData.append("conversationId", conversationId);
  formData.append("chatType", chatType);
  formData.append("isReply", isReply);

  formData.append("replyMsgId", replyMsgId);
  formData.append("from", from);
  if (chatType === chatTypes.DIRECT_CHAT) {
    formData.append("to", to);
  }
  files.forEach((file) => {
    formData.append("message-files", file);
  });

  return formData;
};

function Footer() {
  const theme = useTheme();
  const { userId } = useAuth();
  const { callAction, isLoading, isError, error } = useAxiosPrivate();

  const [openActions, setOpenActions] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [files, setFiles] = useState([]);
  const [variant, setVariant] = useState("determinate");

  const textRef = useRef(null);

  const chatType = useSelector(selectChatType);
  const currentCvs = useSelector((state) => selectCurrCvs(state, chatType));
  const lastMsgCreatedTime = useSelector(selectLastMsgCreatedTime);
  const replyMsg = useSelector(selectReplyMsg);
  const dispatch = useDispatch();

  const socket = instance.getSocket();

  const handleSelectEmojis = (emojis) => {
    textRef.current.innerHTML += emojis.native;
  };

  const handleDelete = (item) => {
    const otherFiles = Array.from(files).filter((file) => file !== item.file);
    setFiles(otherFiles);
  };

  const onSuccess = (res) => {
    setFiles([]);
    setVariant("determinate");
    setOpenActions((prev) => !prev);
  };
  const onFailure = (err) => {
    console.log("upload file err", err, files);

    dispatch(
      showSnackbar({
        severity: "error",
        message: err?.response?.data ?? "Something wrong",
      })
    );
    setVariant("determinate");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const textMsg = textRef.current.textContent.trim();
    const isStartMsg =
      add(lastMsgCreatedTime, { minutes: msgInterval }) < new Date();

    if (textMsg) {
      const newMsg = {
        to: currentCvs?.userId,
        from: userId,
        isReply: !!replyMsg,
        replyMsgId: replyMsg?.id,
        isStartMsg,
        text: textMsg,
        conversationId: currentCvs.id,
        type: "text",
      };

      // optimictic update
      const tempId = uuidv4();
      const createdAt = new Date().toISOString();
      const updatedAt = createdAt;
      dispatch(
        handleNewMessages({
          chatType,
          messages: [
            {
              ...newMsg,
              id: tempId,
              readUserIds: [],
              createdAt,
              updatedAt,
              sentSuccess: "unset",
            },
          ],
          conversationId: currentCvs.id,
        })
      );

      // real update
      socket.emit("text_message", {
        type: chatType,
        newMsg,
        tempId,
      });
    }
    if (!!replyMsg?.id) {
      dispatch(clearReplyMessage());
    }

    // send by http
    if (files.length) {
      const formData = makeFormData({
        conversationId: currentCvs?.id,
        chatType,
        isReply: !!replyMsg,
        replyMsgId: replyMsg?.id ? replyMsg?.id : "",
        isStartMsg,
        from: userId,
        to: currentCvs?.userId,
        files,
      });
      console.log(
        "files at submit",
        files,
        ...formData,
        formData.get("message-files")
      );
      setVariant("indeterminate");
      await callAction(uploadFile(formData, onSuccess, onFailure));
      // optimitic update
    }

    textRef.current.innerHTML = "";
    textRef.current.focus();
  };

  useEffect(() => {
    if (!!replyMsg?.id) {
      textRef.current.focus();
    }
  }, [replyMsg]);

  return (
    <Box
      component={"form"}
      onSubmit={handleSubmit}
      p={2}
      sx={{
        width: "100%",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8F8F8"
            : theme.palette.background.paper,
        boxShadow: "0 0 2px rgba(0,0,0,.25)",
      }}
    >
      <Stack
        direction="row"
        sx={{ width: "100%", position: "relative" }}
        alignItems={"flex-end"}
        spacing={2}
      >
        {/* File Input */}
        <Stack sx={{}}>
          <Stack
            sx={[
              {
                display: "inline",
                backgroundColor: "red",
              },
              !openActions && {
                clip: "rect(0 0 0 0)",
                clipPath: "inset(50%)",
                height: 1,
                overflow: "hidden",
                position: "absolute",
                bottom: 0,
                left: 0,
                whiteSpace: "nowrap",
                width: 1,
              },
            ]}
          >
            {Actions.map((el, i) => {
              const Comp = el.icon;
              return (
                <Tooltip key={i} title={el.title} placement="right">
                  <Fab
                    component={"div"}
                    sx={{
                      position: "absolute",
                      top: "0",
                      transform: `translateY(calc(-100% - ${
                        16 * (i + 1) + 56 * i
                      }px))`,
                      backgroundColor: el.color,
                    }}
                  >
                    <Comp {...{ setFiles, name: "file" }} />
                  </Fab>
                </Tooltip>
              );
            })}
          </Stack>

          <IconButton
            sx={{ backgroundColor: "rgba(145, 158, 171, 0.12);" }}
            onClick={(e) => setOpenActions((prev) => !prev)}
          >
            <LinkSimple />
          </IconButton>
        </Stack>

        {/* Preview */}
        {files.length ? (
          <PreviewFiles
            variant={variant}
            files={files}
            handleDelete={handleDelete}
          />
        ) : null}

        {/* Reply info */}
        {!!replyMsg ? (
          <Stack
            sx={{
              position: "absolute",
              bottom: "calc(100% + 18px)",
              left: "0",
              right: "16px",
              backgroundColor:
                replyMsg?.from !== userId
                  ? theme.palette.background.default
                  : theme.palette.primary.main,
              padding: "8px",
              borderRadius: "4px",
              zIndex: 1,
            }}
            alignItems={"flex-start"}
          >
            <Typography variant="subtitle2">{`You are reply to ${
              replyMsg?.from !== userId ? currentCvs.name : "yourself"
            }`}</Typography>
            <Typography variant="subtitle1">{replyMsg?.text}</Typography>
            <Badge
              sx={{
                position: "absolute",
                right: "10px",
                top: "10px",
                cursor: "Pointer",
              }}
              color="primary"
              onClick={() => dispatch(clearReplyMessage())}
              badgeContent={"X"}
            ></Badge>
          </Stack>
        ) : null}

        {/* ChatInput */}
        <Stack sx={{ width: "100%" }}>
          <Box
            sx={{
              display: openPicker ? "inline" : "none",
              zIndex: 10,
              position: "fixed",
              bottom: 81,
              right: 100,
            }}
          >
            <Picker
              data={data}
              theme={theme.palette.mode}
              onEmojiSelect={handleSelectEmojis}
              onClickOutside={(e) => {
                if (openPicker === true) {
                  setOpenPicker(false);
                }
              }}
            />
          </Box>
          <ChatInput setOpenPicker={setOpenPicker} textRef={textRef} />
        </Stack>

        {/* Submit btn */}
        <Box
          sx={{
            height: 48,
            width: 48,
            borderRadius: 1.5,
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <Stack
            sx={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton type="submit">
              <PaperPlaneTilt color="#fff" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}

export default Footer;
