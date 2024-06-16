// @mui
import { alpha, styled, useTheme } from "@mui/material/styles";
import {
  Grid,
  RadioGroup,
  CardActionArea,
  Stack,
  Box,
  IconButton,
} from "@mui/material";
// hooks
import useSettings from "../../../hooks/useSettings";
import BoxMask from "./BoxMask";
import { Moon, Sun } from "phosphor-react";

// ----------------------------------------------------------------------

const BoxStyle = styled(CardActionArea)(({ theme }) => ({
  height: 72,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.disabled,
  border: `solid 1px ${theme.palette.grey[500_12]}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.25,
}));

// ----------------------------------------------------------------------

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
