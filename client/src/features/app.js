import { createSlice } from "@reduxjs/toolkit";
import useLocalStorage from "../hooks/useLocalStorage";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    conversations: [],
    selectedConversationIndex: -1,
    PREFIX: "groupchat-app-",
  },
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action) => {
      state.conversations = [action.payload, ...state.conversations];
    },
    setSelectedConversation: (state, action) => {
      state.selectedConversationIndex = action.payload;
    },
    addMessageinConversation: (state, action) => {
      const { senderName, text, index } = action.payload;
      let messages = state.conversations[index].messages;
      state.conversations[index].messages = [
        ...messages,
        { sender: senderName, text },
      ];
    },
  },
});

export const {
  setConversations,
  addConversation,
  setSelectedConversation,
  addMessageinConversation,
} = appSlice.actions;

export const selectApp = (state) => state.app;
export const selectConversations = (state) => state.app.conversations;
export const selectPrefix = (state) => state.app.PREFIX;

export default appSlice.reducer;
