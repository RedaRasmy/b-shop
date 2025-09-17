import { configureStore , combineReducers } from "@reduxjs/toolkit"
import * as reducers from './slices'
import packageJson from "../../package.json"

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate,
} from "redux-persist";
import storage from "redux-persist/lib/storage"


// Parse version to get a numeric version
const getNumericVersion = (version: string) => {
  const [major, minor] = version.split('.').map(Number);
  return major * 1000 + minor; // 1.2.0 → 1002
}
const currentVersion = getNumericVersion(packageJson.version);

const migrations = {
  [currentVersion]: () => {
    // Return undefined to clear all persisted state
    return undefined;
  }
};

const persistConfig = {
    key: "persist",
    storage,
    version : currentVersion,
    migrate : createMigrate(migrations,{debug:true})
}

const rootReducer = combineReducers(reducers)

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
          middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }),
});


export type AppStore = typeof store
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]