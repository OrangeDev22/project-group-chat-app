import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user";
import appReducer from "../features/app";
import friendsReducer from "../features/friendsSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    app: appReducer,
    friends: friendsReducer,
  },
});
