import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { createTheme, ThemeProvider, useTheme } from "@mui/material";
import React, { useEffect } from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import useSettings from "../../hooks/useSettings";

export default function ThemeRtlLayout({ children }) {
  const prevTheme = useTheme();
  const { themeDirection } = useSettings();

  const themeOptions = {
    ...prevTheme,
    direction: themeDirection,
  };

  const theme = createTheme(themeOptions);

  useEffect(() => {
    document.dir = themeDirection;
  }, [themeDirection]);

  const rtlCache = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });

  const ltrCache = createCache({
    key: "mui",
  });

  return (
    <CacheProvider value={themeDirection === "rtl" ? rtlCache : ltrCache}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}
