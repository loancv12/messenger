import {
  Box,
  Stack,
  IconButton,
  Avatar,
  Divider,
  Typography,
  useTheme,
  AvatarGroup,
} from "@mui/material";
import StyledBadge from "../common/StyledBadge";
import { faker } from "@faker-js/faker";
import {
  CaretDown,
  MagnifyingGlass,
  PhoneCall,
  VideoCamera,
} from "phosphor-react";
import { toggleSidebar, selectChatType } from "../../redux/app/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrCvs } from "../../redux/conversation/conversationSlice";
import { chatTypes } from "../../redux/config";
import { Navigate, useNavigate } from "react-router-dom";
import CallDialog from "./CallDialog";
import { useState } from "react";

function Header() {
  const dispatch = useDispatch();
  const chatType = useSelector(selectChatType);
  const currentCvs = useSelector((state) => selectCurrCvs(state, chatType));

  const [open, setOpen] = useState(false);

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleCallVideo = () => {
    setOpen(true);
  };

  return (
    <>
      <Stack
        alignItems={"center"}
        direction={"row"}
        justifyContent={"space-between"}
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        <Stack
          onClick={() => {
            dispatch(toggleSidebar());
          }}
          direction={"row"}
          spacing={2}
        >
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            {chatType === chatTypes.GROUP_CHAT ? (
              <AvatarGroup max={4}>
                {currentCvs?.userIds?.map((userId, index) => {
                  return (
                    <Avatar
                      key={index}
                      alt={faker.person.fullName()}
                      src={faker.image.avatar()}
                    />
                  );
                })}
              </AvatarGroup>
            ) : currentCvs?.online ? (
              <StyledBadge
                overlap="circular"
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                variant="dot"
              >
                <Avatar
                  alt={faker.person.fullName()}
                  src={faker.image.avatar()}
                />
              </StyledBadge>
            ) : (
              <Avatar
                alt={faker.person.fullName()}
                src={faker.image.avatar()}
              />
            )}
            <Typography variant="subtitle2">{currentCvs?.name}</Typography>
          </Stack>
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={{ xs: 1, md: 2 }}
        >
          <IconButton onClick={handleCallVideo}>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <PhoneCall />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: "rgba(0,0,0,.25)",
            }}
          />
          <IconButton>
            <CaretDown />
          </IconButton>
        </Stack>
      </Stack>
      {open ? <CallDialog open={open} onClose={handleClose} /> : null}
    </>
  );
}

export default Header;
