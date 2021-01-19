import { createSlice } from "@reduxjs/toolkit";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    conversations: [],
    selectedConversationIndex: -1,
  },
  reducers: {
    setConversation: (state, action) => {
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
  setConversation,
  addConversation,
  setSelectedConversation,
  addMessageinConversation,
} = appSlice.actions;

export const selectApp = (state) => state.app;
export const selectConversations = (state) => state.app.conversations;

export default appSlice.reducer;
