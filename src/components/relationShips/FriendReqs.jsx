import { useDispatch, useSelector } from "react-redux";
import { fetchFriendRequests } from "../../redux/relationShip/relationShipApi";
import { useContext, useEffect, useRef } from "react";
// import { socket } from "../../socket";
import { FriendReqElement } from "../relationShipElement";
import { Box, Typography } from "@mui/material";
import { selectFriendRequests } from "../../redux/relationShip/relationShipSlice";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import instance from "../../socket";

const FriendReqs = () => {
  const friendRequests = useSelector(selectFriendRequests);
  const socket = instance.getSocket();

  const { callAction, isLoading, isError, error } = useAxios("FriendReqs");
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
