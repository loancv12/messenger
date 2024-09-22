import { Grid, RadioGroup } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { AlignLeft, AlignRight } from "phosphor-react";
import useSettings from "../../../hooks/useSettings";
import BoxMask from "./BoxMask";
import BoxStyle from "./BoxStyle";

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
                height={72}
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
