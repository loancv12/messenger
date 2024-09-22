import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useAuth from "../../../hooks/useAuth";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { fetchFriendRequests } from "../../../redux/relationShip/relationShipApi";
import { selectFriendRequests } from "../../../redux/relationShip/relationShipSlice";
import instance from "../../../socket";
import { FriendReqElement } from "../relationShipElement";

const FriendReqs = () => {
  const friendRequests = useSelector(selectFriendRequests);
  const socket = instance.getSocket();
  const { userId } = useAuth();

  const { callAction, isLoading, isError, error } = useAxiosPrivate();
  const isFirstMount = useRef(true);

  const handleAccept = (id) => {
    socket.emit("accept_friend_req", { requestId: id });
  };

  const handleDecline = (id) => {
    socket.emit("decline_friend_req", { requestId: id });
  };

  const handleWithdrawReq = (id) => {
    socket.emit("withdraw_friend_req", { requestId: id });
  };

  useEffect(() => {
    const fetchFriendReq = async () => {
      console.log("run fetch frined");
      await callAction(fetchFriendRequests());
    };
    if (!isFirstMount.current || process.env.NODE_ENV !== "development") {
      fetchFriendReq();
    }
    return () => {
      isFirstMount.current = false;
    };
  }, []);

  return (
    <Box p={1}>
      {friendRequests.length ? (
        friendRequests.map((request, i) => {
          const isSender = request.sender.id === userId;
          const otherUser = isSender ? request.recipient : request.sender;
          return (
            <FriendReqElement
              key={request.id}
              {...otherUser}
              isSender={isSender}
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
