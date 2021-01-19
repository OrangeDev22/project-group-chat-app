import React, { useState, useRef, useEffect, useCallback } from "react";
import { useHistory, useParams } from "react-router-dom";
import { selectUser } from "../features/user";
import { makeStyles } from "@material-ui/core";
import {
  selectApp,
  selectConversations,
  setSelectedConversation,
  addMessageinConversation,
} from "../features/app";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../contexts/SocketProvider";
import { TextField, Button } from "@material-ui/core";
import "../css/Conversation.css";

const useStyles = makeStyles((theme) => ({
  fromMe: {
    marginRight: 8,
    marginLeft: "auto",
  },
  messageFromMe: {
    backgroundColor: theme.palette.primary.main,
    marginRight: 8,
    marginLeft: "auto",
  },
}));

function OpenConversation() {
  const classes = useStyles();
  const history = useHistory();
  const socket = useSocket();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const { conversationId } = useParams();
  const app = useSelector(selectApp);
  const selectedConversationIndex = app.selectedConversationIndex;
  const conversations = useSelector(selectConversations);
  const messages = conversations[selectedConversationIndex]
    ? conversations[selectedConversationIndex].messages
    : [];
  const messageRef = useRef();
  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  const keyPressHandler = (e) => {
    if (e.key === "Enter") {
      sendMessageHandler(e);
    }
  };

  const sendMessageHandler = (e) => {
    e.preventDefault();
    const text = messageRef.current.value;
    const recipients = conversations[selectedConversationIndex].recipients;
    if (text) {
      const senderName = user.user.name;
      socket.emit("sendMessage", {
        recipients,
        text,
        senderName,
        conversationId,
      });
      dispatch(
        addMessageinConversation({
          text,
          senderName,
          index: selectedConversationIndex,
        })
      );
      messageRef.current.value = "";
    }
  };

  useEffect(() => {
    if (selectedConversationIndex === -1) {
      let index = 0;
      let found = false;
      for (let conversation of app.conversations) {
        if (conversation.id === conversationId) {
          dispatch(setSelectedConversation(index));
          found = true;
          break;
        }
        index++;
      }
      found || history.push("/dashboard");
    }
  }, []);

  return (
    <div className="conversation">
      <div className="conversation_button_wrapper">
        <Button
          className="conversation_close_button"
          inputRef={messageRef}
          onClick={() => {
            history.push("/dashboard");
          }}
        >
          Close Conversation
        </Button>
      </div>
      <div className="conversation_chat_container">
        {messages.map((message, index) => {
          const lastMessage = messages.length - 1 === index;
          return (
            <div
              className={`message_container ${
                message.sender === user.user.name ? classes.fromMe : ""
              }`}
              ref={lastMessage ? setRef : null}
              key={index}
            >
              <div className="message_wrapper">
                <div
                  className={`message_text_wrapper ${
                    message.sender === user.user.name
                      ? classes.messageFromMe
                      : ""
                  }`}
                >
                  <p className="message_text">{message.text}</p>
                </div>
              </div>
              <div
                className={`message_sender_wrapper ${
                  message.sender === user.user.name ? "from_me" : ""
                }`}
              >
                <p>
                  {message.sender === user.user.name ? "You" : message.sender}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <form
        action="submit"
        className="conversation_text_container"
        onSubmit={(e) => sendMessageHandler(e)}
      >
        <TextField
          className="conversation_message_input"
          placeholder="Write a message"
          inputRef={messageRef}
          multiline
          onKeyPress={keyPressHandler}
          rowsMax={4}
          style={{ margin: 5 }}
          variant="outlined"
        />
        <Button
          color="primary"
          variant="contained"
          size="large"
          type="submit"
          style={{ margin: 5 }}
        >
          SEND
        </Button>
      </form>
    </div>
  );
}

export default OpenConversation;
