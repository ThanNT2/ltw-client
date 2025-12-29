// src/store/index.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // lưu vào localStorage
import userReducer from "./slices/userSlice";
import userManagementReducer from "./slices/userManagementSlice";
import vaultMasterReducer from "./slices/Vaults/vaultMasterSlice";
import { socketMiddleware } from "../socket/socketMiddleware";
import vaultAirdropReducer from "./slices/Vaults/vaultAirdropSlice";

// Cấu hình persist
const persistConfig = {
  key: "root",       // key lưu trên localStorage
  storage,           // storage = localStorage
  whitelist: ["user"] // chỉ persist slice "user"
};


// Combine reducers (sau này có nhiều slice thì gom lại ở đây)
const rootReducer = combineReducers({
  user: userReducer,
  userManagement: userManagementReducer,
  vaultMaster: vaultMasterReducer,
  vaultAirdrop: vaultAirdropReducer,
});

// Tạo persistedReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);


// Cấu hình store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // tắt cảnh báo redux-persist
    }).concat(socketMiddleware),
});

// Persistor (dùng cho PersistGate)
export const persistor = persistStore(store);

export default store;
