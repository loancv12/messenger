import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { showSnackbar, updateNotice } from "../app/appSlice";
import { chatTypes, noticeTypes } from "../config";
import { updateConversation } from "../conversation/conversationSlice";
// import { socket } from "../../socket";
import { showNotification } from "../../services/notification";
import instance from "../../socket";

const initialState = {
  [chatTypes.DIRECT_CHAT]: {
    currentMsgs: [],
    numOfPage: 1,
  },
  [chatTypes.GROUP_CHAT]: {
    currentMsgs: [],
    numOfPage: 1,
  },
  replyMsgId: "",
};

const slice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // message
    setCurrentMsgs(state, action) {
      // debugger;
      console.log("setCurrentMsgs", action.payload);
      const { type, messages } = action.payload;
      state[type].currentMsgs = messages;
    },

    setNumOfPage(state, action) {
      console.log("setNumOfPage", action.payload);
      const { type, numOfPage } = action.payload;
      state[type].numOfPage = numOfPage;
    },

    concatMessages(state, action) {
      console.log("concatMessages", action);
      const { type, newMessages } = action.payload;
      const oldMsgs = state[type].currentMsgs;
      state[type].currentMsgs = newMessages.concat(oldMsgs);
    },

    addMessages(state, action) {
      console.log("addMessages", action);
      const { type, newMessages } = action.payload;
      newMessages.forEach((msg) => {
        state[type].currentMsgs.push({ ...msg });
      });
    },

    updateMessage(state, action) {
      console.log("updateMessage", action.payload);
      const { type, msgId, updatedContent } = action.payload;
      state[type].currentMsgs = state[type].currentMsgs.map((el) => {
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

    updateReplyMsgId(state, action) {
      console.log("updateReplyMsgId", action.payload);
      const { replyMsgId } = action.payload;
      state.replyMsgId = replyMsgId;
    },
  },
});

export const selectNumOfPage = (state, chatType) =>
  state.message[chatType].numOfPage;
export const selectAllMsgs = (state) =>
  state.message[chatTypes.DIRECT_CHAT].currentMsgs?.concat(
    state.message[chatTypes.GROUP_CHAT].currentMsgs
  );
export const selectCurrentMsgs = (state, chatType) =>
  state.message[chatType].currentMsgs;
export const selectReplyMsgId = (state) => state.message.replyMsgId;
export const selectReplyMsg = createSelector(
  [selectReplyMsgId, selectAllMsgs],
  (id, msgs) => {
    return msgs.find((msg) => msg.id === id) ?? null;
  }
);

// Extract the action creators object and the reducer
const { actions, reducer } = slice;
// Extract and export each action creator by name
export const {
  setCurrentMsgs,
  setNumOfPage,
  concatMessages,
  addMessages,
  updateMessage,
  updateReplyMsgId,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

// thunk
export const handleNewMessages = (data) => {
  return (dispatch, getState) => {
    console.log("input new_message event data", data);
    const { chatType, messages, conversationId } = data;

    const currentChatType = getState().app.chatType;
    if (currentChatType !== chatType) {
      dispatch(updateNotice({ type: noticeTypes[chatType], show: true }));
    }

    const currentCvsID = getState().conversation[chatType].currentCvsId;
    if (conversationId === currentCvsID) {
      dispatch(addMessages({ type: chatType, newMessages: messages }));
    }

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
        conversationId: data.conversationId,
        updatedContent,
      })
    );

    if (!isFromUser) {
      showNotification({
        title: "Text Message",
        body: latestMsg.text,
        tag: chatType,
      });
    }
  };
};

export const updateSentSuccessMsg = (data) => {
  const { msgId, chatType } = data;
  console.log(msgId);
  return (dispatch, getState) => {
    dispatch(
      updateMessage({
        type: chatType,
        msgId,
        updatedContent: { sentSuccess: true },
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
      const { msgId, type } = data;
      dispatch(
        updateMessage({
          type,
          msgId,
          updatedContent: {
            isDeleted: true,
            file: "Message is deleted",
            text: "Message is deleted",
          },
        })
      );

      const currentMsgs = getState().message[type].currentMsgs;
      const isLatestMsg = currentMsgs.length
        ? currentMsgs[currentMsgs.length - 1].id === msgId
        : false;
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
