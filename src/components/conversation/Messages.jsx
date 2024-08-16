import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Slide,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import LoadingScreen from "../common/LoadingScreen";
import {
  DeletedMsg,
  DocMsg,
  LinkMsg,
  MediaMsg,
  MsgSkeleton,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "./MsgTypes";
import { useDispatch, useSelector } from "react-redux";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  selectCurrentMsgs,
  setMessages,
  concatMessages,
} from "../../redux/message/messageSlice";
import { fetchMessages } from "../../redux/message/messageApi";

import { selectChatType } from "../../redux/app/appSlice";
import {
  selectCurrCvsId,
  selectNumOfParticipants,
  setCurrentCvsId,
  updateConversation,
} from "../../redux/conversation/conversationSlice";
import useAuth from "../../hooks/useAuth";
import { fDateFromNow } from "../../utils/formatTime";
import useAxios from "../../hooks/useAxios";
import { useGetTestMutation } from "../../redux/app/api";
import { ArrowCircleDown } from "phosphor-react";
import { chatTypes } from "../../redux/config";
import { useParams } from "react-router-dom";
import instance from "../../socket";

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

const scrollToBottom = (el) => {
  if (el) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }
};

const findAndScrollToView = (msgId) => {
  const targetEl = document.querySelector(`[data-ref="${msgId}"]`);

  if (targetEl) {
    targetEl.scrollIntoView({
      behavior: "instant",
    });
  }
};

const getLastReadUserIds = (currentMsgs, numOfParticipants, curUserId) => {
  let lastReadUserIds = {};
  let haveLastReadMsgUser = [];
  for (let i = currentMsgs.length - 1; i >= 0; i--) {
    const currMsg = currentMsgs[i];
    const { readUserIds: currMsgReadUserIds } = currMsg;

    // if all user have their last read msg, break
    if (haveLastReadMsgUser.length === numOfParticipants) {
      break;
    }
    // get all the user that read msg, except the currUser ( i dont want to show current user)
    // sorry for stupid name
    const exceptCurrUser = [...currMsgReadUserIds, currMsg.from].filter(
      (userId) => userId !== curUserId
    );
    // the latest msg, attach all read user with msgId
    if (i === currentMsgs.length - 1) {
      lastReadUserIds[currMsg.id] = exceptCurrUser;
      // so, these above user  have their own last read msg
    } else {
      // chose all user that not have own their last read msg yet
      lastReadUserIds[currMsg.id] = exceptCurrUser.filter(
        (userId) => !haveLastReadMsgUser.includes(userId)
      );
    }
    if (lastReadUserIds[currMsg.id].length)
      haveLastReadMsgUser.push(...lastReadUserIds[currMsg.id]);
  }

  return lastReadUserIds;
};

const getFromUserIds = (currentMsgs, userId) => {
  let currUser;
  let list = {};
  // 1fo, 2o6, 3fo, 4fo 5de
  for (let i = currentMsgs.length - 1; i >= 0; i--) {
    const currMsg = currentMsgs[i];
    if (currMsg.from === currUser || currMsg.from === userId) {
      currUser = currMsg.from;
      continue;
    } else {
      list[currMsg.id] = currMsg.from;
      currUser = currMsg.from;
    }
  }
  return list;
};

