import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { selectChatType, showSnackbar, updateNotice } from "../app/appSlice";
import { chatTypes, noticeTypes } from "../config";
import {
  selectCurrCvsId,
  updateConversation,
} from "../conversation/conversationSlice";
import { showNotification } from "../../services/notification";
import instance from "../../socket";

const initialState = {
  [chatTypes.DIRECT_CHAT]: {},
  [chatTypes.GROUP_CHAT]: {},
  replyMsgId: "",
};

const slice = createSlice({
  name: "message",
  initialState,
  reducers: {
    setMessages(state, action) {
      console.log("setMessages", action);
      const { type, messages, conversationId } = action.payload;
      state[type][conversationId] = messages;
    },

    concatMessages(state, action) {
      console.log("concatMessages", action);
      const { type, newMessages, conversationId } = action.payload;
      const oldMsgs = state[type][conversationId];
      state[type][conversationId] = newMessages.concat(oldMsgs);
    },

    addMessages(state, action) {
      console.log("addMessages", action);
      const { type, newMessages, conversationId } = action.payload;
      newMessages.forEach((msg) => {
        if (state[type][conversationId]) {
          state[type][conversationId].push({ ...msg });
        } else {
          state[type][conversationId] = newMessages;
        }
      });
    },

    updateMessage(state, action) {
      console.log("updateMessage", action.payload);
      const { type, msgId, updatedContent, conversationId } = action.payload;
      state[type][conversationId] = state[type][conversationId].map((el) => {
        if (el.id !== msgId) {
          return el;
        } else {
          return {
            ...el,
            ...updatedContent,
          };
        }
      });
    },

    updateMessages(state, action) {
      console.log("updateMessage", action.payload);
      const { type, msgIds, updatedContent, conversationId } = action.payload;
      state[type][conversationId] = state[type][conversationId].map((el) => {
        if (!msgIds.includes(el.id)) {
          return el;
        } else {
          return {
            ...el,
            ...updatedContent,
          };
        }
      });
    },

    updateReplyMsgId(state, action) {
      console.log("updateReplyMsgId", action.payload);
      const { replyMsgId } = action.payload;
      state.replyMsgId = replyMsgId;
    },

    updateUnreadMsgs(state, action) {
      const { type, conversationId, newSeenUserId } = action.payload;
      state[type][conversationId] = state[type][conversationId].map((el) => {
        if (el.readUserIds.includes(newSeenUserId)) {
          return el;
        } else {
          return {
            ...el,
            readUserIds: [...el.readUserIds, newSeenUserId],
          };
        }
      });
    },
  },
});

export const selectMsgs = (state) => state.message;
export const selectCurrentMsgs = createSelector(
  [selectMsgs, selectChatType, selectCurrCvsId],
  (msgs, chatType, conversationId) => msgs[chatType][conversationId] ?? []
);

export const selectReplyMsgId = (state) => state.message.replyMsgId;

export const selectReplyMsg = createSelector(
  [selectReplyMsgId, selectCurrentMsgs],
  (id, msgs) => {
    console.log("selectCurrentMsgs ret", msgs);
    return msgs.find((msg) => msg.id === id) ?? null;
  }
);

