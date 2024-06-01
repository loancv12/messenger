import {
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DotsThreeVertical, DownloadSimple } from "phosphor-react";
import React, { useState, useRef, memo, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fDateFromNow } from "../../utils/formatTime";
import {
  setReplyMessage,
  reactMessage,
  forwardMessage,
  starMessage,
  reportMessage,
  deleteMessage,
} from "../../redux/message/messageSlice";
import { SocketContext } from "../../contexts/SocketProvider";

// msg types component
const DocMsg = memo(({ el, menu }) => {
  const theme = useTheme();
  let time = "";
  if (el?.isStartMsg) {
    time = fDateFromNow(el.createdAt);
  }
  const userId = localStorage.getItem("userId");
  const incoming = userId === el.from.toString() ? false : true;
  return (
    <Box>
      {el?.isStartMsg ? <Timeline time={time} /> : null}
      <Stack
        data-ref={el.id}
        direction="row"
        justifyContent={incoming ? "start" : "end"}
        sx={{ position: "relative" }}
      >
        {el?.isReply ? <ReplyMsg el={el} /> : null}
        {el?.isDeleted ? (
          <DeletedMsg el={el} />
        ) : (
          <Box
            sx={{
              backgroundColor: incoming
                ? theme.palette.background.default
                : theme.palette.primary.main,
              borderRadius: 1.5,
              width: "max-content",
            }}
            p={1}
          >
            <Stack spacing={2}>
              <Stack
                p={1}
                direction="row"
                spacing={3}
                alignItems={"center"}
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 1.5,
                }}
              >
                <Image size={48} />
                <Typography variant="caption">{el.text}</Typography>
                <IconButton>
                  <DownloadSimple />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        )}
        {menu && <MessageOptions msg={el} />}
      </Stack>
    </Box>
  );
});

const LinkMsg = memo(({ el, menu }) => {
  const theme = useTheme();
  let time = "";
  if (el?.isStartMsg) {
    time = fDateFromNow(el.createdAt);
  }
  const userId = localStorage.getItem("userId");
  const incoming = userId === el.from.toString() ? false : true;
  return (
    <Box>
      {el?.isStartMsg ? <Timeline time={time} /> : null}
      <Stack
        data-ref={el.id}
        direction="row"
        justifyContent={incoming ? "start" : "end"}
        sx={{ position: "relative" }}
      >
        {el?.isReply ? <ReplyMsg el={el} /> : null}
        {el?.isDeleted ? (
          <DeletedMsg el={el} />
        ) : (
          <Box
            sx={{
              backgroundColor: incoming
                ? theme.palette.background.default
                : theme.palette.primary.main,
              borderRadius: 1.5,
              width: "max-content",
            }}
            p={1}
          >
            <Stack
              p={1}
              spacing={2}
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: 1.5,
              }}
            >
              <img
                src={el?.file}
                alt={el.text}
                style={{
                  maxHeight: 210,
                  borderRadius: "10px",
                }}
              />
              <Typography
                variant="body2"
                to="//https://www.youtobe.com"
                color={incoming ? theme.palette.text : "#fff"}
                component={Link}
              >
                {el.text}
              </Typography>
            </Stack>
          </Box>
        )}
        {menu && <MessageOptions msg={el} />}
      </Stack>
    </Box>
  );
});

