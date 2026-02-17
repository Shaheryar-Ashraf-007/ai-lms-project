// store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./userSlice";
import courseReducer from "./courseSlice";
import lectureReducer from "./lectureSlice";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "course"], // persist only these slices
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  course: courseReducer,
  lecture: lectureReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Persistor
export const persistor = persistStore(store);
