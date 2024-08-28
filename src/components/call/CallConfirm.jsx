import React, { useState } from "react";
import { FullScreen } from "./FullScreen";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { faker } from "@faker-js/faker";
import { PhoneDisconnect, VideoCamera } from "phosphor-react";
import { useLocation, useNavigate } from "react-router-dom";
import { generalPath, path, specificPath } from "../../routes/paths";
import { updateCallConfirm } from "../../redux/app/appSlice";
import { useDispatch } from "react-redux";
import instance from "../../socket";
import useAuth from "../../hooks/useAuth";

const CallConfirm = ({ callConfirmOpen, roomId, senderId }) => {
  const { userId } = useAuth();
  const socket = instance.getSocket();
  const [open, setOpen] = useState(callConfirmOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const declineCall = () => {
    socket.emit("decline_invite", { roomId, senderId, receiverId: userId });
    setOpen(false);
    dispatch(updateCallConfirm({ open: false, roomId: "", senderId: null }));
  };
  const acceptCall = () => {
    dispatch(updateCallConfirm({ open: false, roomId: "", senderId: null }));
    setTimeout(function () {
      navigate(path(generalPath.call, roomId, "/", specificPath.callRoom));
    }, 200);
  };

  return (
    <Dialog
      open={open}
      onClose={declineCall}
      aria-labelledby="call-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="call-dialog-title">
        {"Confirm receive a call"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">
          {senderId} calling you, Do you receive it
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={declineCall}>Disagree</Button>
        <Button onClick={acceptCall} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CallConfirm;
