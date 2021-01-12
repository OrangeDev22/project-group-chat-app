import { createSlice } from "@reduxjs/toolkit";
import { useSocket } from "../contexts/SocketProvider";
// const socket = useSocket();
export const appSlice = createSlice({
  name: "app",
  initialState: {
    channelId: null,
    channelName: null,
  },
  reducers: {
    setChannelId: (state, action) => {
      state.app += action.payload;
    },
    // sendFriendRequest: (state, action) => {
    //   const { user1, user2 } = action.payload;
    //   socket.emit("send-friend-request", { user1, user2 });
    // },
  },
});

export const { setChannelId } = appSlice.actions;

export const selectChannelId = (state) => state.channelId;
export const selectChannelName = (state) => state.channelName;

export default appSlice.reducer;
