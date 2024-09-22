import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import useLocales from "../../../hooks/useLocales";
import toCamelCase from "../../../utils/toCamelCase";

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
  const { translate } = useLocales();

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
              {translate(`directCvs.${toCamelCase("Withdraw request")}`)}
            </Button>
          ) : (
            <>
              <Button onClick={() => handleDecline(id)}>
                {translate(`directCvs.${toCamelCase("Decline")}`)}
              </Button>
              <Button onClick={() => handleAccept(id)}>
                {translate(`directCvs.${toCamelCase("Accept")}`)}
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default FriendReqElement;
