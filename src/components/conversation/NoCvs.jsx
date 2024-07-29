import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import NoChatSVG from "../../assets/Illistration/NoChat";
import { ChatsCircle } from "phosphor-react";
import toCamelCase from "../../utils/toCamelCase";
import { updateShowCvsComp } from "../../redux/app/appSlice";
import { useDispatch } from "react-redux";
import useLocales from "../../hooks/useLocales";

const NoCvs = () => {
  const dispatch = useDispatch();
  const { translate } = useLocales();

  return (
    <Stack
      spacing={2}
      sx={{ height: "100%", width: "100%" }}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <NoChatSVG />
      <Button
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
        }}
        endIcon={<ChatsCircle size={32} />}
        onClick={() => dispatch(updateShowCvsComp({ open: false }))}
      >
        {translate(`conversation.${toCamelCase("Start Chat")}`)}
      </Button>
      <Typography
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
        }}
        variant="subtitle2"
      >
        {translate(`conversation.${toCamelCase("Start Chat")}`)}
      </Typography>
    </Stack>
  );
};

export default NoCvs;
