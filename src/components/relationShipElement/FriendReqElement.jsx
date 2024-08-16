import React, { useContext, useState } from "react";
import {
  Box,
  Badge,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Button,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import StyledBadge from "../common/StyledBadge";

const FriendReqElement = ({
  img,
  firstName,
  lastName,
  isSender,
  id,
  handleAccept,
  handleDecline,
  handleWithdrawReq,
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
          <Avatar alt={name} src={img} />
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          {isSender ? (
            <Button
              onClick={() => {
                handleWithdrawReq(id);
              }}
            >
              Withdraw request
            </Button>
          ) : (
            <>
              <Button onClick={() => handleDecline(id)}>Decline</Button>
              <Button onClick={() => handleAccept(id)}>Accept</Button>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default FriendReqElement;
