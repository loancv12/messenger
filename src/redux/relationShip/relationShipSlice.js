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
    updateUsers(state, action) {
      console.log("updateUsers", action.payload);
      state.users = action.payload.users;
    },
    updateFriends(state, action) {
      console.log("updateFriends", action.payload);
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      console.log("updateFriendRequests", action.payload);
      state.friendRequests = action.payload.friendRequests;
    },
  },
});

export const selectUsers = (state) => state.relationShip.users;
export const selectFriends = (state) => state.relationShip.friends;
export const selectFriendRequests = (state) =>
  state.relationShip.friendRequests;

const { reducer, actions } = slice;

export const { updateUsers, updateFriends, updateFriendRequests } = actions;

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
    // dispatch(fetchUsers()); //TODO
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
    // dispatch(fetchFriendRequests()); //TODO
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
