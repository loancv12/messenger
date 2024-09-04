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
  useLayoutEffect,
  useMemo,
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

import {
  selectCurrCvsId,
  selectNumOfParticipants,
  setCurrentCvsId,
  updateConversation,
} from "../../redux/conversation/conversationSlice";
import useAuth from "../../hooks/useAuth";
import { fDateFromNow } from "../../utils/formatTime";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useMatch, useParams } from "react-router-dom";
import instance from "../../socket";
import { debounce } from "../../utils/debounce";
import ScrollToBottomBtn from "./ScrollToBottomBtn";

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

export const scrollToBottom = (el) => {
  console.log("run scroll to btm");
  if (el) {
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }
};

// sorry for stupid name, lastReadUserIds is obj, its key is msgId, value is array of userId Whose last read msg is msdId
//  haveLastReadMsgUser is a arr of userId Which already have in lastReadUserIds
// prevReadUserIdsString is an string, Which is a JSOn stringify obj, is a prev version of lastReadUserIds
// const relatedLstRead={}
// relatedLstRead.pros.lastReadUserIds={};

let lastReadUserIds = {};
let haveLastReadMsgUser = [];
let prevLastReadMsgIds = {};

function getLastReadUserIds(
  currentMsgs,
  numOfParticipants,
  curUserId,
  prevReadUserIdsString
) {
  lastReadUserIds = {};
  haveLastReadMsgUser = [];
  prevLastReadMsgIds = {};

  for (let i = currentMsgs.length - 1; i >= 0; i--) {
    const currMsg = currentMsgs[i];

    const { readUserIds: currMsgReadUserIds } = currMsg;
    // if all user have their last read msg, break
    if (haveLastReadMsgUser.length === numOfParticipants) {
      break;
    }
    // get all the user that read msg, except the currUser ( i dont want to show current user)
    const otherReadUserIds = [...currMsgReadUserIds, currMsg.from];
    // .filter(
    //   (userId) => userId !== curUserId
    // );

    // the latest msg, attach all read user with msgId
    if (i === currentMsgs.length - 1) {
      // check the prev last read msg of a user (when this user open cvsId, it will added to readUserIds list of msg)
      // and of course, the msg that this user last read is latest msg, so i only check this
      const prevReadUserIds = JSON.parse(prevReadUserIdsString);
      if (prevReadUserIdsString) {
        otherReadUserIds.forEach((userId) => {
          const prevLastReadMsgId = Object.keys(prevReadUserIds).find((msgId) =>
            prevReadUserIds[msgId].includes(userId)
          );
          if (prevLastReadMsgId) {
            prevLastReadMsgIds[userId] = prevLastReadMsgId;
          }
        });
      }

      lastReadUserIds[currMsg.id] = otherReadUserIds;
      // so, these above user  have their own last read msg
    } else {
      // chose all user that not have own their last read msg yet
      lastReadUserIds[currMsg.id] = otherReadUserIds.filter(
        (userId) => !haveLastReadMsgUser.includes(userId)
      );
    }

    // save all user that have own their last read msg into haveLastReadMsgUser
    if (lastReadUserIds[currMsg.id].length)
      haveLastReadMsgUser.push(...lastReadUserIds[currMsg.id]);
  }

  console.log(
    "run useMemo",
    lastReadUserIds,
    prevLastReadMsgIds,
    JSON.parse(prevReadUserIdsString)
  );

  return { lastReadUserIds, prevLastReadMsgIds };
}

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

