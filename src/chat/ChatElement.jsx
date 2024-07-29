import { Avatar, Badge, Box, Stack, Typography, useTheme } from "@mui/material";
import StyledBadge from "../components/StyledBadge";
import { faker } from "@faker-js/faker";
import { useDispatch, useSelector } from "react-redux";
import { selectChatType, updateShowCvsComp } from "../redux/app/appSlice";
import {
  setCurrentCvs,
  updateConversation,
} from "../redux/conversation/conversationSlice";
import { memo } from "react";
import { fRelativeDate } from "../utils/formatTime";
import { useNavigate } from "react-router-dom";

const ChatElement = memo(
  ({ id, name, img, msg, updatedAt, online, unread }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const chatType = useSelector(selectChatType);
    const dispatch = useDispatch();

    const handleClick = async () => {
      dispatch(updateShowCvsComp({ open: true }));

      dispatch(setCurrentCvs({ type: chatType, conversationId: id }));
      dispatch(
        updateConversation({
          type: chatType,
          conversationId: id,
          updatedContent: { unread: 0 },
        })
      );
      navigate(id);
    };

    return (
      <Box
        onClick={handleClick}
        sx={{
          width: "100%",
          borderRadius: 1,
          backgroundColor:
            theme.palette.mode === "light"
              ? "#fff"
              : theme.palette.background.default,
          "&:hover": {
            cursor: "pointer",
          },
        }}
        p={1}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction={"row"} spacing={2}>
            {online ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar alt="Remy Sharp" src={faker.image.avatar()} />
              </StyledBadge>
            ) : (
              <Avatar alt="Remy Sharp" src={faker.image.avatar()} />
            )}
            <Stack spacing={0.3}>
              <Typography variant="subtitle2">{name}</Typography>
              <Typography
                variant="caption"
                sx={{
                  width: "150px",
                  overflow: "hidden",
                  display: "-webkit-box",
                  // WebkitAppearance: "slider-vertical",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {msg}
              </Typography>
            </Stack>
          </Stack>
          <Stack spacing={2} alignItems={"center"} sx={{ minWidth: "24px" }}>
            <Typography sx={{ fontWeight: 600 }} variant="caption">
              {fRelativeDate(updatedAt)}
            </Typography>
            <Badge
              color="primary"
              badgeContent={unread ? unread : "0"}
              sx={{
                width: "20px",
                height: "20px",
                "& span": {
                  transform: "none",
                },
              }}
            ></Badge>
          </Stack>
        </Stack>
      </Box>
    );
  }
);

export default ChatElement;
