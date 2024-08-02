import { useEffect, useState } from "react";
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
  updateSentSuccessMsgs,
} from "../redux/message/messageSlice";
import {
  handleFriendReqAcceptedRet,
  handleFriendReqDeclineRet,
  handleNewFriendReq,
  handleSendReqRet,
  handleWithdrawFriendReqRet,
} from "../redux/relationShip/relationShipSlice";
import useAuth from "../hooks/useAuth";
import instance from "../socket";

const socket = instance.initSocket();

const SocketWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const { userId } = useAuth();

  console.log("socket provider rerender", socket);

  useEffect(() => {
    if (!socket.connected) {
      socket.auth = { userId };
      socket.connect();
    }

    socket.on("ping", (value) => {
      console.log("ping", value);
    });

    // upon connection or reconnection
    socket.on("connect", () => {
      if (socket.recovered) {
        console.log("connect to server", socket.recovered);
        // any event missed during the disconnection period will be received now
      } else {
        console.log(" new or unrecoverable session", socket.recovered);

        // new or unrecoverable session
      }

      // setTimeout(() => {
      //   // close the low-level connection and trigger a reconnection
      //   socket.io.engine.close();
      // }, 5000);
    });

    // temporary disconnection, the socket will automatically try to reconnect
    // the connection was forcefully closed by the server or the client itself
    // in that case, `socket.connect()` must be manually called in order to reconnect

    socket.on("disconnect", (reason, details) => {
      console.log("onDisconnect", reason, socket);
      if (!socket.active) {
        //
      }
    });

    //     The connect_error event will be emitted upon connection failure:

    // due to the low-level errors (when the server is down for example)
    // due to middleware errors
    // Please note that, in the function above, the low-level errors are not handled (the user could be notified of the connection failure, for example).
    socket.on("connect_error", (err) => {
      console.log("connect error", err);
      if (!socket.active) {
        socket.connect();
      }
      dispatch(
        showSnackbar({
          severity: "error",
          message: err.message,
        })
      );
    });

    socket.on("error", (reason) => {
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

    socket.on("user connected", (data) => {
      console.log("this USER connected ", data.userId);
    });

    // user online
    socket.on("online", (userId) => {
      console.log(userId, "Is Online!"); // update online status
      console.log("connected");
      console.log("socket.recovered");
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
      console.log("new_messages", data);
      dispatch(handleNewMessages(data));

      // when receiver receiver msg, emit event tp update msgs to sentSuccess to 'success'
      if (data.messages[0].to === userId) {
        socket.emit("receive_new_msgs", data);
      }
    });

    socket.on("delete_message_ret", (data) => {
      dispatch(handleDeleteMsgRet(data));
    });

    socket.on("update_sent_success", (data) => {
      dispatch(updateSentSuccessMsgs(data));
    });

    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    return () => {
      console.log("socket off");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("error");
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
      socket.off("update_sent_success");
      socket.disconnect();
    };
  }, []);
  return <>{children}</>;
};

export default SocketWrapper;
