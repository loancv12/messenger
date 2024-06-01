import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import appReducer from "./app/appSlice";
import conversationReducer from "./conversation/conversationSlice";
import messageReducer from "./message/messageSlice";
import authReducer from "./auth/authSlice";
import relationShipReducer from "./relationShip/relationShipSlice";
import { persistReducer } from "redux-persist";

// slices

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",

  // whitelist:{}
  blacklist: ["app", "auth", "relationShip", "conversation", "message"],
};

const appPersistConfig = {
  key: "app",
  storage: storage,
  blacklist: ["chatType"],
};

const topReducer = combineReducers({
  app: persistReducer(appPersistConfig, appReducer),
  auth: authReducer,
  relationShip: relationShipReducer,
  conversation: conversationReducer,
  message: messageReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "reset") {
    // for all keys defined in your persistConfig(s)
    storage.removeItem("redux-root");
    return topReducer(undefined, action);
  }
  return topReducer(state, action);
};

export { rootPersistConfig, rootReducer };
