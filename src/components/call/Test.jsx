import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import instance, { callInstance } from "../../socket";

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return <video playsInline autoPlay ref={ref} />;
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const callSocket = callInstance.initSocket();

const Room = (props) => {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const otherVideo = useRef();
  const peersRef = useRef([]);
  const { userId } = useAuth();
  const { roomId } = useParams();

  useEffect(() => {
    if (!callSocket.connected) {
      callInstance.connect(userId, roomId);
    }
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        callSocket.emit("join room", roomId);

        callSocket.on(
          "all users",
          (otherSocketIdsInThisRoom, socketIdOfSender) => {
            // when creator join room, there no other socket in room, so below line not run
            // only when other user join this room, it will create peer send it to creator
            if (otherSocketIdsInThisRoom.length) {
              // otherSocketIdsInThisRoom.
              const peer = new Peer({
                initiator: true,
                trickle: false,
                stream,
              });

              peer.on("signal", (signal) => {
                callSocket.emit("sending_signal_to_receiver", {
                  signal,
                  socketIdOfReceiver,
                  socketIdOfSender,
                });
              });
            }
          }
        );
      });
  }, []);

  return (
    <Box>
      <video muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} />;
      })}
    </Box>
  );
};

export default Room;
