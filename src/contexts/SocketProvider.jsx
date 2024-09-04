import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectClientId,
  setClientId,
  showSnackbar,
  updateCallConfirm,
} from "../redux/app/appSlice";
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
  handleUpdateReadUsers,
  updateSentSuccessMsgs,
  updateTempMessage,
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
import { axiosPrivate } from "../services/axios/axiosClient";
import { v4 as uuidv4 } from "uuid";
import { Navigate, useNavigate } from "react-router-dom";
import { generalPath, path, specificPath } from "../routes/paths";
import { chatTypes } from "../redux/config";

const socket = instance.initSocket();

const SocketWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const isFirstMount = useRef(true);

  useEffect(() => {
    let clientId = sessionStorage.getItem("mess_clientId") || "";
    if (!socket.connected) {
      // when user login, no clientId in there => create one in fe=> send to server =>create a in db, connect to socket by it
      // when user reload, there a clientId there => no create one in fe=> send to server =>
      // // // duplicate =>create new one in server= >
      // // => return new one to client
      // // => client receive it and connect to socket by that new one
      // // // we need old clientId to delete all related thing off it, so, cannot create new clientId in fe,
      // // // we can check duplicate before create new one in fe, but then we must send another re-set clientId to it,
      // // // create new one server and return it to fe is suitable

      if (!clientId) {
        clientId = uuidv4();
        sessionStorage.setItem("mess_clientId", clientId);
      }

      const sendClient = async () => {
        try {
          const ret = await axiosPrivate({
            url: "/client/create-client",
            method: "POST",
            data: { clientId, userId },
          });

          if (ret.data.message === "Duplicate clientId") {
            clientId = ret.data.data;
            sessionStorage.setItem("mess_clientId", clientId);
          }

          dispatch(setClientId({ clientId }));
          instance.connect(userId, clientId);
        } catch (error) {
          dispatch(
            showSnackbar({ severity: "error", message: "something wrong" })
          );
        }
      };
      if (
        isFirstMount.current === false ||
        process.env.NODE_ENV !== "development"
      ) {
        sendClient();
      }
    }

    // upon connection or reconnection
    socket.on("connect", () => {
      if (socket.recovered) {
        console.log("connect to server", socket.recovered);
        // any event missed during the disconnection period will be received now
      } else {
        console.log(" new or unrecoverable session", socket.recovered);

        const callback = (groupMsgs) => {
          console.log("callback", groupMsgs);
          groupMsgs?.map((groupMsg) => dispatch(handleNewMessages(groupMsg)));
        };
        socket.emit(
          "miss-msg",
          { date: new Date(), userId, clientId },
          callback
        );
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

    // make friend
    socket.on("send_req_ret", (data) => {
      console.log("send_req_ret", data);
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
      // when one socket of admin create group, it will emit to adminId to notice create group successful
      // but only that admin's socket join group in server, we emit this event to make sure that every socket of admin join group
      socket.emit("make_all_socket_of_admin_join_group", data);
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
      if (data.tempId && data.chatType === chatTypes.DIRECT_CHAT) {
        dispatch(updateTempMessage(data));
      } else {
        dispatch(handleNewMessages(data));
      }

      // when receiver receiver msg, emit event tp update msgs to sentSuccess to 'success'
      // AVOID using to
      if (data.messages[0].from !== userId) {
        socket.emit("receive_new_msgs", data);
      }
    });

    socket.on("delete_message_ret", (data) => {
      dispatch(handleDeleteMsgRet(data));
    });

    socket.on("update_sent_success", (data) => {
      dispatch(updateSentSuccessMsgs(data));
    });

    socket.on("update_read_users", (data) => {
      dispatch(handleUpdateReadUsers(data));
    });

    // call
    socket.on("call_invite", ({ roomId, senderId }) => {
      dispatch(updateCallConfirm({ open: true, roomId, senderId }));
    });

    return () => {
      isFirstMount.current = false;
      const deleteClient = async () => {
        await axiosPrivate({
          url: "/client/delete-client",
          method: "DELETE",
          data: { clientId },
        });
      };
      deleteClient();
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
      socket.off("update_read_users");
      socket.off("call_invite");
      socket.disconnect();
    };
  }, []);
  return <>{children}</>;
};

export default SocketWrapper;
