import { createSelector, createSlice } from "@reduxjs/toolkit";
import { fetchFriendRequests, fetchUsers } from "./relationShipApi";
import { showSnackbar, updateNotice } from "../app/appSlice";
import { noticeTypes } from "../config";
import { selectCurrUserId } from "../auth/authSlice";

const initialState = {
  users: [],
  friends: [],
  friendRequests: [],
  currUser: {},
};
const slice = createSlice({
  name: "relationShip",
  initialState,
  reducers: {
    setCurrUser(state, action) {
      console.log("setCurrUser", action.payload);
      state.currUser = action.payload.currUser;
    },
    setUsers(state, action) {
      console.log("setUsers", action.payload);
      state.users = action.payload.users;
    },
    setFriends(state, action) {
      console.log("setFriends", action.payload);
      state.friends = action.payload.friends;
    },
    setFriendRequests(state, action) {
      console.log("setFriendRequests", action.payload);
      state.friendRequests = action.payload.friendRequests;
    },
    addUser(state, action) {
      const { newUser } = action.payload;
      state.users.push(newUser);
    },
    addFriend(state, action) {
      const { newFriend } = action.payload;
      state.friends.push(newFriend);
    },
    addFriendReqs(state, action) {
      const { newFriendReq } = action.payload;
      state.friendRequests.push(newFriendReq);
    },
    removeUser(state, action) {
      const { userId } = action.payload;
      const otherUsers = state.users.filter((user) => {
        return user.id !== userId;
      });
      state.users = otherUsers;
    },
    removeFriend(state, action) {
      const { friendId } = action.payload;
      const otherFriend = state.friends.filter((user) => {
        return user.id !== friendId;
      });
      state.friends = otherFriend;
    },
    removeFriendReqs(state, action) {
      const { friendReqId } = action.payload;
      const otherFriendReqs = state.friendRequests.filter((friendReq) => {
        return friendReq.id !== friendReqId;
      });
      state.friendRequests = otherFriendReqs;
    },
  },
});

export const selectCurrUser = (state) => state.relationShip.currUser;
export const selectUsers = (state) => state.relationShip.users;
export const selectFriends = (state) => state.relationShip.friends;
export const selectFriendRequests = (state) =>
  state.relationShip.friendRequests;

//
const selectUserId = (_, userId) => userId;
const selectFriendReqId = (_, friendReqId) => friendReqId;
export const selectUser = createSelector(
  [selectUsers, selectUserId],
  (users, userId) => {
    return users.find((user) => user.id === userId);
  }
);
export const selectFriend = createSelector(
  [selectFriends, selectUserId],
  (friends, friendId) => {
    return friends.find((user) => user.id === friendId);
  }
);
export const selectFriendReq = createSelector(
  [selectFriendRequests, selectFriendReqId],
  (friendRequests, friendReqId) => {
    return friendRequests.find((user) => user.id === friendReqId);
  }
);

const { reducer, actions } = slice;

export const {
  setCurrUser,
  setUsers,
  setFriends,
  setFriendRequests,
  addUser,
  addFriend,
  addFriendReqs,
  removeUser,
  removeFriend,
  removeFriendReqs,
} = actions;

export default reducer;

// thunk
export const handleSendReqRet = (data) => {
  console.log("handleSendReqRet", data);
  return (dispatch, getState) => {
    const { message, newFriendReq } = data;
    dispatch(showSnackbar({ severity: "success", message }));

    dispatch(removeUser({ userId: newFriendReq.recipient.id }));
    dispatch(
      addFriendReqs({
        newFriendReq,
      })
    );
  };
};

export const handleNewFriendReq = (data) => {
  console.log("handleNewFriendReq", data);
  return (dispatch, getState) => {
    const { message, newFriendReq } = data;
    dispatch(showSnackbar({ severity: "success", message }));
    dispatch(
      updateNotice({
        type: noticeTypes.FRIEND_REQ,
        show: true,
      })
    );

    dispatch(removeUser({ userId: newFriendReq.sender.id }));
    dispatch(
      addFriendReqs({
        newFriendReq,
      })
    );
  };
};

export const handleFriendReqAcceptedRet = (data) => {
  console.log("handleFriendReqAcceptedRet", data);

  return (dispatch, getState) => {
    const { message, request } = data;
    dispatch(showSnackbar({ severity: "success", message }));

    const userId = selectCurrUserId(getState());

    dispatch(
      updateNotice({
        type: noticeTypes.FRIEND_REQ,
        show: request.senderId === userId,
      })
    );

    const { id, recipient, sender } = request;
    const isSender = sender.id === userId;

    const newFriend = isSender ? recipient : sender;

    dispatch(removeFriendReqs({ friendReqId: id }));
    console.log("newFriend", newFriend);
    dispatch(addFriend({ newFriend }));
  };
};

export const handleFriendReqDeclineRet = (data) => {
  console.log("handleFriendReqDeclineRet", data);
  return (dispatch, getState) => {
    const { message, request } = data;
    dispatch(showSnackbar({ severity: "success", message }));

    const userId = selectCurrUserId(getState());

    const { id, recipient, sender } = request;
    const isSender = sender.id === userId;

    const newUser = isSender ? recipient : sender;

    dispatch(removeFriendReqs({ friendReqId: id }));
    console.log("newUser", newUser);
    dispatch(addUser({ newUser }));
  };
};

export const handleWithdrawFriendReqRet = (data) => {
  console.log("handleWithdrawFriendReqRet", data);
  return (dispatch, getState) => {
    const { message, request } = data;

    const userId = selectCurrUserId(getState());
    const { id, recipient, sender } = request;

    const isSender = sender.id === userId;

    dispatch(showSnackbar({ severity: "success", message }));
    dispatch(removeFriendReqs({ friendReqId: id }));
    dispatch(addUser({ newUser: isSender ? recipient : sender }));
  };
};
