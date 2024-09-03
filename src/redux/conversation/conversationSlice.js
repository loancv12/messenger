import { createSelector, createSlice } from "@reduxjs/toolkit";

import { faker } from "@faker-js/faker";
import { selectChatType, showSnackbar, updateNotice } from "../app/appSlice";
import { chatTypes, noticeTypes } from "../config";
import { selectCurrUserId } from "../auth/authSlice";
import { history } from "../../utils/history";
import { generalPath, path } from "../../routes/paths";

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
      // because of fetchCvs and fetchMsg almost at same time of current cvs, so numberof unread is unpredictable
      // other method is make fetches at the same comp //TODO
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

    setCurrentCvsId(state, action) {
      console.log("setCurrentCvsId", action.payload);
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
export const selectCvssDefinedChatType = (
  state,
  chatType // ONLY for chatType is defined, cause the update of chatType can be after the operation
) => state.conversation[chatType].conversations;

export const selectCurrCvsIdDefinedChatType = (
  state,
  chatType // ONLY for chatType is defined
) => state.conversation[chatType].currentCvsId;

const selectCvss = (state) => state.conversation;
export const selectCurrCvsId = createSelector(
  [selectCvss, selectChatType],
  (conversations, chatType) => conversations[chatType].currentCvsId
);

export const selectCurrCvs = createSelector(
  [selectCvss, selectChatType, selectCurrCvsId],
  (conversations, chatType, cvsID) => {
    return (
      conversations[chatType].conversations.find((cvs) => cvs.id === cvsID) ??
      null
    );
  }
);

const selectCvsId = (_, cvsId) => cvsId;
export const selectCvs = createSelector(
  [selectCvss, selectChatType, selectCvsId],
  (conversations, chatType, cvsID) => {
    return (
      conversations[chatType].conversations.find((cvs) => cvs.id === cvsID) ??
      null
    );
  }
);

export const selectNumOfParticipants = createSelector(
  [selectChatType, selectCurrCvs],
  (chatType, currCvs) => {
    if (chatType === chatTypes.DIRECT_CHAT) return 2;
    return currCvs?.userIds?.length ?? 3;
  }
);

export const selectPeopleInCvs = createSelector(
  [selectCurrCvs, selectCurrUserId],
  (currCvs, currUser) => {
    return (
      currCvs?.userIds?.filter((userId) => {
        return userId !== currUser;
      }) ?? [currCvs?.userId]
    );
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
  setCurrentCvsId,
  setJoinGroupReqs,
  addJoinGroupReq,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

// thunk
export const startChat = (data) => {
  console.log("startChat", data);

  return (dispatch, getState) => {
    const { conversation } = data;

    const existCvs = selectCvs(getState(), conversation.id);

    if (existCvs) {
      dispatch(
        updateConversation({
          type: chatTypes.DIRECT_CHAT,
          conversationId: conversation.id,
          updatedContent: conversation,
        })
      );
    } else {
      dispatch(
        addConversation({
          type: chatTypes.DIRECT_CHAT,
          newConversation: conversation,
        })
      );
    }

    const currUser = selectCurrUserId(getState());

    if (currUser !== conversation.userId) {
      history.navigate(
        path(generalPath[chatTypes.DIRECT_CHAT], conversation.id)
      );
    }
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
      setCurrentCvsId({
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

  return (dispatch, getState) => {
    const currUserId = selectCurrUserId(getState());
    const { message, updatedGroupCvs, newMemberId } = data;
    dispatch(showSnackbar({ severity: "success", message }));

    if (currUserId !== newMemberId) {
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
