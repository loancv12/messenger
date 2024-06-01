import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  token: "",
  email: "",
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logIn(state, action) {
      console.log("logIn", action.payload);
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
    },
    logout(state, action) {
      state.isLoggedIn = false;
      state.token = "";
    },
    updateEmail(state, action) {
      console.log("updateEmail", action.payload);
      state.email = action.payload.email;
    },
  },
});

export const selectToken = (state) => state.auth.token;
export const selectEmail = (state) => state.auth.email;

const { actions, reducer } = slice;

export default reducer;

export const { logIn, logout, updateEmail } = actions;
