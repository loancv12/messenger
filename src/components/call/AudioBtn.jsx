import { IconButton } from "@mui/material";
import { Microphone, MicrophoneSlash } from "phosphor-react";
import React from "react";

const AudioBtn = ({ btnsStatus, toggleSettings }) => {
  return (
    <IconButton
      sx={{
        backgroundColor:
          btnsStatus.audio === "disable" ? "#8383838a" : "#333333a8",
        "&:hover": {
          backgroundColor: "green",
        },
      }}
      disabled={btnsStatus.audio === "disable"}
      onClick={() => toggleSettings("audio")}
    >
      {/* <Microphone size={32} /> */}
      {btnsStatus.audio === "on" ? (
        <Microphone color="#fff" size={32} />
      ) : (
        <MicrophoneSlash
          color={btnsStatus.audio === "disable" ? "#8383838a" : "#fff"}
          size={32}
        />
      )}
    </IconButton>
  );
};

export default AudioBtn;
