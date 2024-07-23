import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DeletedMsg,
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "./MsgTypes";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  selectCurrentMsgs,
  setCurrentMsgs,
  concatMessages,
  selectNumOfPage,
} from "../../redux/message/messageSlice";
import { fetchMessages } from "../../redux/message/messageApi";

import { selectChatType } from "../../redux/app/appSlice";
import { selectCurrCvsId } from "../../redux/conversation/conversationSlice";
import useAuth from "../../hooks/useAuth";
import { fDateFromNow } from "../../utils/formatTime";
import useAxios from "../../hooks/useAxios";
import { useGetTestMutation } from "../../redux/app/api";

function transformMessages(rawMsg, userId) {
  let timeOfStartMsg = "",
    isMyReply = null,
    isSelfReply = null;
  if (rawMsg?.isStartMsg) {
    timeOfStartMsg = fDateFromNow(rawMsg.createdAt);
  }

  const incoming = userId === rawMsg.from ? false : true;

  if (rawMsg?.isReply) {
    isMyReply = userId === rawMsg.from;
    isSelfReply = userId !== rawMsg.replyMsg?.from ? true : false;
  }

  const solveMsg = {
    ...rawMsg,
    timeOfStartMsg,
    incoming,
    replyMsg: {
      ...rawMsg.replyMsg,
      isMyReply,
      isSelfReply,
    },
  };

  return solveMsg;
}

