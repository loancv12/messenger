import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { fetchUsers } from "../../../redux/relationShip/relationShipApi";
import { selectUsers } from "../../../redux/relationShip/relationShipSlice";
import instance from "../../../socket";
import { UserElement } from "../relationShipElement";

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
