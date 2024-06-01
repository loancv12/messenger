import { Stack, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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
