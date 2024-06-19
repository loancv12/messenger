import { useDispatch, useSelector } from "react-redux";
import { fetchFriendRequests } from "../../redux/relationShip/relationShipApi";
import { useContext, useEffect } from "react";
// import { socket } from "../../socket";
import { FriendReqElement } from "../relationShipElement";
import { Box, Typography } from "@mui/material";
import { SocketContext } from "../../contexts/SocketProvider";
import { selectFriendRequests } from "../../redux/relationShip/relationShipSlice";
import useAuth from "../../hooks/useAuth";

const FriendReqs = () => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const friendRequests = useSelector(selectFriendRequests);
  const socket = useContext(SocketContext);

  useEffect(() => {
    dispatch(fetchFriendRequests());
  }, []);

  const handleAccept = (id) => {
    socket.emit("accept_friend_req", { requestId: id });
  };

  const handleDecline = (id) => {
    socket.emit("decline_friend_req", { requestId: id });
  };

  const handleWithdrawReq = (id) => {
    socket.emit("withdraw_friend_req", { requestId: id });
  };

  return (
    <Box p={1}>
      {friendRequests.length ? (
        friendRequests.map((request, i) => {
          return (
            <FriendReqElement
              key={i}
              {...request.user}
              isSender={request.isSender}
              id={request.id}
              handleAccept={handleAccept}
              handleDecline={handleDecline}
              handleWithdrawReq={handleWithdrawReq}
            />
          );
        })
      ) : (
        <Typography>You don't have any friend request</Typography>
      )}
    </Box>
  );
};

export default FriendReqs;
