import { createSelector, createSlice } from "@reduxjs/toolkit";

import { faker } from "@faker-js/faker";
import { showSnackbar, updateNotice } from "../app/appSlice";
import { chatTypes, noticeTypes } from "../config";

const initialState = {
  [chatTypes.DIRECT_CHAT]: {
    conversations: [],
    currentCvsId: null,
  },
  [chatTypes.GROUP_CHAT]: {
    conversations: [],
    currentCvsId: null,
  },
  joinGroupReqs: [],
};

const slice = createSlice({
  name: "conversation",
  initialState,

  reducers: {
    // conversation
    setConversations(state, action) {
      const { type, conversations } = action.payload;
      console.log("setConversations", conversations);
      console.log("currentCvsId", state[type].currentCvsId);
      // because of fetchCvs and fetchMsg almost at same time of current cvs, so numberof unread is unpredictable
      // other method is make fetches at the same comp
      const list = conversations.map((conversation, i) => {
        return {
          ...conversation,
          ...(conversation.id === state[type].currentCvsId && { unread: 0 }),
          img: faker.image.avatar(),
        };
      });

      state[type].conversations = list;
    },
    updateConversation(state, action) {
      console.log("updateConversation", action);
      const { type, conversationId, updatedContent } = action.payload;

      // find last msg that other user send to current user
      state[type].conversations = state[type].conversations.map((el) => {
        if (el.id !== conversationId) {
          return el;
        } else {
          return {
            ...el,
            ...updatedContent,
          };
        }
      });
    },
    addConversation(state, action) {
      console.log("addConversation", action);
      const { type, newConversation } = action.payload;
      state[type].conversations.push({
        ...newConversation,
        img: faker.image.avatar(),
      });
    },

    setCurrentCvs(state, action) {
      console.log("setCurrentCvs", action.payload);
      const { type, conversationId } = action.payload;
      state[type].currentCvsId = conversationId;
    },

    setJoinGroupReqs(state, action) {
      console.log(action.payload);
      const { joinGroupReqs } = action.payload;
      state.joinGroupReqs = joinGroupReqs;
    },

    addJoinGroupReq(state, action) {
      console.log("addJoinGroupReq", action.payload);
      const { group, sender } = action.payload;
      state.joinGroupReqs.push({
        group,
        sender,
      });
    },
  },
  extraReducers: (builder) => {},
});
export const selectCvss = (state, chatType) =>
  state.conversation[chatType].conversations;

export const selectCurrCvsId = (state, chatType) =>
  state.conversation[chatType].currentCvsId;

export const selectCurrCvs = createSelector(
  [selectCvss, selectCurrCvsId],
  (conversations, cvsID) => {
    return conversations.find((cvs) => cvs.id === cvsID) ?? null;
  }
);

export const selectJoinGroupReqs = (state) => state.conversation.joinGroupReqs;

// Extract the action creators object and the reducer
const { actions, reducer } = slice;
// Extract and export each action creator by name
export const {
  setConversations,
  updateConversation,
  addConversation,
  setCurrentCvs,
  setJoinGroupReqs,
  addJoinGroupReq,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

// thunk
export const startChat = (data) => {
  console.log("startChat", data);
  return (dispatch, getState) => {
    console.log("start chat", data);
    const chatType = getState().app.chatType;
    const existCvs = getState().conversation[chatType].conversations.find(
      (el) => el.id === data.id
    );
    if (existCvs) {
      dispatch(
        updateConversation({
          type: chatTypes.DIRECT_CHAT,
          conversationId: data.id,
          updatedContent: data,
        })
      );
    } else {
      dispatch(
        addConversation({
          type: chatTypes.DIRECT_CHAT,
          newConversation: data,
        })
      );
    }
    dispatch(
      setCurrentCvs({
        type: chatTypes.DIRECT_CHAT,
        conversationId: data.id,
      })
    );
  };
};

export const handleCreateGroupRet = (data) => {
  return (dispatch, getState) => {
    const { message, newGroupCvs } = data;
    console.log("create_group_result", data);
    dispatch(showSnackbar({ severity: "success", message }));
    dispatch(
      addConversation({
        type: chatTypes.GROUP_CHAT,
        newConversation: newGroupCvs,
      })
    );
    dispatch(
      setCurrentCvs({
        type: chatTypes.GROUP_CHAT,
        conversationId: newGroupCvs.id,
      })
    );
  };
};

export const handleJoinGroupReq = (data) => {
  return (dispatch, getState) => {
    const { message, group, sender } = data;
    dispatch(showSnackbar({ severity: "success", message }));
    dispatch(
      addJoinGroupReq({
        group,
        sender,
      })
    );
    dispatch(
      updateNotice({
        type: noticeTypes.JOIN_GROUP_REQ,
        show: true,
      })
    );
  };
};

export const handleAcceptJoinGroup = (data) => {
  return (dispatch, getState) => {
    console.log("join_group_request", data);
    const { message, status } = data;
    if (data?.status === "error") {
      dispatch(showSnackbar({ severity: "error", message }));
    } else {
    }
  };
};

export const handleNewMember = (data) => {
  console.log("handleNewMember", data);
  const userId = localStorage.getItem("userId");

  return (dispatch, getState) => {
    const { message, updatedGroupCvs, newMemberId } = data;
    dispatch(showSnackbar({ severity: "success", message }));

    if (userId !== newMemberId) {
      dispatch(
        updateConversation({
          type: chatTypes.GROUP_CHAT,
          conversationId: updatedGroupCvs.id,
          updatedContent: updatedGroupCvs,
        })
      );
    } else {
      dispatch(
        addConversation({
          type: chatTypes.GROUP_CHAT,
          newConversation: updatedGroupCvs,
        })
      );
    }
  };
};