const MediaMsg = memo(({ el, menu }) => {
  const theme = useTheme();
  let time = "";
  if (el?.isStartMsg) {
    time = fDateFromNow(el.createdAt);
  }
  const userId = localStorage.getItem("userId");
  const incoming = userId === el.from.toString() ? false : true;
  return (
    <Box>
      {el?.isStartMsg ? <Timeline time={time} /> : null}
      <Stack
        data-ref={el.id}
        direction="row"
        justifyContent={incoming ? "start" : "end"}
        sx={{ position: "relative" }}
      >
        {el?.isReply ? <ReplyMsg el={el} /> : null}
        {el?.isDeleted ? (
          <DeletedMsg el={el} />
        ) : (
          <Box
            sx={{
              backgroundColor: incoming
                ? theme.palette.background.default
                : theme.palette.primary.main,
              borderRadius: 1.5,
              width: "max-content",
              maxWidth: "70%",
            }}
            p={1}
          >
            <a href={el.file} target="_blank" rel="noopener">
              <img
                src={el.file}
                alt={el.text}
                style={{
                  display: "block",
                  width: "200px",
                  height: "200px",
                  maxHeight: 300,
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
                loading="lazy"
              />
            </a>
          </Box>
        )}
        {menu && <MessageOptions msg={el} />}
      </Stack>
    </Box>
  );
});

const TextMsg = memo(({ el, menu }) => {
  const theme = useTheme();
  let time = "";
  if (el?.isStartMsg) {
    time = fDateFromNow(el.createdAt);
  }
  const userId = localStorage.getItem("userId");
  const incoming = userId === el.from ? false : true;
  return (
    <Box>
      {el?.isStartMsg ? <Timeline time={time} /> : null}
      <Stack
        data-ref={el.id}
        direction="row"
        justifyContent={incoming ? "start" : "end"}
        sx={{ position: "relative" }}
      >
        {el?.isReply ? <ReplyMsg el={el} /> : null}
        {el?.isDeleted ? (
          <DeletedMsg el={el} />
        ) : (
          <Box
            sx={{
              backgroundColor: incoming
                ? theme.palette.background.default
                : theme.palette.primary.main,
              borderRadius: 1.5,
              width: "max-content",
              zIndex: 1,
              maxWidth: "70%",
            }}
            p={1}
          >
            <Typography
              variant="body2"
              color={incoming ? theme.palette.text : "#fff"}
            >
              {el.text}
            </Typography>
          </Box>
        )}
        {menu && <MessageOptions msg={el} />}
      </Stack>
    </Box>
  );
});

// utilities component
const Timeline = memo(({ time }) => {
  const theme = useTheme();

  return (
    <Stack direction="row" alignItems={"center"} justifyContent="space-between">
      <Divider width="46%" />
      <Typography
        variant="caption"
        sx={{
          color: theme.palette.text,
        }}
      >
        {time}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
});

const ReplyMsg = memo(({ el }) => {
  const theme = useTheme();
  const handleTrackMsg = () => {
    const targetEl = document.querySelector(`[data-ref="${replyMsg?.id}"]`);
    if (targetEl) {
      targetEl.scrollIntoView({
        behavior: "smooth",
      });
    }
  };
  const { replyMsg, from } = el;
  const userId = localStorage.getItem("userId");
  const isMyReply = userId === el.from;
  const isSelfReply = userId !== replyMsg?.from ? true : false;

  return (
    <Typography
      onClick={handleTrackMsg}
      sx={[
        {
          position: "absolute",
          top: 0,
          transform: "translateY(calc(-100% + 4px))",
          padding: "4px",
          fontSize: "0.7rem",
          backgroundColor: isSelfReply
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: "4px",
          zIndex: 0,
          //
          maxWidth: "150px",
          overflow: "hidden",
          display: "-webkit-box",
          // WebkitAppearance: "slider-vertical",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
        },
        isMyReply
          ? { right: "0" }
          : {
              left: "-10px",
            },
      ]}
      variant="body2"
      color={isSelfReply ? theme.palette.text : "#fff"}
    >
      {replyMsg?.text}
    </Typography>
  );
});

const DeletedMsg = memo(({ el }) => {
  const theme = useTheme();
  const userId = localStorage.getItem("userId");
  const incoming = userId === el.from ? false : true;
  return (
    <Stack direction="row" justifyContent={incoming ? "start" : "end"}>
      <Box
        sx={{
          border: "1px solid",
          borderColor: incoming ? theme.palette.background.default : "#fff",
          borderRadius: 1.5,
          width: "max-content",
        }}
        p={1}
      >
        <Typography variant="body2" color={theme.palette.grey[500]}>
          Message is deleted
        </Typography>
      </Box>
    </Stack>
  );
});

const Message_options = [
  {
    title: "Reply",
    onclick: setReplyMessage,
  },
  {
    title: "React to message",
    onclick: reactMessage,
  },
  {
    title: "Forward message",
    onclick: forwardMessage,
  },
  {
    title: "Star message",
    onclick: starMessage,
  },
  {
    title: "Report",
    onclick: reportMessage,
  },
  {
    title: "Delete Message",
    onclick: deleteMessage,
  },
];
const MessageOptions = memo(({ msg }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const socket = useContext(SocketContext);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMsg = ({ msg, onclick }) => {
    dispatch(onclick({ msg, socket }));
    handleClose();
  };

  return (
    <>
      <DotsThreeVertical
        size={20}
        onClick={handleClick}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} px={1}>
          {Message_options.map((el, i) => {
            return (
              <MenuItem
                onClick={() => handleMsg({ msg, onclick: el.onclick })}
                key={i}
              >
                {el.title}
              </MenuItem>
            );
          })}
        </Stack>
      </Menu>
    </>
  );
});

export { Timeline, TextMsg, MediaMsg, ReplyMsg, LinkMsg, DocMsg, DeletedMsg };
