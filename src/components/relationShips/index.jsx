import { Dialog, Stack, Tab, Tabs, useTheme } from "@mui/material";
import Users from "./Users";
import Friends from "./Friends";
import FriendReqs from "./FriendReqs";
import { useState } from "react";
import CustomTabPanel from "../CustomTabPanel";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const RelationShips = ({ open, handleClose }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = useTheme();
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      keepMounted
      sx={{
        p: 4,
      }}
    >
      <Stack sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab
            sx={{ "&:focus": { outline: "none" } }}
            label="Explore"
            {...a11yProps(0)}
          />
          <Tab
            sx={{ "&:focus": { outline: "none" } }}
            label="Friends"
            {...a11yProps(1)}
          />
          <Tab
            sx={{ "&:focus": { outline: "none" } }}
            label="Requests"
            {...a11yProps(2)}
          />
        </Tabs>
      </Stack>

      {/* Dialog Content */}
      <Stack sx={{ height: "100%" }}>
        <CustomTabPanel value={value} index={0}>
          <Users handleClose={handleClose} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Friends handleClose={handleClose} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <FriendReqs handleClose={handleClose} />
        </CustomTabPanel>
      </Stack>
      {/* </Stack> */}
    </Dialog>
  );
};

export default RelationShips;
