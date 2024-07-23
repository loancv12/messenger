import {
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
  Stack,
  Typography,
  Avatar,
  Badge,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Archive,
  CircleDashed,
  MagnifyingGlass,
  UserCircle,
  UserList,
} from "phosphor-react";
import Search from "../../../components/search/Search";
import SearchIconWrapper from "../../../components/search/SearchIconWrapper";
import StyledInputBase from "../../../components/search/StyledInputBase";
import ChatElement from "../../../components/ChatElement";
import RelationShips from "../../../components/relationShips";
import LoadingScreen from "../../../components/LoadingScreen";
import { useSelector } from "react-redux";
import { dispatch } from "../../../redux/store";
import { chatTypes, noticeTypes } from "../../../redux/config";
import { selectNotice, updateNotice } from "../../../redux/app/appSlice";
import toCamelCase from "../../../utils/toCamelCase";
import useLocales from "../../../hooks/useLocales";

const Chats = memo(() => {
  const [openDialog, setOpenDialog] = useState(false);

  const friendReqNotice = useSelector((state) =>
    selectNotice(state, noticeTypes.FRIEND_REQ)
  );
  const conversations = useSelector(
    (state) => state.conversation[chatTypes.DIRECT_CHAT].conversations
  );
  const { translate } = useLocales();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const hideNotice = () => {
    if (friendReqNotice.show) {
      dispatch(updateNotice({ type: noticeTypes.FRIEND_REQ, show: false }));
    }
  };

  return (
    <>
      <Stack
        p={3}
        spacing={2}
        sx={{
          maxHeight: "100vh",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={{ xs: "flex-end", md: "space-between" }}
          sx={{ minHeight: "40px" }}
        >
          <Typography
            sx={{ display: { xs: "none", md: "block" } }}
            variant="h5"
          >
            {translate(`directCvs.${toCamelCase("Chats")}`)}
          </Typography>
          <Stack direction={"row"} spacing={2}>
            <IconButton
              sx={{ padding: 0 }}
              onClick={() => {
                handleOpenDialog();
                hideNotice();
              }}
            >
              <Badge
                variant="dot"
                color="primary"
                invisible={!friendReqNotice?.show}
              >
                <UserCircle size={32} />
              </Badge>
            </IconButton>
            <IconButton sx={{ padding: 0 }}>
              <CircleDashed size={32} />
            </IconButton>
          </Stack>
        </Stack>
        <Stack sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#704324" />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search" />
          </Search>
        </Stack>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Archive size={24} />
            <Button>{translate(`directCvs.${toCamelCase("Archive")}`)}</Button>
          </Stack>
          <Divider />
        </Stack>
        <Stack
          sx={{
            flexGrow: 1,
            overflowY: "scroll",
            overflowY: "scroll",
            /* Hide scrollbar for Chrome, Safari and Opera */
            "&::-webkit-scrollbar": {
              width: 0,
            },
            /* IE and Edge */
            scrollbarWidth: " none",
            /* Firefox */
            msOverflowStyle: "none",
            height: "100%",
          }}
        >
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Typography
              variant="subtitle2"
              sx={{
                color: "#676767",
              }}
            >
              {translate(`directCvs.${toCamelCase("All chats")}`)}
            </Typography>
            {conversations.map((el, i) => {
              return <ChatElement key={i} {...el} />;
            })}
          </Stack>
        </Stack>
      </Stack>
      {openDialog && (
        <RelationShips open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
});

export default Chats;
