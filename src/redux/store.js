import { createStore, combineReducers } from "redux";
import userReducer from "./reducer/userReducer";

import { LOG_OUT } from "../redux/action/types";

import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["userReducer"],
};

const rootReducer = combineReducers({
  userReducer,
});

const logoutReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
  }
  return rootReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, logoutReducer);

export const store = createStore(persistedReducer);
export const persistor = persistStore(store);
