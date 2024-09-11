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
  CaretLeft,
  MagnifyingGlass,
  PhoneCall,
  VideoCamera,
} from "phosphor-react";
import {
  toggleSidebar,
  selectChatType,
  updateShowCvsComp,
} from "../../redux/app/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrCvs } from "../../redux/conversation/conversationSlice";
import { chatTypes } from "../../redux/config";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { generalPath, path, specificPath } from "../../routes/paths";

function Header({ chatType }) {
  const theme = useTheme();

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

  const handleBack = () => {
    dispatch(updateShowCvsComp({ open: false }));
    navigate(generalPath[chatType]);
  };

  return (
    <>
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
                  <AvatarGroup
                    max={4}
                    sx={{ display: { xs: "none", md: "flex" } }}
                  >
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
        </Stack>
      </Box>
    </>
  );
}

export default Header;
