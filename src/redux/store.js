import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { rootPersistConfig, rootReducer } from "./rootReducer";
// allow us to persit the data => if we close the tab or refresh the page, state wont be lost

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "api",
        ],
      },
    }),
  devTools: true,
});

const dispatch = store.dispatch;

const persistor = persistStore(store);

export { dispatch, persistor, store };
