import { Stack, Typography } from "@mui/material";
import Sidebar from "./Sidebar";
import { Navigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { axiosPrivate } from "../../services/axios/axiosClient";
import { setClientId } from "../../redux/app/appSlice";
import useAuth from "../../hooks/useAuth";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const isFirstMount = useRef(true);

  useEffect(() => {}, []);
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
