import { createSlice } from "@reduxjs/toolkit";
import { fetchFriendRequests, fetchUsers } from "./relationShipApi";
import { showSnackbar, updateNotice } from "../app/appSlice";
import { noticeTypes } from "../config";
import { selectCurrUserId } from "../auth/authSlice";

const initialState = {
  users: [],
  friends: [],
  friendRequests: [],
};
const slice = createSlice({
  name: "relationShip",
  initialState,
  reducers: {
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
      const { removedUserId } = action.payload;
      const otherUsers = state.users.filter((user) => {
        return user.id !== removedUserId;
      });
      state.users = otherUsers;
    },
    removeFriend(state, action) {
      const { removedFriendId } = action.payload;
      const otherFriend = state.friends.filter((user) => {
        return user.id !== removedFriendId;
      });
      state.friends = otherFriend;
    },
    removeFriendReqs(state, action) {
      const { removedFriendReqId } = action.payload;
      const otherFriendReqs = state.friendRequests.filter((friendReq) => {
        return friendReq.id !== removedFriendReqId;
      });
      state.friendRequests = otherFriendReqs;
    },
  },
});

export const selectUsers = (state) => state.relationShip.users;
export const selectFriends = (state) => state.relationShip.friends;
export const selectFriendRequests = (state) =>
  state.relationShip.friendRequests;

const { reducer, actions } = slice;

export const { setUsers, setFriends, setFriendRequests } = actions;

export default reducer;

// thunk
export const handleNewFriendReq = (data) => {
  console.log("handleNewFriendReq", data);
  return (dispatch, getState) => {
    const { message, newFriendRequest } = data;
    console.log("new_friend_request", data);
    dispatch(showSnackbar({ severity: "success", message }));
    dispatch(
      updateNotice({
        type: noticeTypes.FRIEND_REQ,
        show: true,
      })
    );
  };
};

export const handleSendReqRet = (data) => {
  console.log("handleSendReqRet", data);
  return (dispatch, getState) => {
    const { message, request } = data;
    dispatch(showSnackbar({ severity: "success", message }));

    dispatch(removeUser({ removedUserId: data.recipient.id }));
  };
};

export const handleFriendReqAcceptedRet = (data) => {
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

    if (request.senderId === userId) {
      dispatch(removeFriendReqs({ removedFriendReqId: request.id }));
      dispatch(addF({ removedFriendReqId: request.id }));
    }
  };
};

export const handleFriendReqDeclineRet = (data) => {
  return (dispatch, getState) => {
    const { message, request } = data;
    dispatch(showSnackbar({ severity: "success", message }));

    // only sender of friend req receive request field
    if (request) {
      dispatch(
        updateNotice({
          type: noticeTypes.FRIEND_REQ,
          show: true,
        })
      );
    }
    // dispatch(fetchFriendRequests()); //TODO
  };
};

export const handleWithdrawFriendReqRet = (data) => {
  return (dispatch, getState) => {
    const { message } = data;

    dispatch(showSnackbar({ severity: "success", message }));
    // dispatch(fetchFriendRequests()); //TODO
  };
};
