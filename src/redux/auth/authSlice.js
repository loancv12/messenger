import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  email: "",
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
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
export const selectEmail = (state) => state.auth.email;

const { actions, reducer } = slice;

export default reducer;

export const { setCredentials, logout, updateEmail } = actions;
