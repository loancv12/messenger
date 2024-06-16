// @mui
import { alpha, styled, useTheme } from "@mui/material/styles";
import { Grid, RadioGroup, CardActionArea } from "@mui/material";
// hooks
import useSettings from "../../../hooks/useSettings";
//
import BoxMask from "./BoxMask";
import { AlignLeft, AlignRight } from "phosphor-react";

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

export default function SettingDirection() {
  const { themeDirection, onChangeDirection } = useSettings();
  const theme = useTheme();

  return (
    <RadioGroup
      name="themeDirection"
      value={themeDirection}
      onChange={onChangeDirection}
    >
      <Grid dir="ltr" container spacing={2.5}>
        {["ltr", "rtl"].map((direction, index) => {
          const isSelected = themeDirection === direction;

          return (
            <Grid key={direction} item xs={6}>
              <BoxStyle
                sx={{
                  ...(isSelected && {
                    color: "primary.main",
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    border: `solid 2px ${theme.palette.primary.main}`,
                    boxShadow: `inset 0 4px 8px 0 ${alpha(
                      theme.palette.primary.main,
                      0.24
                    )}`,
                  }),
                }}
              >
                {index === 0 ? (
                  <AlignLeft size={28} />
                ) : (
                  <AlignRight size={28} />
                )}
                <BoxMask value={direction} />
              </BoxStyle>
            </Grid>
          );
        })}
      </Grid>
    </RadioGroup>
  );
}
