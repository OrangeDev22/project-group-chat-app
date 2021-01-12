import { createSlice } from "@reduxjs/toolkit";

export const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    friends: ["Marco", "Pedro"],
    friendRequests: [],
  },
  reducers: {
    addFriend: (state, action) => {
      console.log("payload", action.payload);
      const newFriend = action.payload.friend;
      console.log("state in just friends", state.friends);
      state.friends = [...state.friends, newFriend];
    },
    addFriendRequest: (state, action) => {
      const newFriend = action.payload.friend;
      state.friendRequests = [...state.friendRequests, newFriend];
    },
  },
});

export const { addFriend, addFriendRequest } = friendsSlice.actions;

export const selectFriends = (state) => state.friends;
export const selectFriendRequests = (state) => state.friendRequests;

export default friendsSlice.reducer;
