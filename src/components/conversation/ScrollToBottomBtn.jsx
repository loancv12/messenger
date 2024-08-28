import { Box, IconButton, Slide, Typography } from "@mui/material";
import { ArrowCircleDown } from "phosphor-react";
import React, { useDeferredValue, useEffect, useRef, useState } from "react";
import { scrollToBottom } from "./Messages";

const ScrollToBottomBtn = ({ outerScrollBox }) => {
  const middleTargetRef = useRef();

  const [showArrScrollBtm, setShowArrScrollBtm] = useState(false);
  const deferredShow = useDeferredValue(showArrScrollBtm);

  // show scroll to bottom based on middle target
  const handleMiddleIntersect = (entries) => {
    entries.forEach((entry) => {
      const isIntersecting = entry.isIntersecting;
      setShowArrScrollBtm(!isIntersecting);
    });
  };

  useEffect(() => {
    const outerScrollBox = document.getElementById("outer_scroll_box");
    const observerMiddle = new IntersectionObserver(handleMiddleIntersect, {
      root: outerScrollBox,
    });

    observerMiddle.observe(middleTargetRef.current);
    return () => {
      observerMiddle.disconnect();
    };
  }, []);

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          zIndex: 2,
          bottom: "82px",
          right: "16px",
          height: "1px",
          width: "100px",
          //   backgroundColor: "red",
        }}
      >
        <Slide direction="up" in={deferredShow} mountOnEnter unmountOnExit>
          <IconButton
            sx={{
              position: "absolute",
              bottom: "0",
              right: "0",
              zIndex: 1,
            }}
            onClick={() => scrollToBottom(outerScrollBox.current)}
          >
            <ArrowCircleDown size={32} color="#b80000" weight="fill" />
          </IconButton>
        </Slide>
      </Box>
      <Typography
        ref={middleTargetRef}
        sx={{
          position: "relative",
          bottom: { xs: "450px", md: "500px" },
          left: 0,
          marginTop: "0 !important",
          height: "1px",
          width: "100px",
          backgroundColor: "red",
        }}
      ></Typography>
    </>
  );
};

export default ScrollToBottomBtn;
