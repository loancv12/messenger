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
} from "../../redux/message/messageSlice";
import { fetchMessages } from "../../redux/message/messageApi";

import { selectChatType } from "../../redux/app/appSlice";
import { selectCurrCvsId } from "../../redux/conversation/conversationSlice";

function Messages({ menu }) {
  console.log("messges comp");
  const [isLoading, setIsLoading] = useState(false);
  const isVeryBottomRef = useRef(true);
  const pageRef = useRef({
    page: 1,
    numberOfPages: 1,
  });
  const outerScrollBox = useRef();
  const topTargetRef = useRef();
  const bottomTargetRef = useRef();

  // set Number.MAX_SAFE_INTEGER value to prevent 'scroll up enter' of target element
  // of intersection observer during the first invoke callback
  const intersectRef = useRef({
    previousY: Number.MAX_SAFE_INTEGER,
    previousRatio: Number.MAX_SAFE_INTEGER,
  });

  const prevPosRef = useRef(0);

  const lastMsgIdRef = useRef("");

  const dispatch = useDispatch();
  const chatType = useSelector(selectChatType);
  const currentCvsId = useSelector((state) => selectCurrCvsId(state, chatType));
  const currentMsgs = useSelector((state) =>
    selectCurrentMsgs(state, chatType)
  );

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

  const handleGetNextMsgs = () => {
    console.log("handleGetNextMsgs", pageRef);

    dispatch(
      fetchMessages({
        type: chatType,
        conversationId: currentCvsId,
        page: pageRef.current.page,
        onApiStart: () => setIsLoading(true),
        onApiEnd: () => setIsLoading(false),
        onSuccess: (res) => {
          const numberOfPages = res?.headers?.["x-pagination"];
          pageRef.current.numberOfPages = Number(numberOfPages);
          dispatch(
            concatMessages({ type: chatType, newMessages: res.data.data })
          );
        },
      })
    );
  };

  const resetRefWhenChangeCvs = () => {
    pageRef.current.page = 1;
    intersectRef.current.previousY = Number.MAX_SAFE_INTEGER;
    intersectRef.current.previousRatio = Number.MAX_SAFE_INTEGER;
    prevPosRef.current = 0;
  };

  // call getNextDate when scroll to very up
  const handleTopIntersect = (entries) => {
    entries.forEach((entry) => {
      const {
        boundingClientRect: { y: currentY },
        intersectionRatio: currentRatio,
        isIntersecting,
      } = entry;

      const { previousY, previousRatio } = intersectRef.current;
      if (
        currentY > previousY &&
        isIntersecting &&
        currentRatio >= previousRatio
      ) {
        console.log("Scrolling very up enter");
        prevPosRef.current = outerScrollBox.current.scrollHeight;

        if (pageRef.current.page < pageRef.current.numberOfPages) {
          pageRef.current.page++;
          handleGetNextMsgs();
        }
      }

      intersectRef.current.previousY = currentY;
      intersectRef.current.previousRatio = currentRatio;
    });
  };

  // update isVeryBottomRef based on bottom target
  const handleBottomIntersect = (entries) => {
    entries.forEach((entry) => {
      const isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        isVeryBottomRef.current = true;
      } else {
        isVeryBottomRef.current = false;
      }
    });
  };

  const isMsgAdded = () => {
    if (currentMsgs?.length) {
      return currentMsgs[currentMsgs.length - 1].id !== lastMsgIdRef.current;
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
    console.log("change currentCvsId", currentCvsId, chatType);
    let timeOutId;
    if (currentCvsId) {
      // setTimeout to prevent get wrong cvs type msgs,
      // because useEffect of DirectPage or GroupPage(Which selectTypeOfCvs ) run after this useEffect run,
      // so when this useEffect run, currentCvsId is old, msg is not correct cvs type,
      // after selectTypeOfCvs, currentCvsId change, api run with correct path with correct cvs type msg
      timeOutId = setTimeout(function () {
        dispatch(
          fetchMessages({
            type: chatType,
            conversationId: currentCvsId,
            page: 1,
            // onApiStart
            onSuccess: (res) => {
              const numberOfPages = res?.headers?.["x-pagination"];
              pageRef.current.numberOfPages = Number(numberOfPages);
              dispatch(
                setCurrentMsgs({ type: chatType, messages: res.data.data })
              );
            },
          })
        );
      }, 10);
    }
    resetRefWhenChangeCvs();
    scrollToBottom(outerScrollBox.current);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [currentCvsId]);

  useEffect(() => {
    const isMsgAddedRet = isMsgAdded();
    if (isVeryBottomRef.current && isMsgAddedRet) {
      scrollToBottom(outerScrollBox.current);
    }
    if (currentMsgs?.length) {
      lastMsgIdRef.current = currentMsgs[currentMsgs.length - 1]?.id;
    }
    const prevPos = outerScrollBox.current.scrollHeight - prevPosRef.current;

    // only scroll to old pos when comp rerender( page!==1) and have msg added
    // when after comp mounted, we scroll up a bit, not make page change, add msg still remain
    // pos, so we no need to scroll to old pos
    if (pageRef.current.page !== 1 && !isMsgAddedRet) {
      scrollToOldPos(outerScrollBox.current, prevPos);
    }
  }, [currentMsgs]);

  const msgs = currentMsgs?.map((el, i) => {
    const props = {
      el,
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
          // css to make 24px height of loading box as the padding-top.
          paddingTop: 0,
          // second div is the first msg div
          "& > div:nth-of-type(2)": {
            marginTop: "0 !important",
          },
        }}
      >
        {" "}
        <Box
          sx={{
            // pageRef.current.page < pageRef.current.numberOfPages
            display: "block",
            height: "24px",
            opacity: isLoading ? 1 : 0,
            width: "100%",
            textAlign: "center",
            marginTop: "0 !important",
          }}
        >
          <CircularProgress
            size={24}
            sx={
              {
                //
              }
            }
          />
        </Box>
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
