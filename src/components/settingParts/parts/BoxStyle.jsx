import { CardActionArea, styled } from "@mui/material";

const BoxStyle = styled(CardActionArea, {
  shouldForwardProp: (prop) => prop !== "height",
  name: "BoxStyle",
})(({ theme, height = 48 }) => ({
  height,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.text.disabled,
  border: `solid 1px ${theme.palette.grey[500_12]}`,
  borderRadius: Number(theme.shape.borderRadius) * 1.25,
}));

export default BoxStyle;
