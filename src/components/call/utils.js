export function showCallContent(videoElem, stream) {
  console.log(videoElem, stream);

  videoElem.srcObject = stream;
  videoElem.play();
}

// stop both mic and camera
export function stopStreamedVideo(videoElem) {
  const stream = videoElem.srcObject;
  console.log("stopStreamedVideo", stream);
  const tracks = stream.getTracks();
  console.log("stopStreamedVideo tracks", tracks);

  tracks?.forEach((track) => {
    track.enabled = false;
    track.stop();
  });

  videoElem.srcObject = null;
  // videoElem.load();
}

export function toggleCam(videoElem) {
  const stream = videoElem.srcObject;
  const tracks = stream.getVideoTracks();
  console.log("toggleCam be", tracks);

  tracks.forEach((track) => {
    if (track.kind === "video") {
      track.enabled = !track.enabled;
    }
  });
  console.log("toggleCam af", tracks);
}

export function toggleAudio(videoElem) {
  const stream = videoElem.srcObject;
  const tracks = stream.getAudioTracks();
  console.log("toggleAudio be", tracks);
  tracks.forEach((track) => {
    if (track.kind === "audio") {
      track.enabled = !track.enabled;
    }
  });
  console.log("toggleAudio af", tracks);
}

// sender create many peer, each peer connect to one receiver,
// callSocket.on(
//   "make_peer_to_other_socket",
//   (otherSocketIdsInThisRoom, socketIdOfSender) => {
//     console.log(
//       "make_peer_to_other_socket",
//       otherSocketIdsInThisRoom,
//       socketIdOfSender
//     );
//     if (!otherSocketIdsInThisRoom.length) {
//       socket.emit("make_invite_call", {
//         roomId,
//         senderId: userId,
//         otherUserIdsInCvs,
//       });
//     }

//     const peerObjs = [];
//     otherSocketIdsInThisRoom.forEach((socketId) => {
//       const peer = createPeerAndSendSignalToReceiver(
//         socketId,
//         socketIdOfSender,
//         streamRef
//       );
//       peerObjsRef.current.push({
//         socketIdOfOtherSide: socketId,
//         peer,
//       });
//       peerObjs.push({
//         socketIdOfOtherSide: socketId,
//         peer,
//       });
//     });

//     console.log("peerObjs", peerObjs);
//     setPeerObjs(peerObjs);
//   }
// );

// Receiver receive signal of sender
// callSocket.on("signal_of_sender", (data) => {
//   console.log("Receiver receive signal of sender", data);
//   const { signal, socketIdOfSender } = data;
//   // const peer = sayHiToSenderAndAskSenderSayHi(
//   //   signal,
//   //   socketIdOfSender,
//   //   streamRef
//   // );

//   // add peer of sender to peer list
//   peerObjsRef.current.push({
//     socketIdOfOtherSide: socketIdOfSender,
//     peer,
//   });

//   const peerObj = {
//     socketIdOfOtherSide: socketIdOfSender,
//     peer,
//   };
//   setPeerObjs((peerObjs) => [...peerObjs, peerObj]);
// });

// // Sender will receive receiver's signal and say "hi" to receiver
// callSocket.on("signal_of_receiver", (data) => {
//   console.log(
//     "Sender will receive receiver's signal and say  to receive",
//     data
//   );

//   const { signal, socketIdOfReceiver } = data;
//   const peerObj = peerObjsRef.current.find(
//     (p) => p.socketIdOfOtherSide === socketIdOfReceiver
//   );
//   sayHiToReceiver(peerObj.peer, signal, streamRef);
// });

// callSocket.on("user_left", (userLeftSocketId) => {
//   console.log("user_left", userLeftSocketId);

//   const foundPeerObj = peerObjsRef.current.find((peerObj) => {
//     peerObj.socketIdOfOtherSide === userLeftSocketId;
//   });

//   if (foundPeerObj) {
//     foundPeerObj.peer.destroy();
//   }

//   const otherPeerObjs = peerObjsRef.current.filter(
//     (peerObj) => peerObj.socketIdOfOtherSide !== userLeftSocketId
//   );
//   peerObjsRef.current = otherPeerObjs;
//   setPeerObjs(otherPeerObjs);
// });

// function createPeerAndSendSignalToReceiver(
//   socketIdOfReceiver,
//   socketIdOfSender,
//   streamRef
// ) {
//   console.log("steam of Sender", streamRef);

//   const peer = new Peer({
//     initiator: true, // set to true if this is the initiating peer
//     trickle: false, // disable trickle ICE and get a single 'signal' event (slower)
//     stream: streamRef.current, // if video/voice is desired, pass stream returned from getUserMedia
//     // offerOptions: {
//     //   offerToReceiveAudio: true,
//     //   offerToReceiveVideo: true,
//     // },
//   });

//   // creator create room=> no peer created // peer steam not fired
//   // second join=> create peer , init: true, steam=> yeah stream
//   // creator receive signal=> create peer: init: false, steam=> co
//   // .. offer second
//   // .. second answer creator,

//   peer.on("signal", (signal) => {
//     // ok, so sender create many peer (peer of sender) and use socket to emit it to client of socketIdOfReceiver
//     callSocket.emit("sending_signal_to_receiver", {
//       socketIdOfReceiver,
//       socketIdOfSender,
//       signal: JSON.stringify(signal),
//     });
//   });

//   // peer.on("close", () => {
//   //   console.log("peer closed");
//   //   callSocket.off("signal_of_receiver");
//   // });

//   return peer;
// }

//  when receiver receive sender's signal,
//  function sayHiToSenderAndAskSenderSayHi(
//    incomingSignal,
//    socketIdOfSender,
//    streamRef
//  ) {
//    console.log("receiver steam", streamRef);
//    const peer = new Peer({
//      initiator: false,
//      trickle: false,
//      // answerOptions: {
//      //   offerToReceiveAudio: false,
//      //   offerToReceiveVideo: false,
//      // },
//      stream: streamRef.current,
//    });

//    // again, receiver send its signal to sender, when peer of sender say hi, a connection was establish
//    peer.on("signal", (signal) => {
//      callSocket.emit("ask_sender_say_hi", {
//        signal,
//        socketIdOfSender,
//      });
//    });

//    peer.on("stream", (stream) => {
//      // got remote video stream, now let's show it in a video tag
//      showCallContent(otherUserVideoRef.current, stream);
//    });

//    // peer.on("close", () => {
//    //   console.log("peer closed");
//    //   callSocket.off("signal_of_sender");
//    // });

//    // receiver say hi to sender by call peer.signal(sender's signal)
//    // peer.addStream(streamRef.current);
//    peer.signal(incomingSignal);

//    return peer;
//  }

// when sender receive signal of receiver
// function sayHiToReceiver(peer, signal, streamRef) {
//   // peer.addStream(streamRef.current);
//   peer.signal(signal);
// }
