import { createSlice } from "@reduxjs/toolkit";
import { sidebarTypes, chatTypes, noticeTypes } from "../config";

const initialState = {
  sidebar: {
    open: false,
    type: sidebarTypes.CONTACT, //can be CONTACT, STARRED, SHARED
  },

  snackbar: {
    open: false,
    message: null,
    severity: null,
  },

  chatType: chatTypes.DIRECT_CHAT, //group_chat or direct_chat

  showConversationComp: false, // use in mobile screen to show conversation component

  notices: [
    {
      type: noticeTypes.FRIEND_REQ,
      show: false,
    },
    {
      type: noticeTypes.JOIN_GROUP_REQ,
      show: false,
    },
    {
      type: noticeTypes[chatTypes.DIRECT_CHAT],
      show: false,
    },
    {
      type: noticeTypes[chatTypes.GROUP_CHAT],
      show: false,
    },
  ],
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // toggle Sidebar
    toggleSidebar(state, action) {
      state.sidebar.open = !state.sidebar.open;
    },
    updateSidebar(state, action) {
      console.log("updateSidebar", action.payload);
      state.sidebar.type = action.payload.type;
    },

    updateShowCvsComp(state, action) {
      console.log("updateShowCvsComp", action.payload);
      state.showConversationComp = action.payload.open;
    },

    openSnackbar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackbar(state, action) {
      state.snackbar.open = false;
      state.snackbar.severity = null;
      state.snackbar.message = null;
    },

    selectTypeOfCvs(state, action) {
      state.chatType = action.payload.chatType;
    },

    updateNotice(state, action) {
      console.log("updateNotice", action.payload);

      const { type, show } = action.payload;

      const noticeIndex = state.notices.findIndex(
        (notice) => notice.type === type
      );
      state.notices[noticeIndex] = { type, show };
    },
  },
});

// selectos
export const selectSidebar = (state) => state.app.sidebar;
export const selectShowCvsComp = (state) => state.app.showConversationComp;

export const selectChatType = (state) => state.app.chatType;

export const selectNotices = (state) => state.app.notices;

export const selectNotice = (state, type) =>
  state.app.notices.find((notice) => notice.type === type);

// Extract the action creators object and the reducer
const { actions, reducer } = slice;
// Extract and export each action creator by name
export const {
  toggleSidebar,
  updateSidebar,
  updateShowCvsComp,
  openSnackbar,
  closeSnackbar,
  selectTypeOfCvs,
  addNotice,
  updateNotice,
  updateSettingPart,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;

// Snackbar
export function showSnackbar({ severity, message }) {
  return async (dispatch, getState) => {
    dispatch(openSnackbar({ message, severity }));

    setTimeout(() => {
      dispatch(closeSnackbar());
    }, 4000);
  };
}
