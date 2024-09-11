export function showCallContent(videoElem, stream) {
  videoElem.srcObject = stream;
  videoElem.play();
}

// stop both mic and camera
export function stopStreamedVideo(videoElem) {
  const stream = videoElem.srcObject;
  const tracks = stream.getTracks();

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

  tracks.forEach((track) => {
    if (track.kind === "video") {
      track.enabled = !track.enabled;
    }
  });
}

export function toggleAudio(videoElem) {
  const stream = videoElem.srcObject;
  const tracks = stream.getAudioTracks();
  tracks.forEach((track) => {
    if (track.kind === "audio") {
      track.enabled = !track.enabled;
    }
  });
}
