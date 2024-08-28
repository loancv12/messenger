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
  Skeleton,
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
import ChatElement from "../../../components/chat/ChatElement";
import RelationShips from "../../../components/relationShips";
import LoadingScreen from "../../../components/common/LoadingScreen";
import { useSelector } from "react-redux";
import { dispatch } from "../../../redux/store";
import { chatTypes, noticeTypes } from "../../../redux/config";
import {
  selectNotice,
  setChatType,
  updateNotice,
} from "../../../redux/app/appSlice";
import toCamelCase from "../../../utils/toCamelCase";
import useLocales from "../../../hooks/useLocales";
import { fetchConversations } from "../../../redux/conversation/conversationApi";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import ChatSkeleton from "../../../components/chat/ChatSkeleton";
import { selectCvssDefinedChatType } from "../../../redux/conversation/conversationSlice";
import useDebounceFilter from "../../../hooks/useDebounceFilter";

const Chats = memo(() => {
  const [openDialog, setOpenDialog] = useState(false);
  const isFirstMount = useRef(true);
  const { callAction, isLoading, isError } = useAxiosPrivate();

  const friendReqNotice = useSelector((state) =>
    selectNotice(state, noticeTypes.FRIEND_REQ)
  );
  const conversations = useSelector((state) =>
    selectCvssDefinedChatType(state, chatTypes.DIRECT_CHAT)
  );

  const { query, setFilteredList, handleChange, filteredList } =
    useDebounceFilter(conversations, "msg");

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

  useEffect(() => {
    dispatch(setChatType({ chatType: chatTypes.DIRECT_CHAT }));

    const fetchCvs = async () => {
      await callAction(fetchConversations({ type: chatTypes.DIRECT_CHAT }));
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

        {/* search */}
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

        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Archive size={24} />
            <Button>{translate(`directCvs.${toCamelCase("Archive")}`)}</Button>
          </Stack>
          <Divider />
        </Stack>

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
              {translate(`directCvs.${toCamelCase("All chats")}`)}
            </Typography>
            {cvsContent}
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
