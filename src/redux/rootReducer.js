import { combineReducers } from "@reduxjs/toolkit";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
import storage from "redux-persist/lib/storage";
import appReducer from "./app/appSlice";
import authReducer from "./auth/authSlice";
import conversationReducer from "./conversation/conversationSlice";
import messageReducer from "./message/messageSlice";
import relationShipReducer from "./relationShip/relationShipSlice";

// slices

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  stateReconciler: autoMergeLevel2,

  // whitelist:[]
  blacklist: ["auth", "relationShip", "conversation", "message"],
};

const topReducer = combineReducers({
  app: appReducer,
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
