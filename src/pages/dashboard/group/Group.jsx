import {
  Badge,
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import SearchIconWrapper from "../../../components/search/SearchIconWrapper";
import Search from "../../../components/search/Search";
import StyledInputBase from "../../../components/search/StyledInputBase";
import { MagnifyingGlass, Plus, UserList, UsersThree } from "phosphor-react";
import ChatElement from "../../../components/chat/ChatElement";
import LoadingScreen from "../../../components/common/LoadingScreen";

import { CreateGroup } from "../../../components/group";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChatType,
  selectNotice,
  setChatType,
  updateNotice,
} from "../../../redux/app/appSlice";
import { chatTypes, noticeTypes } from "../../../redux/config";
import {
  selectCvssDefinedChatType,
  setConversations,
} from "../../../redux/conversation/conversationSlice";
import JoinGroupReqs from "../../../components/group/JoinGroupReqs";
import toCamelCase from "../../../utils/toCamelCase";
import useLocales from "../../../hooks/useLocales";
import { fetchConversations } from "../../../redux/conversation/conversationApi";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ChatSkeleton from "../../../components/chat/ChatSkeleton";
import { debounce } from "../../../utils/debounce";
import useDebounceFilter from "../../../hooks/useDebounceFilter";

const Group = () => {
  const theme = useTheme();
  const { translate } = useLocales();

  const isFirstMount = useRef(true);
  const { callAction, isLoading, isError } = useAxiosPrivate();

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const conversations = useSelector((state) =>
    selectCvssDefinedChatType(state, chatTypes.GROUP_CHAT)
  );

  const { query, setFilteredList, handleChange, filteredList } =
    useDebounceFilter(conversations, "msg");

  const dispatch = useDispatch();
  const joinGroupReqNotice = useSelector((state) =>
    selectNotice(state, noticeTypes.JOIN_GROUP_REQ)
  );

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpenDialog = () => {
    setOpenDialog(true);
    dispatch(updateNotice({ type: noticeTypes.JOIN_GROUP_REQ, show: false }));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    dispatch(setChatType({ chatType: chatTypes.GROUP_CHAT }));

    const fetchCvs = async () => {
      await callAction(fetchConversations({ type: chatTypes.GROUP_CHAT }));
    };
    if (!isFirstMount.current || process.env.NODE_ENV !== "development") {
      if (!conversations.length) {
        fetchCvs();
      }
    }

    return () => {
      isFirstMount.current = false;
    };
  }, []);

  useEffect(() => {
    setFilteredList(conversations);
  }, [conversations]);

  let cvsContent;
  if (isLoading) {
    cvsContent = [...Array(6).keys()].map((_, i) => <ChatSkeleton key={i} />);
  } else if (isError) {
    cvsContent = <Typography>Something wrong</Typography>;
  } else {
    cvsContent = filteredList.map((el, i) => {
      return <ChatElement key={el.id} {...el} />;
    });
  }

  return (
    <>
      <Stack
        direction={"row"}
        sx={{
          width: "100%",
        }}
      >
        {/* Chats */}
        <Box
          sx={{
            height: "100vh",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8F8F8"
                : theme.palette.background.default,
            boxShadow: "0 0 2px rgba(0,0,0,.25)",
          }}
        >
          <Stack spacing={2} p={3} sx={{ maxHeight: "100vh" }}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={2}
              justifyContent={{ xs: "flex-end", md: "space-between" }}
              sx={{
                minHeight: "40px",
              }}
            >
              <Typography variant="h5">
                {translate(`groupCvs.${toCamelCase("Groups")}`)}
              </Typography>
              <IconButton
                sx={{ padding: 0 }}
                onClick={() => {
                  handleOpenDialog();
                }}
              >
                <Badge
                  variant="dot"
                  color="primary"
                  invisible={!joinGroupReqNotice?.show}
                >
                  <UsersThree size={32} />
                </Badge>
              </IconButton>
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#704324" />
                </SearchIconWrapper>
                <StyledInputBase
                  value={query}
                  onChange={handleChange}
                  placeholder="Search"
                />
              </Search>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Typography variant="subtitle2" component={Link}>
                {translate(`groupCvs.${toCamelCase("Create New Group")}`)}
              </Typography>
              <IconButton
                onClick={() => {
                  setOpen(true);
                }}
              >
                <Plus
                  style={{ color: (theme) => theme.palette.primary.main }}
                />
              </IconButton>
            </Stack>
            <Divider />
            {/* msg list */}
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
                  {translate(`groupCvs.${toCamelCase("All group")}`)}
                </Typography>
                {cvsContent}
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Stack>
      {open && <CreateGroup open={open} handleClose={handleClose} />}
      {openDialog && (
        <JoinGroupReqs open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Group;