let prevReadUserIds = null;
function Messages({ menu, chatType }) {
  const socket = instance.getSocket();

  const { cvsId } = useParams();

  const { userId } = useAuth();
  const dispatch = useDispatch();

  const {
    callAction: callMsgs,
    isLoading: isLdMsgs,
    isError: isErrorMsgs,
  } = useAxiosPrivate();
  const {
    callAction: callGetNext,
    isLoading: isLdGetNext,
    isError: isErrorGetNext,
  } = useAxiosPrivate();

  const {
    callAction: callGetRep,
    isLoading: isLdGetRep,
    isError: isErrorGetRep,
  } = useAxiosPrivate();

  const currentMsgs = useSelector(selectCurrentMsgs);
  const numOfParticipants = useSelector(selectNumOfParticipants);
  // so, make a ref, which a refence variable, not a primitive, unchange, same as every render is a suitable option, no need to add useEffect,
  // this comp have enough useEffect and logic, i dont want any more  :<<

  const outerScrollBox = useRef();
  const topTargetRef = useRef();
  const bottomTargetRef = useRef();

  const relatedRef = useRef({
    // set Number.MAX_SAFE_INTEGER value to prevent 'scroll up enter' of target element
    // of intersection observer during the first invoke callback
    previousY: Number.MAX_SAFE_INTEGER,
    previousRatio: Number.MAX_SAFE_INTEGER,
    isVeryBottom: true,
    oldestMsgId: "",
    lastMsgId: "",
    runGetNext: false,
    // cause of currentCvsId is defined at mounted in useEffect with no dep, rerender not update it, so currentCvsId in handleGetNextMsgs is defined there
    currentCvsId: cvsId,
  });

  // cursor for paginate
  const cursorRef = useRef({
    lastMsgCreated: "",
    isHaveMoreMsg: true,
  });

  const msgsRef = useRef(null);

  const getMap = useCallback(() => {
    if (!msgsRef.current) {
      // Initialize the Map on first usage.
      msgsRef.current = new Map();
    }
    return msgsRef.current;
  }, []);

  const findAndScrollToView = (msgId) => {
    const map = getMap();
    const node = map.get(msgId);
    node.scrollIntoView({
      behavior: "instant",
    });
  };

  const resetRefWhenChangeCvs = () => {
    relatedRef.current.previousY = Number.MAX_SAFE_INTEGER;
    relatedRef.current.previousRatio = Number.MAX_SAFE_INTEGER;
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
          conversationId: relatedRef.current.currentCvsId,
          newMessages: res.data.data,
        })
      );
    };

    await callGetNext(
      fetchMessages({
        data: {
          type: chatType,
          conversationId: relatedRef.current.currentCvsId,
          endCursor: cursorRef.current.lastMsgCreated,
        },
        onSuccess,
      })
    );
  };

  const handleGetToRepMsg = useCallback(async (cursor) => {
    const onSuccess = (res) => {
      const isHaveMoreMsg = res?.headers?.["x-pagination"];
      cursorRef.current.isHaveMoreMsg = isHaveMoreMsg;
      cursorRef.current.lastMsgCreated = res.data.data[0].createdAt;

      dispatch(
        concatMessages({
          type: chatType,
          conversationId: relatedRef.current.currentCvsId,
          newMessages: res.data.data,
        })
      );
    };

    if (cursorRef.current.isHaveMoreMsg) {
      await callGetRep(
        fetchMessages({
          data: {
            type: chatType,
            conversationId: relatedRef.current.currentCvsId,
            endCursor: cursorRef.current.lastMsgCreated,
            startCursor: cursor,
          },
          onSuccess,
        })
      );
    }
  }, []);

  // call getNextDate when scroll to very up
  const handleTopIntersect = (entries) => {
    entries.forEach((entry) => {
      const {
        boundingClientRect: { y: currentY },
        intersectionRatio: currentRatio,
        isIntersecting,
      } = entry;
      const { previousY, previousRatio } = relatedRef.current;
      if (
        currentY > previousY &&
        isIntersecting &&
        currentRatio >= previousRatio
      ) {
        console.log("Scrolling very up enter", relatedRef, cursorRef);
        if (cursorRef.current.isHaveMoreMsg) {
          handleGetNextMsgs();
        }
        relatedRef.current.runGetNext = true;
      }

      relatedRef.current.previousY = currentY;
      relatedRef.current.previousRatio = currentRatio;
    });
  };

  // update isVeryBottom based on bottom target
  const handleBottomIntersect = (entries) => {
    entries.forEach((entry) => {
      const isIntersecting = entry.isIntersecting;
      relatedRef.current.isVeryBottom = isIntersecting;
    });
  };

  const isMsgAdded = () => {
    if (currentMsgs?.length) {
      return (
        currentMsgs[currentMsgs.length - 1].id !== relatedRef.current.lastMsgId
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

  useEffect(() => {
    resetRefWhenChangeCvs();

    relatedRef.current.currentCvsId = cvsId;

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

      // wait for set Message run
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

  useEffect(() => {
    console.log("run useEffect ò ");
    const isMsgAddedRet = isMsgAdded();
    const latestMsg = currentMsgs[currentMsgs.length - 1];

    // we can confirm that to user seen msg by emit a event
    // when isMsgAdded (to user of msg added is this user), this event will emit to from user to update unseen
    const isMeReadThisMsg = latestMsg?.readUserIds?.includes(userId);
    if (
      isMsgAddedRet &&
      latestMsg &&
      !isMeReadThisMsg &&
      latestMsg.from !== userId // =>curren user is to user (direct chat) or other user (group chat)
    ) {
      socket.emit("read_msg", {
        conversationId: relatedRef.current.currentCvsId,
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

    if (relatedRef.current.isVeryBottom && isMsgAddedRet) {
      scrollToBottom(outerScrollBox.current);
    }

    // scroll to old pos after run get next msg
    if (relatedRef.current.runGetNext) {
      // update runGetNext MUST before findAndScrollToView,
      relatedRef.current.runGetNext = false;
      findAndScrollToView(relatedRef.current.oldestMsgId);
    }

    // findAndScrollToView MUST before setting oldestMsgId
    // update latestMsgId and oldestMsgId
    if (currentMsgs?.length) {
      relatedRef.current.lastMsgId = latestMsg?.id;
      relatedRef.current.oldestMsgId = currentMsgs[0]?.id;
    }

    return () => {};
  }, [currentMsgs]);

  const isMsgAddedRet = useMemo(() => isMsgAdded(), [currentMsgs]);
  const fromUserIds = useMemo(
    () => getFromUserIds(currentMsgs, userId),
    [isMsgAddedRet, userId]
  );

  const relatedLstRead = useMemo(
    () =>
      getLastReadUserIds(
        currentMsgs,
        numOfParticipants,
        userId,
        prevReadUserIds
      ),
    [
      currentMsgs[currentMsgs.length - 1]?.readUserIds?.length,
      currentMsgs[currentMsgs.length - 1]?.id,
      numOfParticipants,
      userId,
      // prevReadUserIds=>PREVENT  updateSent run useMemo
    ]
  );
  // when msg added=>
  // getLastReadUserIds run
  //   lastReadUserIds of latest msg is sender, other msg have their msg as normal(older msg)
  //   prevLastReadMsgIds only have sender: latestMsg
  //   prevReadUserIds is older msg: sender, other user...
  // prevLastReadMsgIds  in ReadUserIdsSign exist, but its key is sender so not display, value is latestMsg ,
  // cause of isMsgAddedRet is true, prevReadUserIds not updated
  // when updateUsers=>
  // getLastReadUserIds run
  // lastReadUserIds of latest msg is sender and newReadUser, other as normal
  // prevLastReadMsgIds have sender: latestMsg, newReadUser: older msg (remember that our prevReadUserIds not update yet)
  // prevLastReadMsgIds in ReadUserIdsSign exist, newReadUser: olderMsg, not equal to latestMsg=> SLIDEIN

  useEffect(() => {
    if (!isMsgAddedRet) {
      prevReadUserIds = JSON.stringify(relatedLstRead.lastReadUserIds);
      console.log(
        "run update prevReadUserIds",
        prevReadUserIds,
        relatedLstRead.lastReadUserIds
      );
    }
  }, [relatedLstRead, isMsgAddedRet]);

  let repMsgs;
  let msgs;
  let nextMsgs;

  if (isLdGetRep) {
    repMsgs = <LoadingScreen />;
  } else if (isErrorGetRep) {
    repMsgs = <Typography>Some thing wrong</Typography>;
  }

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

  if (isLdMsgs) {
    msgs = [...Array(15).keys()].map((_, i) => <MsgSkeleton key={i} />);
  } else if (isErrorMsgs) {
    msgs = <Typography>Some thing wrong</Typography>;
  } else {
    msgs = currentMsgs?.map((el, i) => {
      const props = {
        el: transformMessages(el, userId),
        key: el.id,
        menu,
        isLastMsg: i === currentMsgs.length - 1,
        handleGetToRepMsg,
        getMap,
        lastReadUserIdsOfMsg: relatedLstRead.lastReadUserIds[el.id],
        fromUserIdsOfMsg: fromUserIds[el.id],
        ...(i === currentMsgs.length - 1 && {
          prevLastReadMsgIds: relatedLstRead.prevLastReadMsgIds,
        }),
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

      <Box
        className="outer_scroll_box"
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
            minHeight: "100%",
            position: "relative",
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
              top: "100px",
              left: 0,
              marginTop: "0 !important",
              height: "1px",
              width: "1px",
            }}
          ></Typography>

          {msgs}
          <ScrollToBottomBtn outerScrollBox={outerScrollBox} />
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
