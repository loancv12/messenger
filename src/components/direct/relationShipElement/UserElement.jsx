import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import useLocales from "../../../hooks/useLocales";
import toCamelCase from "../../../utils/toCamelCase";
import StyledBadge from "../../common/StyledBadge";

const UserElement = ({
  img,
  firstName,
  lastName,
  online,
  id,
  handleSendReq,
}) => {
  const { translate } = useLocales();
  const theme = useTheme();

  console.log(translate(`directCvs.${toCamelCase("decline")}`));

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
          <Button onClick={() => handleSendReq(id)}>
            {translate(`directCvs.${toCamelCase("Send Request")}`)}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default UserElement;
