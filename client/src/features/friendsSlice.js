import { createSlice } from "@reduxjs/toolkit";

export const friendsSlice = createSlice({
  name: "friends",
  initialState: {
    friends: [],
    friendRequests: [],
    pendingRequests: [],
    usersBlocked: [],
  },
  reducers: {
    addFriend: (state, action) => {
      const newFriend = action.payload.friend;
      state.friends = [newFriend, ...state.friends];
    },
    addFriendRequest: (state, action) => {
      const newRequest = action.payload.newFriendRequest;
      const tempArray = state.friendRequests;
      tempArray.unshift(newRequest);
      state.friendRequests = tempArray;
    },
    addPendingRequest: (state, action) => {
      const newPendingRequest = action.payload.relationship;
      const tempArray = state.pendingRequests;
      tempArray.unshift(newPendingRequest);
      state.pendingRequests = tempArray;
    },
    addBlockedUser: (state, action) => {
      const newUserBlocked = action.payload.relationship;
      state.usersBlocked = [newUserBlocked, ...state.usersBlocked];
    },
    setFriends: (state, action) => {
      state.friends = [...state.friends, ...action.payload];
    },
    setBlockedUsers: (state, action) => {
      state.usersBlocked = [...state.usersBlocked, ...action.payload];
    },
    setPendingRequests: (state, action) => {
      state.pendingRequests = [...state.pendingRequests, ...action.payload];
    },
    setFriendRequests: (state, action) => {
      state.friendRequests = [...state.friendRequests, ...action.payload];
    },
    resetFriends: (state) => {
      state.friends = state.friends.slice(0, 20);
    },
    resetFriendRequests: (state) => {
      state.friendRequests = state.friendRequests.slice(0, 20);
    },
    resetPendingRequests: (state) => {
      state.pendingRequests = state.pendingRequests.slice(0, 20);
    },
    deleteRelationship: (state, action) => {
      const { relationshipId, type } = action.payload;

      switch (type) {
        case "friends":
          state.friends = state.friends.filter(
            (friend) => friend.id !== relationshipId
          );
          break;
        case "request_sender":
          state.pendingRequests = state.pendingRequests.filter(
            (relationship) => relationship.id !== relationshipId
          );
          break;
        case "pending_second_first":
          state.friendRequests = state.friendRequests.filter(
            (relationship) => relationship.id !== relationshipId
          );
          break;
        case "blocked_by_second":
        case "blocked_by_first":
          state.usersBlocked = state.usersBlocked.filter(
            (relationship) => relationship.id !== relationshipId
          );
          break;
      }
    },
    removeAll: (state) => {
      state.friends = [];
      state.friendRequests = [];
      state.pendingRequests = [];
      state.usersBlocked = [];
    },
  },
});

export const {
  addFriend,
  addFriendRequest,
  setFriends,
  setFriendRequests,
  setPendingRequests,
  addPendingRequest,
  resetFriends,
  deleteRelationship,
  resetFriendRequests,
  removeAll,
  addBlockedUser,
  setBlockedUsers,
  resetPendingRequests,
} = friendsSlice.actions;

export const selectFriends = (state) => state.friends;

export default friendsSlice.reducer;
