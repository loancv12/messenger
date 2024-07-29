import { useTheme } from "@emotion/react";
import { Box, Skeleton, Stack } from "@mui/material";
import React from "react";

const ChatSkeleton = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 1,
        backgroundColor:
          theme.palette.mode === "light"
            ? "#fff"
            : theme.palette.background.default,
        "&:hover": {
          cursor: "pointer",
        },
      }}
      p={1}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction={"row"} spacing={2}>
          {/* avatar */}
          <Skeleton variant="circular" width={40} height={40} />

          {/* name and msg and time*/}
          <Skeleton variant="rounded" width={200} height={54} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatSkeleton;
