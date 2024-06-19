import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showSnackbar } from "../redux/app/appSlice";
import {
  handleCreateGroupRet,
  handleJoinGroupReq,
  handleAcceptJoinGroup,
  startChat,
  handleNewMember,
} from "../redux/conversation/conversationSlice";
import {
  handleDeleteMsgRet,
  handleNewMessages,
} from "../redux/message/messageSlice";
import { BASE_URL } from "../config";
import { io } from "socket.io-client";
import {
  handleFriendReqAcceptedRet,
  handleFriendReqDeclineRet,
  handleNewFriendReq,
  handleSendReqRet,
  handleWithdrawFriendReqRet,
} from "../redux/relationShip/relationShipSlice";
import useAuth from "../hooks/useAuth";

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  const host = BASE_URL;
  const options = {
    autoConnect: false,
    query: `userId=${userId}`,
    retries: 15,
  };
  const socket = io(host, options);

  useEffect(() => {
    const onConnect = () => {
      console.log("connect to server", socket.id);
    };
    const onDisconnect = (reason, details) => {
      console.log("onDisconnect");
      if (socket.active) {
        // temporary disconnection, the socket will automatically try to reconnect
      } else {
        // the connection was forcefully closed by the server or the client itself
        // in that case, `socket.connect()` must be manually called in order to reconnect
        console.log(reason, socket);
      }
    };

    const onConnectError = (err) => {
      // the reason of the error, for example "xhr poll error"
      if (socket.active) {
        // temporary failure, the socket will automatically try to reconnect
      } else {
        // the connection was denied by the server
        // in that case, `socket.connect()` must be manually called in order to reconnect
        socket.connect();
      }
      dispatch(
        showSnackbar({
          severity: "error",
          message: err.message,
        })
      );
      console.log(err.message);
    };

    const onError = (reason) => {
      console.log("error event", reason);
      dispatch(
        showSnackbar({
          severity: "error",
          message: "Some thing wrong",
        })
      );
      console.log("active run scoone", socket.active);
      // socket.connect();
    };

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("connect_error", onConnectError);

    socket.on("error", onError);

    // user online
    socket.on("online", (userId) => {
      console.log(userId, "Is Online!"); // update online status
    });

    // user offline
    socket.on("offline", (userId) => {
      console.log(userId, "Is Offline!"); // update offline status
    });

    // only sender receive this
    socket.on("send_req_ret", (data) => {
      dispatch(handleSendReqRet(data));
    });

    // only recipient receive this
    socket.on("new_friend_req", (data) => {
      dispatch(handleNewFriendReq(data));
    });

    socket.on("friend_req_accepted_ret", (data) => {
      dispatch(handleFriendReqAcceptedRet(data));
    });
    socket.on("friend_req_decline_ret", (data) => {
      dispatch(handleFriendReqDeclineRet(data));
    });

    socket.on("withdraw_friend_req_ret", (data) => {
      dispatch(handleWithdrawFriendReqRet(data));
    });

    // conversation
    socket.on("start_chat", (data) => {
      dispatch(startChat(data));
    });

    socket.on("create_group_ret", (data) => {
      dispatch(handleCreateGroupRet(data));
    });

    socket.on("join_group_request", (data) => {
      dispatch(handleJoinGroupReq(data));
    });

    socket.on("join_group_ret", (data) => {
      dispatch(handleAcceptJoinGroup(data));
    });

    socket.on("new_member", (data) => {
      dispatch(handleNewMember(data));
    });

    // message
    socket.on("new_messages", (data) => {
      dispatch(handleNewMessages(data));
    });

    socket.on("delete_message_ret", (data) => {
      dispatch(handleDeleteMsgRet(data));
    });

    return () => {
      console.log("socket off");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("error", onError);
      socket.off("online");
      socket.off("offline");
      socket.off("new_friend_req");
      socket.off("friend_req_accepted_ret");
      socket.off("friend_req_decline_ret");
      socket.off("withdraw_friend_req_ret");
      socket.off("send_req_ret");
      socket.off("start_chat");
      socket.off("create_group_ret");
      socket.off("join_group_request");
      socket.off("join_group_ret");
      socket.off("new_member");
      socket.off("new_messages");
      socket.off("delete_message_ret");
      socket.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
