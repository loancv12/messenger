import { useDispatch, useSelector } from "react-redux";
import { UserElement } from "../relationShipElement";
import { useContext, useEffect, useRef, useState } from "react";
import { fetchUsers } from "../../redux/relationShip/relationShipApi";
// import { socket } from "../../socket";
import { Box, Typography } from "@mui/material";
import { selectUsers } from "../../redux/relationShip/relationShipSlice";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import instance from "../../socket";

const Users = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const users = useSelector(selectUsers);
  const socket = instance.getSocket();

  const handleSendReq = (recipientId) => {
    socket.emit("make_friend_request", { recipientId, senderId: userId });
  };

  const { callAction, isLoading, isError, error } = useAxiosPrivate();
  const isFirstMount = useRef(true);

  useEffect(() => {
    const fetchUs = async () => {
      await callAction(fetchUsers());
    };
    if (!isFirstMount.current || process.env.NODE_ENV !== "development") {
      fetchUs();
    }
    return () => {
      isFirstMount.current = false;
    };
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
