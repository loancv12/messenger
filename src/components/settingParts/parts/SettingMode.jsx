import { Box, IconButton, RadioGroup, Stack } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { Moon, Sun } from "phosphor-react";
import useSettings from "../../../hooks/useSettings";
import BoxMask from "./BoxMask";

export default function SettingMode() {
  const theme = useTheme();

  const { themeMode, onChangeMode } = useSettings();

  return (
    <RadioGroup name="themeMode" value={themeMode} onChange={onChangeMode}>
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        {["light", "dark"].map((mode, index) => {
          const isSelected = themeMode === mode;
          return (
            <Box key={index}>
              <IconButton
                sx={{
                  ...(isSelected && {
                    // bgcolor: `${theme.palette.background.paper}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    border: `solid 2px ${theme.palette.primary.main}`,
                  }),
                }}
              >
                {index === 0 ? <Sun size={32} /> : <Moon size={32} />}
                <BoxMask value={mode} />
              </IconButton>
            </Box>
          );
        })}
      </Stack>
    </RadioGroup>
  );
}
