import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import React from "react";
import useLocales from "../../hooks/useLocales";

export default function ThemeLocalization({ children }) {
  const prevTheme = useTheme();

  const { currentLang } = useLocales();

  const theme = createTheme(prevTheme, currentLang.systemValue);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
