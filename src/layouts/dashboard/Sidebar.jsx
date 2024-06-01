import React from "react";
import {
  Box,
  Divider,
  Stack,
  IconButton,
  CardMedia,
  useTheme,
  Avatar,
  Card,
  Menu,
  Drawer,
  Button,
  MenuItem,
  Typography,
  styled,
  Link,
  Badge,
} from "@mui/material";
import {
  ChatCircleDots,
  DotsThreeCircle,
  SignOut,
  Gear,
  User,
  Users,
} from "phosphor-react";
import { useState } from "react";
import Logo from "../../assets/Images/logo.ico";
import { faker } from "@faker-js/faker";
import useSettings from "../../hooks/useSettings";
import AntSwitch from "../../components/AntSwitch";
import { NavLink, useNavigate } from "react-router-dom";
import { logOutUser } from "../../redux/auth/authApi";
import { useDispatch, useSelector } from "react-redux";
import { selectNotice, updateNotice } from "../../redux/app/appSlice";
import { chatTypes, noticeTypes } from "../../redux/config";
import useLocales from "../../hooks/useLocales";
import toCamelCase from "../../utils/toCamelCase";

const Profile_Menu = [
  {
    title: "Profile",
    path: "/profile",
    icon: <User />,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: <Gear />,
  },
  {
    title: "Sign Out",
    path: "",
    icon: <SignOut />,
  },
];

const Nav_Buttons = [
  {
    index: 0,
    title: "Direct chats",
    path: "/app",
    icon: <ChatCircleDots />,
    noticeType: noticeTypes.NEW_MSG_DIRECT,
  },
  {
    index: 1,
    title: "Groups",
    path: "/group",
    icon: <Users />,
    noticeType: noticeTypes.NEW_MSG_GROUP,
  },
];

