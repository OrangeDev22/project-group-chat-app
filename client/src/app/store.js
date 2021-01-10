import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user";
import appReducer from "../features/app";

export default configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
  },
});
