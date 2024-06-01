import {
  Divider,
  IconButton,
  Stack,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import React from "react";
import { AnimatePresence, m } from "framer-motion";
import cssStyles from "../../utils/cssStyles";
import { NAVBAR } from "../../config";
import Iconify from "../Iconify";
import Scrollbar from "../Scrollbar";
import useSettings from "../../hooks/useSettings";
import SettingDirection from "./parts/SettingDirection";
import SettingColorPresets from "./parts/SettingColorPresets";
import SettingFullscreen from "./parts/SettingFullscreen";
import SettingLanguage from "./parts/SettingLanguage";
import toCamelCase from "../../utils/toCamelCase";
import useLocales from "../../hooks/useLocales";
import SettingMode from "./parts/SettingMode";

const RootStyle = styled(m.div)(({ theme }) => ({
  ...cssStyles(theme).bgBlur({
    color: theme.palette.background.paper,
    opacity: 0.92,
  }),
  top: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  position: "fixed",
  overflow: "hidden",
  width: NAVBAR.BASE_WIDTH,
  flexDirection: "column",
  margin: theme.spacing(2),
  paddingBottom: theme.spacing(3),
  zIndex: theme.zIndex.drawer + 3,
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  boxShadow: `-24px 12px 32px -4px ${alpha(
    theme.palette.mode === "light"
      ? theme.palette.grey[500]
      : theme.palette.common.black,
    0.16
  )}`,
}));

const AdjustTheme = () => {
  const { onResetSetting } = useSettings();

  const { translate } = useLocales();
  return (
    <Stack sx={{ width: "100%" }}>
      {/* <RootStyle> */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={"space-between"}
        spacing={2}
        sx={{ py: 2, pr: 1, pl: 2.5 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="body2">Reset</Typography>
          <IconButton onClick={onResetSetting}>
            <Iconify icon={"ic:round-refresh"} width={20} height={20} />
          </IconButton>
        </Stack>
        <SettingMode />
      </Stack>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {translate(`settings.settingTheme.${toCamelCase("Direction")}`)}
          </Typography>
          <SettingDirection />
        </Stack>

        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {translate(`settings.settingTheme.${toCamelCase("Presets")}`)}
          </Typography>
          <SettingColorPresets />
        </Stack>
        <Stack spacing={1.5}>
          <Typography variant="subtitle2">
            {translate(`settings.settingTheme.${toCamelCase("Language")}`)}
          </Typography>
          <SettingLanguage />
        </Stack>

        <SettingFullscreen />
      </Stack>
    </Stack>
  );
};

export default AdjustTheme;
