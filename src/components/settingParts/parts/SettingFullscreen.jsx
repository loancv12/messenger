import { useState } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import { Button } from "@mui/material";
//
import Iconify from "../../Iconify";
import toCamelCase from "../../../utils/toCamelCase";
import useLocales from "../../../hooks/useLocales";
import { ArrowsIn, CornersOut } from "phosphor-react";

// ----------------------------------------------------------------------

export default function SettingFullscreen() {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };
  const { translate } = useLocales();

  return (
    <Button
      fullWidth
      size="large"
      variant="outlined"
      color={fullscreen ? "primary" : "inherit"}
      startIcon={fullscreen ? <ArrowsIn size={32} /> : <CornersOut size={32} />}
      onClick={toggleFullScreen}
      sx={{
        fontSize: 14,
        ...(fullscreen && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity
            ),
        }),
      }}
    >
      {fullscreen
        ? translate(`settings.settingTheme.${toCamelCase("Exit Fullscreen")}`)
        : translate(`settings.settingTheme.${toCamelCase("Fullscreen")}`)}
    </Button>
  );
}
