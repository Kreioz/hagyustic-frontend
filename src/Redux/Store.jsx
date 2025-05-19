import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default: localStorage

import cartReducer from "./Slice/CartSlice";
import wishlistReducer from "./Slice/WishlistSlice";
import userReducer from "./Slice/UserSlice";

// Root reducer combining all slices
const rootReducer = combineReducers({
  cart: cartReducer,       // Cart items, quantity, total price
  wishlist: wishlistReducer, // Wishlist items
  user: userReducer,       // Authenticated user info + token
});

// redux-persist configuration to persist Redux state in localStorage
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

// Wrap root reducer with persistence logic
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux store with middleware and persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist compatibility
    }),
});

// Create persistor to control persistence layer (e.g., purge, rehydrate)
export const persistor = persistStore(store);
