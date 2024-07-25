import {
  Box,
  Button,
  CircularProgress,
  IconButton,
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
import { useCallback, useEffect, useRef, useState } from "react";
import {
  selectCurrentMsgs,
  setCurrentMsgs,
  concatMessages,
} from "../../redux/message/messageSlice";
import { fetchMessages } from "../../redux/message/messageApi";

import { selectChatType } from "../../redux/app/appSlice";
import { selectCurrCvsId } from "../../redux/conversation/conversationSlice";
import useAuth from "../../hooks/useAuth";
import { fDateFromNow } from "../../utils/formatTime";
import useAxios from "../../hooks/useAxios";
import { useGetTestMutation } from "../../redux/app/api";
import { ArrowCircleDown } from "phosphor-react";

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

function Messages({ menu, handleGetNextMsgs }) {
  const [showArrScrollBtm, setShowArrScrollBtm] = useState(false);
  const { userId } = useAuth();
  const dispatch = useDispatch();

  const chatType = useSelector(selectChatType);
  const currentCvsId = useSelector((state) => selectCurrCvsId(state, chatType));
  const currentMsgs = useSelector((state) =>
    selectCurrentMsgs(state, chatType)
  );
  // cause of handleTopIntersect is defined at mounted, so currentCvsId in handleGetNextMsgs is defined there
  // cause of handleGetNextMsgs is pass by pros, so it also defined when this comp mounted, =>cannot make handleGetNextMsgs no para
  // making handleGetNextMsgs is defined here, it cannot acccess the cursor, we can pass cursor as pros, but it take 2 useEffect to reset cursor
  // so, make a ref, which a refence variable, unchange, the value of key, which only change; is a suitable option, no need to add useEffect,
  // this comp have enough useEffect and logic, i dont want any more  :<<
  const currentCvsIdRef = useRef(currentCvsId);

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
    runGetNext: false,
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

  const resetRefWhenChangeCvs = () => {
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
        console.log("Scrolling very up enter", currentCvsIdRef);
        intersectRelateRef.current.prevPos =
          outerScrollBox.current.scrollHeight;

        handleGetNextMsgs(currentCvsIdRef.current);
        intersectRelateRef.current.runGetNext = true;
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

    // const lastMsgCreated = currentMsgs[currentMsgs.length - 1].createdAt;
    // const conversationId = currentMsgs[currentMsgs.length - 1].conversationId;
    const intervalId = setInterval(function () {
      // socket.emit("seen-msg", {
      //   lastMsgCreated,
      //   chatType,
      // });
    }, 1000);

    return () => {
      observerTop.disconnect();
      observerBottom.disconnect();
      clearInterval(intervalId);
    };
  }, []);

  // const [getTest, result] = useGetTestMutation();
  // console.log("getTest", getTest);
  useEffect(() => {
    resetRefWhenChangeCvs();
    scrollToBottom(outerScrollBox.current);
    currentCvsIdRef.current = currentCvsId;
  }, [currentCvsId]);

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

    if (intersectRelateRef.current.runGetNext) {
      scrollToOldPos(outerScrollBox.current, prevPos);
      intersectRelateRef.current.runGetNext = false;
    }
  }, [currentMsgs]);

  useEffect(() => {
    if (!intersectRelateRef.current.isVeryBottom) {
      setShowArrScrollBtm(true);
    } else {
      setShowArrScrollBtm(false);
    }
  }, [intersectRelateRef.current.isVeryBottom]);

  // the order is reverse cause of createdAt:-1
  const msgs = currentMsgs?.map((el, i) => {
    const props = {
      el: transformMessages(el, userId),
      key: i,
      menu,
      isLastMsg: i === currentMsgs[currentMsgs.length - 1],
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
      {/* {true ? (
      ) : null} */}
      <IconButton
        sx={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
        }}
      >
        <ArrowCircleDown size={32} color="#b80000" weight="fill" />
      </IconButton>
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
