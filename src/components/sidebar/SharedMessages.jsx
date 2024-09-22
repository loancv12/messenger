import {
  Box,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateSidebar } from "../../redux/app/appSlice";

const SharedMessages = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    console.log("SharedMessages", newValue);
    setValue(newValue);
  };
  return (
    <Box width={320} height="100vh">
      <Stack height={"100%"} width={"100%"}>
        {/* Header */}
        <Box
          sx={{
            boxShadow: "0 0 2px rgba(0,0,0,.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "F8F8F8"
                : theme.palette.background.paper,
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"center"}
            height={"100%"}
            p={2}
            spacing={2}
          >
            <IconButton
              onClick={() => {
                dispatch(updateSidebar({ type: "CONTACT" }));
              }}
            >
              <CaretLeft />
            </IconButton>
            <Typography>Shared Messages</Typography>
          </Stack>
        </Box>
        {/* Body */}
        <Tabs
          sx={{ px: 2, pt: 2 }}
          value={value}
          onChange={handleChange}
          centered
        >
          <Tab label="Media" />
          <Tab label="Links" />
          <Tab label="Docs" />
        </Tabs>
        <Stack
          p={3}
          spacing={2}
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          {(() => {
            switch (value) {
              case 0:
                // Imgeas
                return <div>TODO Imgeas</div>;
              case 1:
                // Links
                return <div>TODO Links</div>;
              case 2:
                // Docs
                return <div>TODO Docs</div>;

              default:
                break;
            }
          })()}
        </Stack>
      </Stack>
    </Box>
  );
};

export default SharedMessages;
