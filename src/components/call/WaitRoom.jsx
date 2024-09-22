import { Box, IconButton, Stack } from "@mui/material";
import { PhoneCall, X } from "phosphor-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AudioBtn from "./AudioBtn";
import CamBtn from "./CamBtn";
import {
  showCallContent,
  stopStreamedVideo,
  toggleAudio,
  toggleCam,
} from "./utils";

const WaitRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const isFirstMount = useRef(true);
  const currentUserVideoRef = useRef(null);

  const [settings, setSettings] = useState({
    video: true,
    audio: true,
  });

  const handleClose = () => {
    stopStreamedVideo(currentUserVideoRef.current);
    navigate(-1);
  };

  const goRoom = () => {
    stopStreamedVideo(currentUserVideoRef.current);

    setTimeout(function () {
      navigate(`/call/${roomId}/call-room`, {
        state: {
          settings,
        },
      });
    }, 500);
  };

  const toggleSettings = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    if (key === "video") toggleCam(currentUserVideoRef.current);
    if (key === "audio") toggleAudio(currentUserVideoRef.current);
  };

  useEffect(() => {
    if (
      isFirstMount.current === false ||
      process.env.NODE_ENV !== "development"
    ) {
      navigator.mediaDevices.getUserMedia(settings).then((stream) => {
        showCallContent(currentUserVideoRef.current, stream);
      });
    }
    return () => {
      isFirstMount.current = false;
    };
  }, []);
  return (
    <Box>
      <Stack direction="row">
        <video
          width="500px"
          height="400px"
          playsInline
          autoPlay
          ref={currentUserVideoRef}
        />
        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            position: "absolute",
            bottom: "100px",
            right: "50%",
            transform: "translateX(50%)",
          }}
        >
          <CamBtn settings={settings} toggleSettings={toggleSettings} />
          <AudioBtn settings={settings} toggleSettings={toggleSettings} />

          <IconButton onClick={goRoom}>
            <PhoneCall size={32} />
          </IconButton>

          <IconButton onClick={handleClose}>
            <X size={32} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default WaitRoom;
