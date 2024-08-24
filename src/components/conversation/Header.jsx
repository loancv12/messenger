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
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { generalPath, path, specificPath } from "../../routes/paths";

function Header({ chatType }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentCvs = useSelector(selectCurrCvs);

  const handleCallVideo = () => {
    const roomId = uuidv4();
    navigate(path(generalPath.call, roomId, "/", specificPath.callRoom), {
      state: {
        prevPath: location.pathname,
      },
    });
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
                      key={userId}
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
    </>
  );
}

export default Header;
