import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Bell,
  CaretRight,
  Image,
  Info,
  Key,
  Keyboard,
  Lock,
  Note,
  PencilCircle,
} from "phosphor-react";
import React, { useState } from "react";
import useLocales from "../../../hooks/useLocales";
import toCamelCase from "../../../utils/toCamelCase";

const Setting_Opts = [
  {
    key: 0,
    icon: <Bell size={20} />,
    title: "Notifications",
  },
  {
    key: 1,
    icon: <Lock size={20} />,
    title: "Privacy",
  },
  {
    key: 2,
    icon: <Key size={20} />,
    title: "Security",
  },
  {
    key: 3,
    icon: <PencilCircle size={20} />,
    title: "Theme",
  },
  {
    key: 4,
    icon: <Image size={20} />,
    title: "Chat Wallpaper",
  },
  {
    key: 5,
    icon: <Note size={20} />,
    title: "Request Account Info",
  },
  {
    key: 6,
    icon: <Keyboard size={20} />,
    title: "Keyboard Shortcuts",
  },
  {
    key: 7,
    icon: <Info size={20} />,
    title: "Help",
  },
];

const LeftPanel = ({ handleSelect }) => {
  const theme = useTheme();
  const { translate } = useLocales();

  return (
    <Box
      sx={{
        width: 320,
        height: "100vh",
        overflow: "auto",
        boxShadow: "0 0 2px rgba(0,0,0,.25)",
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8F8F8"
            : theme.palette.background.paper,
      }}
    >
      <Stack spacing={5} p={2}>
        {/* Header */}
        <Stack
          direction="row"
          alignItems={"center"}
          spacing={2}
          justifyContent={{ xs: "flex-end", md: "unset" }}
        >
          <Typography variant="h6">{translate(`settings.settings`)}</Typography>
        </Stack>

        {/* List option */}
        <Stack spacing={3}>
          {Setting_Opts.map((option) => {
            const { key, icon, title } = option;
            return (
              <Box key={key}>
                <Stack
                  spacing={2}
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleSelect(key)}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    {icon}
                    <Typography variant="body2">
                      {translate(`settings.settingOpts.${toCamelCase(title)}`)}
                    </Typography>
                  </Stack>
                  {key !== Setting_Opts.length - 1 && <Divider />}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
};

export default LeftPanel;
