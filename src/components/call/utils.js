export function showCallContent(videoElem, stream) {
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
