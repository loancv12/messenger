import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Clipboard } from "phosphor-react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/app/appSlice";

function showCallContent(el, stream) {
  el.srcObject = stream;
  el.play();
}

async function getLocalStream() {
  try {
    const stream = navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    return stream;
  } catch (error) {
    console.error(`you got an error: ${err}`);
  }
}

// stop both mic and camera
function stopBothVideoAndAudio(stream) {
  stream.getTracks().forEach((track) => {
    if (track.readyState == "live") {
      track.stop();
    }
  });
}

function CallDialog(props) {
  const dispatch = useDispatch();
  const { onClose, selectedValue, open } = props;

  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const [isCalling, setIsCalling] = useState(false);

  const mediaConnRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);

  const handleClose = () => {
    setRemotePeerIdValue("");
    setIsCalling(false);
    onClose(selectedValue);
  };

  const call = async (remotePeerId) => {
    const stream = await getLocalStream();
    mediaStreamRef.current = stream;

    showCallContent(currentUserVideoRef.current, stream);

    const call = peerInstance.current.call(remotePeerId, stream);

    call.on("stream", (remoteStream) => {
      showCallContent(remoteVideoRef.current, remoteStream);
    });
    call.on("close", () => {
      console.log("mediaConn close caller side");
    });

    mediaConnRef.current = call;
    setIsCalling(true);
  };

  const hangUpCall = () => {
    mediaConnRef.current.close();
    stopBothVideoAndAudio(mediaStreamRef.current);
    setIsCalling(false);
    setRemotePeerIdValue("");
    handleClose();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(peerId);
    dispatch(showSnackbar({ severity: "success", message: "Copied" }));
  };

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", async (call) => {
      const stream = await getLocalStream();
      mediaStreamRef.current = stream;
      showCallContent(currentUserVideoRef.current, stream);

      call.answer(stream);
      call.on("stream", function (remoteStream) {
        showCallContent(remoteVideoRef.current, remoteStream);
      });
      call.on("close", () => {
        console.log("mediaConn close callee side");
      });

      mediaConnRef.current = call;
    });

    peer.on("'error", (err) => {
      console.log("'error", err.type);
    });

    peer.on("close", () => {
      console.log("peer closse");
    });

    peerInstance.current = peer;
  }, []);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      fullWidth={true}
      maxWidth={"md"}
      aria-labelledby="call video"
    >
      <DialogActions sx={{ position: "absolute", right: 0 }}>
        <Button onClick={handleClose}>X</Button>
      </DialogActions>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 4,
          width: "100%",
        }}
      >
        <Typography variant="body1">Room Id:</Typography>
        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <Typography variant="body2">{peerId}</Typography>

            <IconButton onClick={copyToClipboard}>
              <Clipboard size={24} />
            </IconButton>
          </Stack>
          <Stack direction={"row"} spacing={2} alignItems={"center"}>
            <TextField
              value={remotePeerIdValue}
              onChange={(e) => setRemotePeerIdValue(e.target.value)}
            />
            {isCalling ? (
              <button onClick={hangUpCall}>Hang up</button>
            ) : (
              <button onClick={() => call(remotePeerIdValue)}>Call</button>
            )}
          </Stack>
        </Stack>
        <Box sx={{ position: "relative" }}>
          <video width={"100%"} maxwidth="600px" ref={currentUserVideoRef} />
          <video
            style={{ position: "absolute", bottom: 0, right: 0 }}
            width="300px"
            height="300px"
            ref={remoteVideoRef}
          />
        </Box>
      </Box>
    </Dialog>
  );
}

export default CallDialog;
