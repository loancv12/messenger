import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <Stack
      sx={{
        overflowY: "scroll",
        /* Hide scrollbar for Chrome, Safari and Opera */
        "&::-webkit-scrollbar": {
          width: 0,
        },
        /* IE and Edge */
        scrollbarWidth: " none",
        /* Firefox */
        msOverflowStyle: "none",
      }}
      direction={"row"}
      height={"100%"}
    >
      <Sidebar />
      <Outlet />
    </Stack>
  );
};

export default DashboardLayout;
