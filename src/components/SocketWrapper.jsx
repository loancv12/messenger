import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket, connectSocket } from "../socket";
import { showSnackbar } from "../redux/app/appSlice";
import {
  handleFriendReqAccepted,
  handleNewFriendReq,
  handleSendReqRet,
} from "../redux/relationShip/relationShipSlice";
import {
  handleAcceptJoinGroup,
  handleCreateGroupRet,
  handleJoinGroupReq,
  handleNewMember,
  startChat,
} from "../redux/conversation/conversationSlice";
import {
  handleDeleteMsgRet,
  handleNewMessages,
} from "../redux/message/messageSlice";

const SocketWrapper = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn);
    let socketApi;
    if (isLoggedIn) {
      if (!socket) {
        const userId = localStorage.getItem("userId");
        connectSocket(userId);
      }

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
        l;
      };

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

      // only recipient receive this
      socket.on("new_friend_req", (data) => {
        dispatch(handleNewFriendReq(data));
      });

      socket.on("friend_req_accepted_ret", (data) => {
        dispatch(handleFriendReqAccepted(data));
      });

      // only sender receive this
      socket.on("send_req_ret", (data) => {
        dispatch(handleSendReqRet(data));
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
      socketApi?.disconnect();
    }
    console.log("socket at provider", socket, socketApi);

    return () => {
      console.log("socket off");
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("online");
      socket?.off("offline");
      socket?.off("new_friend_request");
      socket?.off("request_accepted");
      socket?.off("request_sent");
      socket?.off("start_chat");
      socket?.off("create_group_result");
      socket?.off("join_group_result");
      socket?.off("new_member");
      socket?.off("new_messages");
      socket?.disconnect();
    };
  }, [isLoggedIn, socket]);
  return <>{children}</>;
};

export default SocketWrapper;
