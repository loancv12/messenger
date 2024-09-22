import { Dialog, Stack, Tab, Tabs, useTheme } from "@mui/material";
import { useState } from "react";
import useLocales from "../../hooks/useLocales";
import toCamelCase from "../../utils/toCamelCase";
import CustomTabPanel from "../common/CustomTabPanel";
import FriendReqs from "./relationShips/FriendReqs";
import Friends from "./relationShips/Friends";
import Users from "./relationShips/Users";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const RelationShips = ({ open, handleClose }) => {
  const { translate } = useLocales();
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
            label={translate(`directCvs.${toCamelCase("Explore")}`)}
            {...a11yProps(0)}
          />
          <Tab
            sx={{ "&:focus": { outline: "none" } }}
            label={translate(`directCvs.${toCamelCase("Friends")}`)}
            {...a11yProps(1)}
          />
          <Tab
            sx={{ "&:focus": { outline: "none" } }}
            label={translate(`directCvs.${toCamelCase("Requests")}`)}
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
