import React from "react";
import useLocales from "../../../hooks/useLocales";
import useSettings from "../../../hooks/useSettings";
import {
  Box,
  CardActionArea,
  Grid,
  RadioGroup,
  alpha,
  styled,
  useTheme,
} from "@mui/material";
import { FlagIcon } from "../../../assets/icons";
import BoxMask from "./BoxMask";

const BoxStyle = styled(CardActionArea)(({ theme }) => ({
  height: 48,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.disabled,
  border: `solid 1px ${theme.palette.grey[500_12]}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.25,
}));

const SettingLanguage = () => {
  const theme = useTheme();
  const { onChangeLang, currentLang, allLangs } = useLocales();
  return (
    <RadioGroup name="currentLang" value={currentLang} onChange={onChangeLang}>
      <Grid dir="ltr" container spacing={1.5}>
        {allLangs.map((lang, i) => {
          const { label, icon, value } = lang;
          const isSelected = value === currentLang.value;
          return (
            <Grid key={i} item xs={3}>
              <BoxStyle
                sx={{
                  ...(isSelected && {
                    // bgcolor: `${theme.palette.background.paper}`,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    border: `solid 2px ${theme.palette.primary.main}`,
                    boxShadow: `inset 0 4px 8px 0 ${alpha(
                      theme.palette.primary.main,
                      0.24
                    )}`,
                  }),
                }}
              >
                <BoxMask value={value} />
                <FlagIcon type={value} />
              </BoxStyle>
            </Grid>
          );
        })}
      </Grid>
    </RadioGroup>
  );
};

export default SettingLanguage;
