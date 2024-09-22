import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import useSettings from "../hooks/useSettings.js";

export default function ThemeProvider({ children }) {
  const { themeMode } = useSettings();

  const theme = createTheme({
    palette: {
      mode: themeMode,
    },
  });

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