function Messages({ menu }) {
  const { userId } = useAuth();
  const dispatch = useDispatch();

  const chatType = useSelector(selectChatType);
  const numOfPage = useSelector((state) => selectNumOfPage(state, chatType));
  const currentCvsId = useSelector((state) => selectCurrCvsId(state, chatType));
  const currentMsgs = useSelector((state) =>
    selectCurrentMsgs(state, chatType)
  );

  const { callAction, isLoading, isError, error } = useAxios("mes");

  const pageRef = useRef({
    page: 1,
    numberOfPages: numOfPage,
  });

  const outerScrollBox = useRef();
  const topTargetRef = useRef();
  const bottomTargetRef = useRef();

  // set Number.MAX_SAFE_INTEGER value to prevent 'scroll up enter' of target element
  // of intersection observer during the first invoke callback
  const intersectRelateRef = useRef({
    previousY: Number.MAX_SAFE_INTEGER,
    previousRatio: Number.MAX_SAFE_INTEGER,
    isVeryBottom: true,
    prevPos: 0,
    lastMsgId: "",
  });

  const scrollToBottom = (el) => {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  };

  const scrollToOldPos = (el, pos) => {
    el.scrollTo({
      top: pos,
      behavior: "instant",
    });
  };

  const fetchMsg = async (page, onSuccess) => {
    try {
      await callAction(
        fetchMessages({
          data: {
            type: chatType,
            conversationId: currentCvsId,
            page,
          },
          onSuccess,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetNextMsgs = async () => {
    console.log("handleGetNextMsgs", pageRef);

    const onSuccess = (res) => {
      const numberOfPages = res?.headers?.["x-pagination"];
      pageRef.current.numberOfPages = Number(numberOfPages);
      dispatch(concatMessages({ type: chatType, newMessages: res.data.data }));
    };
    await fetchMsg(pageRef.current.page, onSuccess);
  };

  const resetRefWhenChangeCvs = () => {
    pageRef.current.page = 1;
    pageRef.current.numberOfPages = 1;

    intersectRelateRef.current.previousY = Number.MAX_SAFE_INTEGER;
    intersectRelateRef.current.previousRatio = Number.MAX_SAFE_INTEGER;
    intersectRelateRef.current.prevPos = 0;
  };

  // call getNextDate when scroll to very up
  const handleTopIntersect = (entries) => {
    entries.forEach((entry) => {
      const {
        boundingClientRect: { y: currentY },
        intersectionRatio: currentRatio,
        isIntersecting,
      } = entry;

      const { previousY, previousRatio } = intersectRelateRef.current;
      if (
        currentY > previousY &&
        isIntersecting &&
        currentRatio >= previousRatio
      ) {
        console.log("Scrolling very up enter", pageRef);
        intersectRelateRef.current.prevPos =
          outerScrollBox.current.scrollHeight;

        if (pageRef.current.page < pageRef.current.numberOfPages) {
          pageRef.current.page++;
          handleGetNextMsgs();
        }
      }

      intersectRelateRef.current.previousY = currentY;
      intersectRelateRef.current.previousRatio = currentRatio;
    });
  };

  // update isVeryBottom based on bottom target
  const handleBottomIntersect = (entries) => {
    entries.forEach((entry) => {
      const isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        intersectRelateRef.current.isVeryBottom = true;
      } else {
        intersectRelateRef.current.isVeryBottom = false;
      }
    });
  };

  const isMsgAdded = () => {
    if (currentMsgs?.length) {
      return (
        currentMsgs[currentMsgs.length - 1].id !==
        intersectRelateRef.current.lastMsgId
      );
    } else return false;
  };

  useEffect(() => {
    const observerTop = new IntersectionObserver(handleTopIntersect, {
      root: outerScrollBox.current,
    });
    const observerBottom = new IntersectionObserver(handleBottomIntersect, {
      root: outerScrollBox.current,
    });

    observerTop.observe(topTargetRef.current);
    observerBottom.observe(bottomTargetRef.current);
    return () => {
      observerTop.disconnect();
      observerBottom.disconnect();
    };
  }, []);

  // const [getTest, result] = useGetTestMutation();
  // console.log("getTest", getTest);
  useEffect(() => {
    resetRefWhenChangeCvs();
    scrollToBottom(outerScrollBox.current);
  }, [currentCvsId]);

  useEffect(() => {
    pageRef.current.numberOfPages = numOfPage;
  }, [numOfPage]);

  // 2 case for change currentMsg: after call setCurrentMsg, call addMsg.
  useEffect(() => {
    const isMsgAddedRet = isMsgAdded();
    // when msg add and isVeryBottom, incase not isVeryBottom( we scroll to up before) and isMsgAddedRet, not scroll again to bottom
    if (intersectRelateRef.current.isVeryBottom && isMsgAddedRet) {
      scrollToBottom(outerScrollBox.current);
    }
    if (currentMsgs?.length) {
      intersectRelateRef.current.lastMsgId =
        currentMsgs[currentMsgs.length - 1]?.id;
    }
    const prevPos =
      outerScrollBox.current.scrollHeight - intersectRelateRef.current.prevPos;

    // only scroll to old pos when comp call next page( page!==1) and not in case have msg added
    // (currentMsgs can change when msg added)
    // incase we call next page before (page=2 for ex),
    // we check !isMsgAddedRet to make sure that we add msg dont make this scroll to oldPos, we want it still there, not scroll
    // in case: when after comp mounted, we scroll up a bit, not make page change,
    // add msg still remain pos, so we no need to scroll to old pos
    if (pageRef.current.page !== 1 && !isMsgAddedRet) {
      scrollToOldPos(outerScrollBox.current, prevPos);
    }
  }, [currentMsgs]);

  const msgs = currentMsgs?.map((el, i) => {
    const props = {
      el: transformMessages(el, userId),
      key: i,
      menu,
    };
    switch (el.type) {
      case "img":
        return <MediaMsg {...{ ...props }} />;
      case "doc":
        return <DocMsg {...{ ...props }} />;
      case "link":
        return <LinkMsg {...{ ...props }} />;
      default:
        return <TextMsg {...{ ...props }} />;
    }
  });

  return (
    <Box
      ref={outerScrollBox}
      width="100%"
      height={"100%"}
      sx={{
        position: "relative",
        flexGrow: 1,
        overflowY: "scroll",
        /* Hide scrollbar for Chrome, Safari and Opera */
        "&::-webkit-scrollbar": {
          width: 0,
        },
        /* IE and Edge */
        // scrollbarWidth: " none",
        /* Firefox */
        msOverflowStyle: "none",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}
      <Stack
        p={3}
        direction={"column"}
        spacing={3}
        id="scrollableDiv"
        sx={{
          overflow: "auto",
          "& *": {
            overflowAnchor: "none",
          },
          "& > div:nth-of-type(1)": {
            marginTop: "0 !important",
          },
        }}
      >
        <Typography
          ref={topTargetRef}
          sx={{
            marginTop: "0 !important",
            height: "1px",
          }}
        ></Typography>
        {msgs}
        <Typography
          ref={bottomTargetRef}
          sx={{ marginTop: "0 !important", height: "1px" }}
        ></Typography>
      </Stack>
    </Box>
  );
}

export default Messages;
