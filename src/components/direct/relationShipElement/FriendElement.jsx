import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Chat } from "phosphor-react";
import React from "react";
import StyledBadge from "../../common/StyledBadge";

const FriendElement = ({
  img,
  firstName,
  lastName,
  online,
  id,
  handleClose,
  handleStartCvs,
}) => {
  const theme = useTheme();

  const name = `${firstName} ${lastName}`;

  return (
    <Box
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {" "}
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={img} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={img} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton
            onClick={() => {
              handleStartCvs(id);
              handleClose();
            }}
          >
            <Chat />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default FriendElement;
