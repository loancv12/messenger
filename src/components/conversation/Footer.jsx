import {
  Stack,
  Box,
  TextField,
  styled,
  InputAdornment,
  useTheme,
  IconButton,
  Fab,
  Tooltip,
  typographyClasses,
  Button,
  Input,
  Typography,
  Badge,
} from "@mui/material";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Image,
  Sticker,
  Camera,
  File,
  User,
} from "phosphor-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import InputHidden from "../InputHidden";
import PreviewFiles from "./PreviewFiles";
// import { socket } from "../../socket";
import { useDispatch, useSelector } from "react-redux";
import {
  clearReplyMessage,
  selectReplyMsg,
} from "../../redux/message/messageSlice";
import { uploadFile } from "../../redux/message/messageApi";
import { chatTypes } from "../../redux/config";
import { allowFiles, maxSize } from "../../config";
import ChatInput from "./ChatInput";
import { selectChatType } from "../../redux/app/appSlice";
import { selectCurrCvs } from "../../redux/conversation/conversationSlice";
import { SocketContext } from "../../contexts/SocketProvider";
import useAuth from "../../hooks/useAuth";

function Footer() {
  const theme = useTheme();
  const { userId } = useAuth();

  const [openActions, setOpenActions] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [files, setFiles] = useState([]);
  const [variant, setVariant] = useState("determinate");

  const textRef = useRef(null);

  const chatType = useSelector(selectChatType);
  const currentCvs = useSelector((state) => selectCurrCvs(state, chatType));
  const replyMsg = useSelector(selectReplyMsg);
  const dispatch = useDispatch();

  const socket = useContext(SocketContext);

  const Actions = [
    {
      color: "#4da5fe",
      icon: (
        <InputHidden
          icon={<File size={24} />}
          {...{ setFiles, name: "file", allowFiles, maxSize }}
        />
      ),
      title: "Doc/Photo/Video",
    },
    {
      color: "#1b8cfe",
      icon: <Sticker size={24} />,
      y: 172,
      title: "Stickers",
    },
    {
      color: "#0172e4",
      icon: <Camera size={24} />,
      y: 242,
      title: "Image",
    },

    {
      color: "#013f7f",
      icon: <User size={24} />,
      y: 312,
      title: "Contact",
    },
  ];

  const handleSelectEmojis = (emojis) => {
    textRef.current.value += emojis.native;
  };

  const handleDelete = (item) => {
    console.log("delete", item.file);
    const otherFiles = Array.from(files).filter((file) => file !== item.file);
    setFiles(otherFiles);
  };

  const onSuccess = (res) => {
    console.log(res);
    setFiles([]);
    setVariant("determinate");
  };
  const onFailure = (err) => {
    setVariant("determinate");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const textMsg = textRef.current.value.trim();

    if (textMsg) {
      console.log("socket", socket);
      socket.emit("text_message", {
        type: chatType,
        newMsg: {
          to: currentCvs?.userId,
          from: userId,
          isReply: !!replyMsg,
          replyMsgId: replyMsg?.id,
          text: textMsg,
          conversationId: currentCvs.id,
          type: "text",
        },
      });
      textRef.current.value = "";
    }
    if (!!replyMsg?.id) {
      dispatch(clearReplyMessage());
    }

    // send by http
    if (files.length) {
      let formData = new FormData();
      formData.append("conversationId", currentCvs?.id);
      formData.append("chatType", chatType);
      formData.append("isReply", !!replyMsg);
      // 'cause formDate append convert value to string, so we must hanlde it in there
      // NOTE for BE
      formData.append("replyMsgId", replyMsg?.id ? replyMsg?.id : "");
      formData.append("from", userId);
      if (chatType === chatTypes.DIRECT_CHAT) {
        formData.append("to", currentCvs?.userId);
      }
      files.forEach((file) => {
        formData.append("message-files", file);
      });
      setVariant("indeterminate");
      dispatch(uploadFile(formData, onSuccess, onFailure));
    }

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
                    {el.icon}
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
