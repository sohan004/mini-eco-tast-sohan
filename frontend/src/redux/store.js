import { configureStore } from "@reduxjs/toolkit";
import { privateQuery } from "./api/privateQuery";
import sidebarReducer from "./slice/sideBarSlice";

const store = configureStore({
  reducer: {
    [privateQuery.reducerPath]: privateQuery.reducer,
    sideBar: sidebarReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(privateQuery.middleware),
});

export default store;
