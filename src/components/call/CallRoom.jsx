import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import { useDispatch, useSelector } from "react-redux";
import instance, { callInstance } from "../../socket";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  selectCurrCvs,
  selectPeopleInCvs,
} from "../../redux/conversation/conversationSlice";
import useAuth from "../../hooks/useAuth";
import { stopStreamedVideo, toggleCam, toggleAudio } from "./utils";
import CamBtn from "./CamBtn";
import AudioBtn from "./AudioBtn";
import Video from "./Video";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import {
  Camera,
  CameraSlash,
  MicrophoneSlash,
  PhoneCall,
  PhoneSlash,
  VideoCamera,
  X,
} from "phosphor-react";
import { faker } from "@faker-js/faker";
import { showSnackbar } from "../../redux/app/appSlice";

const initialSocket = (userId, roomId) => {
  return callInstance.initAndConnect(userId, roomId);
};
function CallRoom() {
  const dispatch = useDispatch();
  const defaultSettings = {
    video: true,
    audio: true,
  };

  const socket = instance.getSocket();
  const isFirstMount = useRef(true);
  const location = useLocation();
  const navigate = useNavigate();

  const { userId } = useAuth();
  const { roomId } = useParams();
  // const callSocket = callInstance.initAndConnect(userId, roomId);
  const [callSocket, _] = useState(initialSocket);

  const otherUserIdsInCvs = useSelector(selectPeopleInCvs);
  const streamRef = useRef();
  const userIdsJoinBeforeRef = useRef();

  const [btnsStatus, setBtnsStatus] = useState({
    video: "disable", // on off
    audio: "disable", // on off
  });
  const [devicesAccess, setDevicesAccess] = useState({
    video: true,
    audio: true,
  });
  const [callStatus, setCallStatus] = useState("waiting"); // calling callOff callDenied

  const [waitForVideoElement, setWaitForVideoElement] = useState({
    isWait: false,
    userIdOfOtherSide: null,
    signal: null,
  });

  const [peerObjs, setPeerObjs] = useState([]); // handle state issue
  const peerObjsRef = useRef([]); // handle ref issue, use in callback in event

  const [numOfUserJoin, setNumOfUserJoin] = useState(0);
  const numOfUserJoinRef = useRef(0); // use in callback in event

  const currentUserVideoRef = useRef(null);

  const handleInviteOtherUser = (otherUserIdsInCvs) => {
    instance.getSocket().emit("make_invite_call", {
      roomId,
      senderId: userId,
      otherUserIdsInCvs,
    });
  };

  const handleInvitationDenied = () => {
    stopTracksAndDeletePeers();
    setCallStatus("callDenied");
  };

  // handle refresh page
  const stopTracksAndDeletePeers = () => {
    if (currentUserVideoRef.current?.srcObject) {
      stopStreamedVideo(currentUserVideoRef.current);
    }

    peerObjsRef.current = [];
    if (peerObjs.length) {
      peerObjs.forEach((peerObj) => {
        peerObj.peer.destroy();
      });
    }
  };
  const handleCallOff = () => {
    console.log(
      "check ref of socket 2",
      Object.is(callSocket, callInstance.getSocket())
    );
    setCallStatus("callOff");
    setPeerObjs([]);
    peerObjsRef.current = [];
    setNumOfUserJoin(0);
    numOfUserJoinRef.current = 0;

    callInstance.getSocket().emit("leave_room", {
      userId,
      roomId,
      otherUserIdsInCvs,
    });
    stopTracksAndDeletePeers();
  };

  const handleUserLeave = (userIdOfOtherSide) => {
    const stillSomeOneInRoom =
      otherUserIdsInCvs.length !== numOfUserJoinRef.current &&
      numOfUserJoinRef.current !== 0;

    if (!stillSomeOneInRoom) {
      handleCallOff();
    } else {
      const otherPeerObj = peerObjsRef.current.filter(
        (peerObj) => peerObj.userIdOfOtherSide === userIdOfOtherSide
      );

      setPeerObjs(otherPeerObj);
      peerObjsRef.current = otherPeerObj;
      setNumOfUserJoin(numOfUserJoinRef.current - 1);
      numOfUserJoinRef.current = numOfUserJoinRef.current - 1;
    }
  };

  // join later will call this
  function createPeerAndSendSignal(
    isUserJoinLater,
    userIdJoinBefore,
    userIdJoinLater
  ) {
    const peer = new Peer({
      initiator: isUserJoinLater,
      trickle: false,
      stream: streamRef.current,
    });

    peer.on("error", (err) => console.log("error", err));
    // isUserJoinLater will send signal first
    peer.on("signal", (signal) => {
      callSocket.emit("send_signal_to_join_before", {
        signal,
        userIdJoinBefore,
        userIdJoinLater,
      });
    });

    peer.on("close", () => {
      console.log("peer close on create room");
    });
    peer.on("connect", () => {
      console.log("CONNECT");
    });

    return peer;
  }

  // join before will call this
  const addPeer = (userIdJoinBefore, userIdJoinLater) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: streamRef.current,
    });

    peer.on("error", (err) => console.log("error", err));
    peer.on("signal", (signal) => {
      callSocket.emit("send_signal_to_join_later", {
        signal,
        userIdJoinBefore,
        userIdJoinLater,
      });
    });

    return peer;
  };

  const handleCallAgain = () => {
    // TODO
  };

  const handleClose = () => {
    setTimeout(function () {
      navigate(location?.state?.prevPath || "/");
    }, 1000);
  };

  const toggleSettings = (key) => {
    setBtnsStatus((prev) => ({
      ...prev,
      [key]: prev[key] === "on" ? "off" : "on",
    }));
    if (key === "video") toggleCam(currentUserVideoRef.current);
    if (key === "audio") toggleAudio(currentUserVideoRef.current);
  };

  function checkAccess(startVideo) {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert("Browser not support");
    } else {
      navigator.mediaDevices
        .getUserMedia(defaultSettings)
        .then((stream) => {
          startVideo(stream);
        })
        .then(() => {
          return new Promise((resolve) => {
            currentUserVideoRef.current.onloadedmetadata = resolve;
          });
        })
        .catch((error) => {
          console.log(error);
          if (error.toString() === "NotAllowedError: Permission denied") {
            setDevicesAccess({
              video: false,
              audio: false,
            });
          }
        });
    }
  }

  function checkDeviceSupport(checkAccess, startVideo) {
    // check browser supports api
    if (!navigator?.mediaDevices || !navigator.mediaDevices?.enumerateDevices) {
      alert("Browser not support mediaDevices");
    } else {
      // check devices
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            //
          });

          // check access
          checkAccess(startVideo);
        })
        .catch((err) => {
          dispatch(
            showSnackbar({
              severity: "error",
              message: "No micro or camera found",
            })
          );
          console.error(`${err.name}: ${err.message}`);
        });
    }
  }

  const startVideo = (stream) => {
    streamRef.current = stream;
    currentUserVideoRef.current.srcObject = stream;

    callSocket.emit("join_room", { roomId });

    callSocket.on("make_peer_to_other_user", (otherUserIdsInRoom) => {
      userIdsJoinBeforeRef.current = otherUserIdsInRoom.map(
        (userObj) => userObj.userId
      );

      // defined which one offer call: isUserJoinLater will be initiator
      const isCreatorRoom = !otherUserIdsInRoom.length;
      const isUserJoinLater = otherUserIdsInRoom.length;

      // creator of room send invitation to other user in cvs
      if (isCreatorRoom) {
        handleInviteOtherUser(otherUserIdsInCvs);
      }

      // isUserJoinLater create peer for every userIdJoinBefore, and send signal to join before (comment stupid but it visually look good)
      const peerObjs = userIdsJoinBeforeRef.current.map((userIdJoinBefore) => {
        const peer = createPeerAndSendSignal(
          isUserJoinLater,
          userIdJoinBefore,
          userId
        );

        const newPeerObj = {
          userIdOfOtherSide: userIdJoinBefore,
          peer,
        };
        peerObjsRef.current.push(newPeerObj);
        return newPeerObj;
      });

      setPeerObjs(peerObjs);
    });

    // join before will get it
    callSocket.on("signal_of_join_later", (data) => {
      const { signal: joinLaterSignal, userIdJoinLater } = data;
      const peer = addPeer(userId, userIdJoinLater);
      const newPeerObj = {
        userIdOfOtherSide: userIdJoinLater,
        peer,
      };
      peerObjsRef.current.push(newPeerObj);
      setPeerObjs((prev) => [...prev, newPeerObj]);
      // not until video element was add to DOM that peer of join before answer peer of join after
      setWaitForVideoElement({
        isWait: true,
        userIdOfOtherSide: userIdJoinLater,
        signal: joinLaterSignal,
      });
    });

    // join later will get it
    callSocket.on("signal_of_join_before", (data) => {
      const { signal: joinLaterBefore, userIdJoinBefore } = data;
      const foundPeerObj = peerObjsRef.current.find(
        (peerObjs) => peerObjs.userIdOfOtherSide === userIdJoinBefore
      );
      foundPeerObj.peer.signal(joinLaterBefore);
    });

    callSocket.on("a_user_leave_room", (data) => {
      handleUserLeave(data.userId);
    });
  };

  useEffect(() => {
    if (!callSocket.connected) {
      callInstance.connect(userId, roomId);
    }

    callSocket.on("connect", () => {
      console.log("callSocket connect");
    });

    socket.on("decline_invite", (data) => {
      const { roomId: roomIdOfInvitation } = data;
      if (roomIdOfInvitation === roomId) {
        handleInvitationDenied();
      }
    });

    if (
      isFirstMount.current === false ||
      process.env.NODE_ENV !== "development"
    ) {
      checkDeviceSupport(checkAccess, startVideo);
    }

    return () => {
      isFirstMount.current = false;
      callSocket.off("make_peer_to_other_user");
      callSocket.off("signal_of_join_later");
      callSocket.off("signal_of_join_before");
      socket.off("decline_invite");
      callSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (numOfUserJoin >= 1) {
      setBtnsStatus({ video: "on", audio: "on" });
      setCallStatus("calling");
    }
    numOfUserJoinRef.current = numOfUserJoin;
  }, [numOfUserJoin]);

  useEffect(() => {
    const { isWait, signal, userIdOfOtherSide } = waitForVideoElement;
    if (isWait && signal && userIdOfOtherSide) {
      const foundPeerObj = peerObjs.find(
        (peerObjs) => peerObjs.userIdOfOtherSide === userIdOfOtherSide
      );
      foundPeerObj.peer.signal(signal);
      setWaitForVideoElement({
        isWait: false,
        signal: null,
        userIdOfOtherSide: null,
      });
    }
  }, [waitForVideoElement]);

  let content;
  if (!devicesAccess.video || !devicesAccess.audio) {
    content = (
      <Stack spacing={1} alignItems={"center"} justifyContent={"center"}>
        <Stack spacing={1} direction={"row"} alignItems="center">
          <CameraSlash
            display={devicesAccess.video}
            color={"#8383838a"}
            size={32}
          />
          <MicrophoneSlash
            display={devicesAccess.audio}
            color={"#8383838a"}
            size={32}
          />
        </Stack>

        <Typography sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
          You have not allowed to access your camera and microphone.
        </Typography>
        <Typography>
          Allow to use your camera and microphone so call participants can see
          and hear you. You can turn this permission off later.
        </Typography>
      </Stack>
    );
  } else if (callStatus === "callOff" || callStatus === "callDenied") {
    content = (
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          right: 0,
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack alignItems={"center"} spacing={1}>
          <Avatar
            alt={otherUserIdsInCvs[0]}
            src={faker.image.avatar()}
            sx={{
              width: "100px",
              height: "100px",
            }}
          />
          <Typography sx={{ color: "white" }}>
            {callStatus === "callOff" ? "Call off" : "Callee not answer"}
          </Typography>
        </Stack>

        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            position: "absolute",
            bottom: "50px",
            right: "50%",
            transform: "translateX(50%)",
          }}
        >
          <Stack spacing={1} alignItems="center" justifyContent="center">
            <IconButton
              sx={{ backgroundColor: "green" }}
              onClick={handleCallAgain}
            >
              <VideoCamera color="#fff" size={32} />
            </IconButton>
            <Typography color="#fff">Call again</Typography>
          </Stack>
          <Stack spacing={1} alignItems="center" justifyContent="center">
            <IconButton
              sx={{ backgroundColor: "#333333a8" }}
              onClick={handleClose}
            >
              <X color="#fff" size={32} />
            </IconButton>
            <Typography color="#fff">Close</Typography>
          </Stack>
        </Stack>
      </Box>
    );
  } else {
    content = (
      <>
        {/* other user video  */}

        <Box
          sx={{
            backgroundColor: "#000000",
            position: "absolute",
            bottom: 0,
            right: 0,
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <>
            <Stack
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: callStatus === "waiting" ? "flex" : "none",
              }}
              alignItems={"center"}
              spacing={1}
            >
              <Avatar
                alt={otherUserIdsInCvs[0]}
                src={faker.image.avatar()}
                sx={{
                  width: "100px",
                  height: "100px",
                }}
              />
              <Typography sx={{ color: "white" }}>Calling...</Typography>
            </Stack>
            {/* video element must avaible before signal change*/}
            {peerObjs.map((peerObj, i) => {
              return (
                <Video
                  peer={peerObj.peer}
                  key={i}
                  numOfUserJoin={numOfUserJoin}
                  setNumOfUserJoin={setNumOfUserJoin}
                />
              );
            })}
            {/* : null} */}
          </>
        </Box>

        {/* my video  */}

        <Box
          sx={{
            backgroundColor: "#000000",
            p: "10px",
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "320px",
            borderRadius: "16px",
          }}
        >
          <video
            width="100%  !important"
            height="auto  !important"
            style={{
              display: "block",
              borderRadius: "10px",
            }}
            playsInline
            autoPlay
            muted
            // autoplay: make media begin to play without the user specifically requesting that playback begin
            // includes both autoplay attribute and use of JavaScript code: play()
            // Autoplay blocking is not applied to <video> elements
            // when the source media does NOT have an audio track, or if the audio track is MUTED
            // so SET VIDEO MUTED at settings to make user turn on it on their own
            // It is strongly recommended that you use the autoplay attribute whenever possible, than for other means of playing media automatically.
            ref={currentUserVideoRef}
          />
        </Box>

        {/* control btn */}
        <Stack
          direction={"row"}
          spacing={2}
          alignItems={"center"}
          justifyContent={"center"}
          sx={{
            position: "absolute",
            bottom: "50px",
            right: "50%",
            transform: "translateX(50%)",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Stack
              direction={"row"}
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <CamBtn {...{ btnsStatus, toggleSettings }} />
              <AudioBtn {...{ btnsStatus, toggleSettings }} />
              <IconButton
                sx={{ backgroundColor: "red" }}
                onClick={handleCallOff}
              >
                <PhoneSlash color="#fff" size={32} />
              </IconButton>
            </Stack>
          </Stack>
        </Stack>
      </>
    );
  }

  return content;
}

export default CallRoom;
