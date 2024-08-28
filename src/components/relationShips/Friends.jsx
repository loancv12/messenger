import { useContext, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../redux/relationShip/relationShipApi";
import { FriendElement } from "../relationShipElement";
import { Box, Typography } from "@mui/material";
import { selectFriends } from "../../redux/relationShip/relationShipSlice";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import instance from "../../socket";

const Friends = ({ handleClose }) => {
  const dispatch = useDispatch();
  const socket = instance.getSocket();
  const { userId } = useAuth();

  const friends = useSelector(selectFriends);

  const handleStartCvs = (id) => {
    socket.emit("start_conversation", { to: id, from: userId });
  };

  const { callAction, isLoading, isError, error } = useAxiosPrivate();
  const isFirstMount = useRef(true);

  useEffect(() => {
    const fetchFr = async () => {
      await callAction(fetchFriends());
    };
    if (!isFirstMount.current || process.env.NODE_ENV !== "development") {
      fetchFr();
    }

    return () => {
      isFirstMount.current = false;
    };
  }, []);

  return (
    <Box p={1}>
      {friends.length ? (
        friends.map((friend, i) => {
          return (
            <FriendElement
              handleClose={handleClose}
              handleStartCvs={handleStartCvs}
              key={i}
              {...friend}
            />
          );
        })
      ) : (
        <Typography>You dont have any friend</Typography>
      )}
    </Box>
  );
};

export default Friends;
