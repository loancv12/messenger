import { createContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriendRequests,
  fetchFriends,
  fetchUsers,
} from "../redux/relationShip/relationShipApi";
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

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const host = BASE_URL;
  const userId = localStorage.getItem("userId");
  const options = {
    autoConnect: false,
    query: `userId=${userId}`,
    // retries: 3,
  };

  const socket = io(host, options);
  console.log("socket at socketProvider", socket);
  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn);
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
    if (isLoggedIn) {
      console.log("userId at socket provider", userId, socket);
      if (!socket.connected) {
        socket.connect();
      }
      socket.on("ping", () => {
        console.log("ping");
      });

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      socket.on("connect_error", (err) => {
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
      });

      socket.on("errormy", (reason) => {
        console.log("error event", reason);
        dispatch(
          showSnackbar({
            severity: "error",
            message: "Some thing wrong",
          })
        );
        console.log("active run scoone", socket.active);
        // socket.connect();
      });

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
        console.log("start_chat data ", data);
        dispatch(startChat(data));
      });

      socket.on("create_group_result", (data) => {
        dispatch(handleCreateGroupRet(data));
      });

      socket.on("join_group_request", (data) => {
        dispatch(handleJoinGroupReq(data));
      });

      socket.on("join_group_result", (data) => {
        dispatch(handleAcceptJoinGroup(data));
      });

      socket.on("new_member", (data) => {
        dispatch(handleNewMember(data));
      });

      // message
      socket.on("new_messages", (data) => {
        console.log("new_messages", data);
        dispatch(handleNewMessages(data));
      });

      socket.on("delete_message_result", (data) => {
        dispatch(handleDeleteMsgRet(data));
      });
    } else {
      socket?.disconnect();
    }
    console.log("socket at provider", socket);

    return () => {
      console.log("socket off");
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("online");
      socket.off("offline");
      socket.off("new_friend_req");
      socket.off("friend_req_accepted_ret");
      socket.off("friend_req_decline_ret");
      socket.off("withdraw_friend_req_ret");
      socket.off("send_req_ret");
      socket.off("start_chat");
      socket.off("create_group_result");
      socket.off("join_group_request");
      socket.off("join_group_result");
      socket.off("new_member");
      socket.off("new_messages");
      socket.off("delete_message_result");
      socket.disconnect();
    };
  }, [isLoggedIn, socket]);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