// Extract the action creators object and the reducer
const { actions, reducer } = slice;
// Extract and export each action creator by name
export const {
  setMessages,
  concatMessages,
  addMessages,
  updateMessage,
  updateMessages,
  updateReplyMsgId,
  updateUnreadMsgs,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

// thunk
export const handleNewMessages = ({ chatType, messages, conversationId }) => {
  return (dispatch, getState) => {
    console.log("handleNewMessages", chatType, messages, conversationId);

    // notice on sidebar when current chatType is not new msgs chatType
    const currentChatType = getState().app.chatType;
    if (currentChatType !== chatType) {
      dispatch(updateNotice({ type: noticeTypes[chatType], show: true }));
    }

    // add new msgs (comment here stupid but it visually look good to separate logic)
    dispatch(
      addMessages({ type: chatType, newMessages: messages, conversationId })
    );

    // update conversation
    const latestMsg = messages[messages.length - 1];
    const userId = localStorage.getItem("userId");
    const isFromUser = latestMsg.from === userId;

    const conversations = getState().conversation[chatType].conversations;
    const updatedCvs = conversations.find(
      (conversation) => conversation.id === conversationId
    );

    const updatedContent = {
      msg: latestMsg.text,
      updatedAt: latestMsg.updatedAt,
      unread: isFromUser ? 0 : Number(updatedCvs.unread) + messages.length,
    };
    dispatch(
      updateConversation({
        type: chatType,
        conversationId,
        updatedContent,
      })
    );

    if (!isFromUser) {
      // update title of to user
      document.title = latestMsg.text;

      // show notification
      showNotification({
        title: "Text Message",
        body: latestMsg.text,
        tag: chatType,
      });
    }
  };
};

export const updateSentSuccessMsgs = (data) => {
  const { chatType, messages, conversationId, sentSuccess } = data;
  console.log(
    "updateSentSuccessMsgs",
    chatType,
    messages,
    conversationId,
    sentSuccess
  );
  return (dispatch, getState) => {
    dispatch(
      updateMessages({
        type: chatType,
        msgIds: messages.map((msg) => msg.id), // TODO
        conversationId,
        updatedContent: { sentSuccess },
      })
    );
  };
};

export const handleUpdateReadUsers = (data) => {
  return (dispatch, getState) => {
    const { newSeenUserId, conversationId, chatType } = data;

    dispatch(
      updateUnreadMsgs({
        type: chatType,
        conversationId,
        newSeenUserId,
      })
    );
  };
};

export function setReplyMessage({ msg, socket }) {
  console.log("replyMessage", msg);
  return (dispatch, getState) => {
    dispatch(
      updateReplyMsgId({
        replyMsgId: msg.id,
      })
    );
  };
}

export function clearReplyMessage() {
  console.log("clearReplyMessage");
  return (dispatch, getState) => {
    dispatch(
      updateReplyMsgId({
        replyMsgId: null,
      })
    );
  };
}

export function reactMessage({ msg, socket }) {
  //
  console.log("reactMessage", msg);
}
export function forwardMessage({ msg, socket }) {
  //
  console.log("forwardMessage", msg);
}
export function starMessage({ msg, socket }) {
  //
  console.log("reactMessage", msg);
}
export function reportMessage({ msg, socket }) {
  //
  console.log("forwardMessage", msg);
}

export function deleteMessage({ msg }) {
  console.log("deleteMsg", msg);
  return (dispatch, getState) => {
    const socket = instance.getSocket();
    const chatType = getState().app.chatType;

    socket.emit("delete_message", {
      type: chatType,
      msgId: msg.id,
    });
  };
}

export function handleDeleteMsgRet(data) {
  return (dispatch, getState) => {
    console.log("deleteMsg", data);
    if (data?.status === "error") {
      dispatch(showSnackbar({ severity: "error", message: data?.message }));
    } else {
      const { msgId, type, conversationId } = data;
      // updateMessage msg
      dispatch(
        updateMessage({
          type,
          msgId,
          conversationId,
          updatedContent: {
            isDeleted: true,
            file: "Message is deleted",
            text: "Message is deleted",
          },
        })
      );

      // update conversation if deletedMsg is latest msg
      const currentMsgs = getState().message[type][conversationId];
      const isLatestMsg = currentMsgs[currentMsgs.length - 1].id === msgId;
      console.log("isLatestMsg", isLatestMsg);

      if (isLatestMsg) {
        dispatch(
          updateConversation({
            type,
            conversationId: getState().conversation[type].currentCvsId,
            updatedContent: { msg: "Message is deleted" },
          })
        );
      }
    }
  };
}
