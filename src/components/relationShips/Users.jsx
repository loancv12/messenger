import { useDispatch, useSelector } from "react-redux";
import { UserElement } from "../relationShipElement";
import { useContext, useEffect, useState } from "react";
import { fetchUsers } from "../../redux/relationShip/relationShipApi";
// import { socket } from "../../socket";
import { Box, Typography } from "@mui/material";
import { SocketContext } from "../../contexts/SocketProvider";
import { selectUsers } from "../../redux/relationShip/relationShipSlice";
import useAuth from "../../hooks/useAuth";

const Users = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const users = useSelector(selectUsers);
  const socket = useContext(SocketContext);

  const handleSendReq = (id) => {
    socket.emit("make_friend_request", { to: id, from: userId });
  };

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  return (
    <Box p={1}>
      {users.length ? (
        users?.map((user, i) => {
          return (
            <UserElement handleSendReq={handleSendReq} key={i} {...user} />
          );
        })
      ) : (
        <Typography>
          You already send friend invitation to all user as possible
        </Typography>
      )}
    </Box>
  );
};

export default Users;
