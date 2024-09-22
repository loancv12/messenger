import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import React from "react";
import useSettings from "../../hooks/useSettings";

export default function ThemeColorPresets({ children }) {
  const defaultTheme = useTheme();

  const { setColor } = useSettings();

  const themeOptions = {
    ...defaultTheme,
    palette: {
      ...defaultTheme.palette,
      primary: setColor,
    },
  };

  const theme = createTheme(themeOptions);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
