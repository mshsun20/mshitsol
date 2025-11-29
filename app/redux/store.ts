import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Import Reducers (convert these to TS later)
import authReducer from "./slices/authSlice";
import { snackbarReducer } from "./slices/snackbar";
import { functionRefreshReducer } from "./slices/functionRefresh";

// ─────────────────────────────────────────────
// Persist Config
// ─────────────────────────────────────────────
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist auth slice
};

// ─────────────────────────────────────────────
// Root Reducer
// ─────────────────────────────────────────────
const rootReducer = combineReducers({
  auth: authReducer,
  snackbar: snackbarReducer,
  functionRefresh: functionRefreshReducer,
});

// Wrap reducer with persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// ─────────────────────────────────────────────
// Persistor
// ─────────────────────────────────────────────
export const persistor = persistStore(store);

// ─────────────────────────────────────────────
// Types for entire app
// ─────────────────────────────────────────────
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