const Sidebar = () => {
  const theme = useTheme();
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { onToggleMode } = useSettings();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const open = Boolean(anchorEl);

  const dispatch = useDispatch();

  const noticeNewMsgDirect = useSelector((state) =>
    selectNotice(state, noticeTypes[chatTypes.DIRECT_CHAT])
  );
  const noticeNewMsgGroup = useSelector((state) =>
    selectNotice(state, noticeTypes[chatTypes.GROUP_CHAT])
  );
  const notices = [noticeNewMsgDirect, noticeNewMsgGroup];

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const email = useSelector((state) => state.auth.email);
  console.log("email", email);

  const handleMenu = (el, i) => {
    if (i === Profile_Menu.length - 1) {
      dispatch(logOutUser({ email }));
    } else {
      navigate(el.path);
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (newOpen) => () => {
    setOpenDrawer(newOpen);
  };

  const isShowNotice = (el) => {
    const notice = notices.find((notice) => notice.type === el.noticeType);
    if (notice) {
      return notice.show;
    } else return false;
  };

  const hideNotice = (el) => {
    if (isShowNotice(el)) {
      dispatch(updateNotice({ type: el.noticeType, show: false }));
    }
  };
  return (
    <>
      {/* <=tablet */}
      <IconButton
        sx={{
          display: { md: "none" },
          position: "fixed",
          zIndex: 1,
          top: "20px",
          left: "20px",
          padding: 0,
        }}
        onClick={toggleDrawer(true)}
      >
        <DotsThreeCircle size={46} />
      </IconButton>
      <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
        <Stack
          sx={{ width: 300 }}
          alignItems="center"
          spacing={3}
          padding={4}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <Stack
            direction="row"
            width={"100%"}
            alignItems={"center"}
            justifyContent={"space-between"}
            spacing={2}
          >
            <Avatar src={faker.image.avatar()} />

            <Typography variant="body1" fontSize={"1.5rem"}>
              {email?.split("@")[0]}
            </Typography>
            <AntSwitch
              defaultChecked
              onChange={() => {
                onToggleMode();
              }}
            />
          </Stack>
          {Nav_Buttons.map((el, i) => (
            <Stack
              key={i}
              direction={"row"}
              alignItems={"center"}
              justifyContent={"flex-start"}
              spacing={2}
              sx={{
                width: "100%",
                fontSize: "1rem",
              }}
              onClick={() => {
                navigate(el.path);
              }}
            >
              <IconButton
                sx={{
                  fontSize: "1.25rem",
                  backgroundColor: theme.palette.grey[200],
                }}
              >
                {el.icon}
              </IconButton>
              <Typography variant="body1">{el.title}</Typography>
            </Stack>
          ))}
          <Divider sx={{ width: "100%" }} />
          {Profile_Menu.map((el, i) => {
            return (
              <Stack
                onClick={() => handleMenu(el, i)}
                key={i}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"flex-start"}
                spacing={2}
                sx={{
                  width: "100%",
                  fontSize: "1rem",
                }}
              >
                <IconButton
                  sx={{
                    fontSize: "1.25rem",
                    backgroundColor: theme.palette.grey[200],
                  }}
                >
                  {el.icon}
                </IconButton>
                <Typography variant="body1">
                  {/* {el.title} */}
                  {translate(
                    `sidebarComp.profileMenu.${toCamelCase(el.title)}`
                  )}
                </Typography>
              </Stack>
            );
          })}
          <Divider sx={{ width: "100%" }} />
        </Stack>
      </Drawer>
      {/* desktop */}
      <Box
        p={2}
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: "0 0 2px rgba(0,0,0,.25)",
          height: "100vh",
          minWidth: 100,

          display: { xs: "none", md: "block" },
        }}
      >
        <Stack
          spacing={3}
          direction="column"
          sx={{ height: "100%" }}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack alignItems={"center"} spacing={4} sx={{}}>
            <Box
              sx={{
                backgroundColor: theme.palette.primary.main,
                maxHeight: 64,
                maxWidth: 64,
                borderRadius: 2.5,
              }}
            >
              <Card
                sx={{
                  height: 64,
                  backgroundColor: "transparent",
                  boxShadow: "none",
                }}
              >
                <CardMedia component="img" alt="green iguana" image={Logo} />
              </Card>
            </Box>
            {/* path */}
            <Stack
              sx={{ width: "max-content" }}
              direction="column"
              alignItems="center"
              spacing={3}
            >
              {Nav_Buttons.map((el, i) => {
                return (
                  <NavLink key={i} to={el.path}>
                    {({ isActive, isPending, isTransitioning }) => (
                      <Box
                        sx={{
                          backgroundColor: isActive
                            ? theme.palette.primary.main
                            : "transparent",
                          borderRadius: 1.5,
                        }}
                      >
                        <IconButton
                          sx={{
                            width: "max-content",
                            color: isActive
                              ? "#fff"
                              : theme.palette.mode === "light"
                              ? "#000"
                              : theme.palette.text.primary,
                          }}
                          onClick={() => hideNotice(el)}
                        >
                          <Badge
                            variant="dot"
                            color="primary"
                            invisible={!isShowNotice(el)}
                          >
                            {el.icon}
                          </Badge>
                        </IconButton>
                      </Box>
                    )}
                  </NavLink>
                );
              })}
              <Divider sx={{ width: "48px" }} />
            </Stack>
          </Stack>
          <Stack
            alignItems={"center"}
            direction={"column"}
            gap={4}
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <AntSwitch
              defaultChecked
              onChange={() => {
                onToggleMode();
              }}
            />
            <Typography variant="subtitle2">{email?.split("@")[0]}</Typography>
            <Avatar
              onClick={handleClick}
              id="basic-button"
              aria-controls={open ? "profile-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              src={faker.image.avatar()}
            />
            <Menu
              id="profile-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <Stack spacing={1} px={1}>
                {Profile_Menu.map((el, i) => {
                  return (
                    <MenuItem onClick={() => handleMenu(el, i)} key={i}>
                      <Stack
                        sx={{ width: 100 }}
                        direction="row"
                        alignItems={"center"}
                        justifyContent="space-between"
                      >
                        <span>
                          {/* {el.title} */}
                          {translate(
                            `sidebarComp.profileMenu.${toCamelCase(el.title)}`
                          )}
                        </span>
                        {el.icon}
                      </Stack>
                    </MenuItem>
                  );
                })}
              </Stack>
            </Menu>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default Sidebar;
