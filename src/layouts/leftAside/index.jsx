import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { selectShowCvsComp } from "../../redux/app/appSlice";

const LeftAsideLayout = (props) => {
  const theme = useTheme();
  const sidebar = useSelector((state) => state.app.sidebar);
  const showCvsComp = useSelector(selectShowCvsComp);
  const [leftAside, mainContent, rightAside] = props.children;
  const isShowRightAside = props.isShowRightAside;

  return (
    <Stack direction="row" sx={{ width: "100%" }}>
      {/* Part1 :
       */}
      <Box
        sx={{
          position: "relative",
          display: {
            xs: !showCvsComp ? "block" : "none",
            md: "block",
          },
          width: {
            xs: !showCvsComp ? "100vw" : "0",
            md: "320px",
          },
          height: {
            xs: !showCvsComp ? "100vh" : "0",
            md: "100%",
          },
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8F8F8"
              : theme.palette.background.paper,
          boxShadow: "0 0 2px rgba(0,0,0,.25) ",
        }}
      >
        {leftAside}
      </Box>
      <Stack
        sx={{
          display: {
            xs: showCvsComp ? "flex" : "none",
            md: "flex",
          },
        }}
        direction="row"
      >
        {/* Part2 */}
        <Box
          sx={{
            height: "100%",

            display: {
              xs: sidebar.open ? "none" : "block",
              sm: "block",
            },
            width: {
              xs: sidebar.open ? "0" : "100vw",
              sm: "100vw",
              md: sidebar.open ? "calc(100vw - 740px)" : "calc(100vw - 420px)",
            },
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F0F4F4"
                : theme.palette.background.default,
          }}
        >
          {mainContent}
        </Box>
        {/* Part3 */}
        <Box
          sx={{
            height: "100vh",
            flexGrow: 1,
            display: isShowRightAside ? "block" : "none",
            position: {
              xs: "unset",
              sm: "fixed",
              md: "unset",
            },
            top: 0,
            right: 0,
            zIndex: 2,
            width: {
              xs: "100vw",
              sm: "320px",
            },
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F0F4F4"
                : theme.palette.background.default,
            boxShadow: "0 0 2px rgba(0, 0, 0, .25)",
          }}
        >
          {rightAside}
        </Box>
      </Stack>
    </Stack>
  );
};

export default LeftAsideLayout;
