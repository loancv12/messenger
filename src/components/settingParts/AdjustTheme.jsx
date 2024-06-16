import {
  Divider,
  IconButton,
  Stack,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import React from "react";
import cssStyles from "../../utils/cssStyles";
import { NAVBAR } from "../../config";
import useSettings from "../../hooks/useSettings";
import SettingDirection from "./parts/SettingDirection";
import SettingColorPresets from "./parts/SettingColorPresets";
import SettingFullscreen from "./parts/SettingFullscreen";
import SettingLanguage from "./parts/SettingLanguage";
import toCamelCase from "../../utils/toCamelCase";
import useLocales from "../../hooks/useLocales";
import SettingMode from "./parts/SettingMode";
import { ArrowClockwise } from "phosphor-react";

const AdjustTheme = () => {
  const { onResetSetting } = useSettings();

  const { translate } = useLocales();
  return (
    <Stack sx={{ width: "100%" }}>
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
            <ArrowClockwise size={32} />
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
