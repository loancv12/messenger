import { IconButton } from "@mui/material";
import { Camera, CameraSlash } from "phosphor-react";
import React from "react";

const CamBtn = ({ btnsStatus, toggleSettings }) => {
  return (
    <IconButton
      sx={{
        backgroundColor:
          btnsStatus.video === "disable" ? "#8383838a" : "#333333a8",
        "&:hover": {
          backgroundColor: "green",
        },
      }}
      disabled={btnsStatus.video === "disable"}
      onClick={() => toggleSettings("video")}
    >
      {btnsStatus.video === "on" ? (
        <Camera color="#fff" size={32} />
      ) : (
        <CameraSlash
          color={btnsStatus.video === "disable" ? "#8383838a" : "#fff"}
          size={32}
        />
      )}
    </IconButton>
  );
};

export default CamBtn;
