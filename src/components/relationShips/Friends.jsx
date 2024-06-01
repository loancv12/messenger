import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../redux/relationShip/relationShipApi";
import { FriendElement } from "../relationShipElement";
import { Box, Typography } from "@mui/material";
import { selectFriends } from "../../redux/relationShip/relationShipSlice";
import { SocketContext } from "../../contexts/SocketProvider";

const Friends = ({ handleClose }) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const userId = localStorage.getItem("userId");
  const friends = useSelector(selectFriends);

  const handleStartCvs = (id) => {
    socket.emit("start_conversation", { to: id, from: userId });
  };

  useEffect(() => {
    dispatch(fetchFriends());
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
