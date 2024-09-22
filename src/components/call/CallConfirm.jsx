import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { updateCallConfirm } from "../../redux/app/appSlice";
import instance from "../../socket";

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
      navigate(`/call/${roomId}/call-room`);
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