function Messages({ menu }) {
  const socket = instance.getSocket();

  const [showArrScrollBtm, setShowArrScrollBtm] = useState(false);
  const deferredShow = useDeferredValue(showArrScrollBtm);

  const { cvsId } = useParams();
  const { userId } = useAuth();
  const dispatch = useDispatch();

  const {
    callAction: callMsgs,
    isLoading: isLdMsgs,
    isError: isErrorMsgs,
  } = useAxios("msg list");
  const {
    callAction: callGetNext,
    isLoading: isLdGetNext,
    isError: isErrorGetNext,
  } = useAxios("get next");

  const {
    callAction: callGetRep,
    isLoading: isLdGetRep,
    isError: isErrorGetRep,
  } = useAxios("get rep");

  const chatType = useSelector(selectChatType);
  const currentCvsId = useSelector(selectCurrCvsId);
  const currentMsgs = useSelector(selectCurrentMsgs);
  const numOfParticipants = useSelector(selectNumOfParticipants);
  // cause of currentCvsId is defined at mounted in useEffect with no dep, rerender not update it, so currentCvsId in handleGetNextMsgs is defined there
  // so, make a ref, which a refence variable, not a primitive, unchange, same as every render is a suitable option, no need to add useEffect,
  // this comp have enough useEffect and logic, i dont want any more  :<<
  const currentCvsIdRef = useRef(cvsId);

  const outerScrollBox = useRef();
  const topTargetRef = useRef();
  const bottomTargetRef = useRef();

  // set Number.MAX_SAFE_INTEGER value to prevent 'scroll up enter' of target element
  // of intersection observer during the first invoke callback
  const intersectRelateRef = useRef({
    previousY: Number.MAX_SAFE_INTEGER,
    previousRatio: Number.MAX_SAFE_INTEGER,
    isVeryBottom: true,
    oldestMsgId: "",
    lastMsgId: "",
    runGetNext: false,
  });

  // cursor for paginate
  const cursorRef = useRef({
    lastMsgCreated: "",
    isHaveMoreMsg: true,
  });

  const resetRefWhenChangeCvs = () => {
    intersectRelateRef.current.previousY = Number.MAX_SAFE_INTEGER;
    intersectRelateRef.current.previousRatio = Number.MAX_SAFE_INTEGER;
  };

  // oldest:0 to latest:20
  // useCallback to make sure that get the correct msg of currentCvsId, esp get next after change currentCvsId
  const handleGetNextMsgs = async () => {
    const onSuccess = (res) => {
      const isHaveMoreMsg = res?.headers?.["x-pagination"];
      cursorRef.current.isHaveMoreMsg = isHaveMoreMsg;
      cursorRef.current.lastMsgCreated = res.data.data[0].createdAt;

      dispatch(
        concatMessages({
          type: chatType,
          conversationId: currentCvsId,
          newMessages: res.data.data,
        })
      );
    };

    await callGetNext(
      fetchMessages({
        data: {
          type: chatType,
          conversationId: currentCvsIdRef.current,
          endCursor: cursorRef.current.lastMsgCreated,
        },
        onSuccess,
      })
    );
  };

  const handleGetToRepMsg = async (cursor) => {
    const onSuccess = (res) => {
      const isHaveMoreMsg = res?.headers?.["x-pagination"];
      cursorRef.current.isHaveMoreMsg = isHaveMoreMsg;
      cursorRef.current.lastMsgCreated = res.data.data[0].createdAt;

      dispatch(
        concatMessages({
          type: chatType,
          conversationId: currentCvsIdRef.current,
          newMessages: res.data.data,
        })
      );
    };

    if (cursorRef.current.isHaveMoreMsg) {
      await callGetRep(
        fetchMessages({
          data: {
            type: chatType,
            conversationId: currentCvsIdRef.current,
            endCursor: cursorRef.current.lastMsgCreated,
            startCursor: cursor,
          },
          onSuccess,
        })
      );
    }
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
        if (cursorRef.current.isHaveMoreMsg) {
          handleGetNextMsgs();
        }
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
      intersectRelateRef.current.isVeryBottom = isIntersecting;

      // actually, first i use useEffect with dep is intersectRelateRef.current.isVeryBottom,it not work cause
      // dependencies in useEffect is The list of all reactive values referenced inside of the setup code.
      // Reactive values include props, state, and all the variables and functions declared directly inside your component body
      // ofcourse value of refObject is not that
      setShowArrScrollBtm(!isIntersecting);
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

  useEffect(() => {
    resetRefWhenChangeCvs();

    currentCvsIdRef.current = cvsId;

    let timeId;
    const onSuccess = (res) => {
      const isHaveMoreMsg = res?.headers?.["x-pagination"];
      cursorRef.current.isHaveMoreMsg = isHaveMoreMsg;
      cursorRef.current.lastMsgCreated = res.data.data[0]?.createdAt;
      dispatch(
        setMessages({
          type: chatType,
          conversationId: cvsId,
          messages: res.data.data,
        })
      );

      timeId = setTimeout(function () {
        scrollToBottom(outerScrollBox.current);
      }, 100);
    };

    const fetchMsgs = async () => {
      await callMsgs(
        fetchMessages({
          data: {
            type: chatType,
            conversationId: cvsId,
            endCursor: new Date(),
          },
          onSuccess,
        })
      );
    };

    fetchMsgs();

    return () => {
      clearTimeout(timeId);
    };
  }, [cvsId]);

  // 2 case for change currentMsg: after call setMessage, call addMsg.
  useEffect(() => {
    const isMsgAddedRet = isMsgAdded();
    // we can comfirm that to user seen msg by emit a event when isMsgAdded (to user of msg added is this user), this event will emit to from user to update unseen
    const latestMsg = currentMsgs[currentMsgs.length - 1];

    const isAllMsgRead = latestMsg?.readUserIds?.includes(userId);
    if (
      isMsgAddedRet &&
      latestMsg &&
      !isAllMsgRead &&
      latestMsg.from !== userId
    ) {
      socket.emit("read_msg", {
        conversationId: currentCvsIdRef.current,
        chatType,
        to: userId,
        from: latestMsg.from,
      });

      dispatch(
        updateConversation({
          type: chatType,
          conversationId: cvsId,
          updatedContent: { unread: 0 },
        })
      );
    }

    let timeId;
    // when msg add and isVeryBottom, incase not isVeryBottom( we scroll to up before) and isMsgAddedRet, not scroll again to bottom
    if (intersectRelateRef.current.isVeryBottom && isMsgAddedRet) {
      // make sure that scroll to btm after all UI is render
      timeId = setTimeout(function () {
        scrollToBottom(outerScrollBox.current);
      }, 0);
    }

    if (intersectRelateRef.current.runGetNext) {
      findAndScrollToView(intersectRelateRef.current.oldestMsgId);
      intersectRelateRef.current.runGetNext = false;
    }

    // findAndScrollToView MUST before setting oldestMsgId
    if (currentMsgs?.length) {
      intersectRelateRef.current.lastMsgId = latestMsg?.id;
      intersectRelateRef.current.oldestMsgId = currentMsgs[0]?.id;
    }

    return () => {
      clearTimeout(timeId);
    };
  }, [currentMsgs]);

  let repMsgs;
  if (isLdGetRep) {
    repMsgs = <LoadingScreen />;
  } else if (isErrorGetRep) {
    repMsgs = <Typography>Some thing wrong</Typography>;
  }

  let nextMsgs;
  if (isLdGetNext) {
    nextMsgs = (
      <Typography
        sx={{
          position: "absolute",
          top: "76px",
          right: "50%",
          transform: "translateX(50%)",
        }}
      >
        <CircularProgress size={18} />
      </Typography>
    );
  } else if (isErrorGetNext) {
    nextMsgs = <Typography>Some thing wrong</Typography>;
  }

  let msgs;
  if (isLdMsgs) {
    msgs = [...Array(15).keys()].map((_, i) => <MsgSkeleton key={i} />);
  } else if (isErrorMsgs) {
    msgs = <Typography>Some thing wrong</Typography>;
  } else {
    const lastReadUserIds = getLastReadUserIds(
      currentMsgs,
      numOfParticipants,
      userId
    );
    const fromUserIds = getFromUserIds(currentMsgs, userId);

    msgs = currentMsgs?.map((el, i) => {
      const props = {
        el: transformMessages(el, userId),
        key: i,
        menu,
        isLastMsg: i === currentMsgs.length - 1,
        handleGetToRepMsg,
        lastReadUserIds,
        fromUserIds,
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
  }

  return (
    <>
      {repMsgs}
      {nextMsgs}

      <Slide direction="up" in={deferredShow} mountOnEnter unmountOnExit>
        <IconButton
          sx={{
            position: "absolute",
            bottom: "71px",
            right: "13px",
            zIndex: 1,
          }}
          onClick={() => scrollToBottom(outerScrollBox.current)}
        >
          <ArrowCircleDown size={32} color="#b80000" weight="fill" />
        </IconButton>
      </Slide>

      <Box
        className="outerScrollBox"
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
        <Stack
          p={2}
          direction={"column"}
          spacing={2}
          id="scrollableDiv"
          sx={{
            overflow: "auto",
            "& *": {
              overflowAnchor: "none",
            },
            "& > div:nth-of-type(1)": {
              marginTop: "0 !important",
            },
            "& > p": {
              marginTop: "0 !important",
            },
          }}
        >
          <Typography
            ref={topTargetRef}
            sx={{
              position: "absolute",
              top: "200px",
              left: 0,
              marginTop: "0 !important",
              height: "1px",
              width: "1px",
            }}
          ></Typography>

          {msgs}
          <Typography
            ref={bottomTargetRef}
            sx={{ marginTop: "0 !important", height: "1px" }}
          ></Typography>
        </Stack>
      </Box>
    </>
  );
}

export default Messages;
