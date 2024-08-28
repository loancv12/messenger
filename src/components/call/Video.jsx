import { Box } from "@mui/material";
import { useEffect, useRef } from "react";

const Video = ({ peer, setNumOfUserJoin }) => {
  const ref = useRef();
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (
      isFirstMount.current === false ||
      process.env.NODE_ENV !== "development"
    ) {
      peer.on("stream", (stream) => {
        setNumOfUserJoin((prev) => prev + 1);
        ref.current.srcObject = stream;
      });
      peer.on("close", () => {
        console.log("peer close");
      });
      peer.on("end", () => {
        console.log("end close");
      });
    }
    return () => {
      isFirstMount.current = false;
    };
  }, []);

  return (
    <Box
      sx={{
        width: "100%",
        padding: "40px",
      }}
    >
      <video
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "100vw",
          maxHeight: "100vh",
        }}
        playsInline
        autoPlay
        ref={ref}
      />
    </Box>
  );
};

export default Video;
