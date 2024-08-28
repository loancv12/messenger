import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  email: "",
  currUserId: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrUserId(state, action) {
      state.currUserId = action.payload.currUserId;
    },
    setCredentials(state, action) {
      state.token = action.payload.token;
    },
    logout(state, action) {
      state.token = "";
    },
    updateEmail(state, action) {
      console.log("updateEmail", action.payload);
      state.email = action.payload.email;
    },
  },
});

export const selectToken = (state) => state.auth.token;
export const selectCurrUserId = (state) => state.auth.currUserId;
export const selectEmail = (state) => state.auth.email;

const { actions, reducer } = slice;

export default reducer;

export const { setCredentials, setCurrUserId, logout, updateEmail } = actions;
