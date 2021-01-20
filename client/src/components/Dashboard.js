import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import SideBar from "./SideBar";
import { useSocket } from "../contexts/SocketProvider";
import OpenConversation from "./OpenConversation";
import { selectUser, logout } from "../features/user";
import FriendRequestList from "./FriendRequestList";
import {
  selectApp,
  selectConversations,
  addMessageinConversation,
  addConversation,
  setConversations,
  setSelectedConversation,
} from "../features/app";
import Setttings from "./Settings";
import {
  fetchFriends,
  fetchRequests,
  fetchBlockedRelationships,
} from "../utils/useFetch";
import BlockedList from "./BlockedList";
import {
  selectFriends,
  addFriendRequest,
  setFriends,
  setFriendRequests,
  resetFriendRequests,
  resetPendingRequests,
  setPendingRequests,
  deleteRelationship,
  setBlockedUsers,
  removeAll,
} from "../features/friendsSlice";
import "../css/Dashboard.css";
import PenddingRequests from "./PendingRequestsList";

const PREFIX = "groupchat-";

function Dashboard() {
  let history = useHistory();
  const app = useSelector(selectApp);
  const user = useSelector(selectUser);
  const conversations = useSelector(selectConversations);
  const friends = useSelector(selectFriends);
  const { conversationId } = useParams();
  const [selectedButton, setSelectedButton] = useState(2);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();
  const socket = useSocket();
  const key = user.user && `messages-${user.user.id}`;
  const prefixedKey = PREFIX + key;

  useEffect(() => {
    const loadRequests = async () => {
      const friendsList = await fetchFriends(user.user.id, 20, 1, +new Date());
      const jsonValue = localStorage.getItem(prefixedKey);
      const jsonObject = await JSON.parse(jsonValue);
      if (jsonValue != null) {
        dispatch(setConversations(jsonObject));
      }

      const FriendsRequests = await fetchRequests(
        user.user.id,
        20,
        1,
        "friend_request",
        +new Date()
      );
      const PenddingRequests = await fetchRequests(
        user.user.id,
        20,
        1,
        "pending_second_first",
        +new Date()
      );
      const BlockedUsers = await fetchBlockedRelationships(user.user.id);

      if (friendsList) {
        dispatch(setFriends(friendsList));
      }
      if (FriendsRequests) {
        dispatch(setFriendRequests(FriendsRequests));
      }
      if (PenddingRequests) {
        dispatch(setPendingRequests(PenddingRequests));
      }
      if (BlockedUsers) {
        dispatch(setBlockedUsers(BlockedUsers));
      }
    };

    if (user.user !== null) {
      setName(user.user.name);
      setUserId(user.user.user_id);
      loadRequests();
    } else {
      history.push("/");
    }
  }, []);

  const changeButtonHandler = (newButton) => {
    if (selectedButton === 0) {
      if (friends.friendRequests.length > 20) {
        dispatch(resetFriendRequests());
      }
    }
    if (selectedButton === 1) {
      if (friends.pendingRequests.length > 20) {
        dispatch(resetPendingRequests());
      }
    }
    setSelectedButton(newButton);
  };

  const handleLogout = async () => {
    let response = await fetch("http://localhost:5000/logout", {
      method: "GET",
      credentials: "include",
    });
    let data = await response.json();
    if (data.message === "logged out") {
      dispatch(logout());
      dispatch(removeAll());
      history.push("/");
    }
  };

  useEffect(() => {
    if (socket == null) return;

    socket.on(
      "receiveMessage",
      ({ recipients, sender, text, conversationId }) => {
        let found = false;
        for (let i = 0; i < conversations.length; i++) {
          if (conversations[i].id === conversationId) {
            found = true;
            dispatch(
              addMessageinConversation({ senderName: sender, text, index: i })
            );
            break;
          }
        }
        if (!found) {
          dispatch(
            addConversation({
              id: conversationId,
              recipients,
              messages: [{ sender, text }],
            })
          );
          if (app.selectedConversationIndex !== -1) {
            dispatch(
              setSelectedConversation(app.selectedConversationIndex + 1)
            );
          }
        }
      }
    );

    socket.on("relationshipDeleted", (relationshipId, type) => {
      console.log("type", type);
      dispatch(
        deleteRelationship({
          relationshipId,
          type,
        })
      );
    });

    socket.on("receiveFriendRequest", function (senderName, id) {
      dispatch(
        addFriendRequest({
          newFriendRequest: {
            name: senderName,
            id,
          },
        })
      );
    });
    return () => {
      socket.off("receiveMessage");
      socket.off("receiveFriendRequest");
      socket.off("relationshipDeleted");
    };
  }, [socket, app, conversations]);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(prefixedKey, JSON.stringify(conversations));
    }
  }, [conversations, prefixedKey]);

  return (
    <div className="dashboard">
      <SideBar name={name} user_id={userId} />
      {!conversationId && (
        <div className="dashboard-panel-right">
          <div className="dashboard-buttons-container">
            <div className="dashboard-buttongroup">
              <Button
                style={{ marginRight: 10 }}
                size={"small"}
                className="dashboard-buttongroup-button"
                variant={selectedButton === 0 ? "contained" : "text"}
                onClick={() => changeButtonHandler(0)}
              >
                Requests
              </Button>
              <Button
                style={{ marginRight: 10 }}
                size={"small"}
                className="dashboard-buttongroup-button"
                variant={selectedButton === 1 ? "contained" : "text"}
                onClick={() => changeButtonHandler(1)}
              >
                Pending
              </Button>
              <Button
                size={"small"}
                style={{ marginRight: 10 }}
                className="dashboard-buttongroup-button"
                variant={selectedButton === 2 ? "contained" : "text"}
                onClick={() => changeButtonHandler(2)}
              >
                Blocked
              </Button>

              <Button
                size={"small"}
                style={{ marginRight: 10 }}
                className="dashboard-buttongroup-button"
                variant={selectedButton === 3 ? "contained" : "text"}
                onClick={() => changeButtonHandler(3)}
              >
                Settings
              </Button>

              <Button
                size={"small"}
                style={{ marginRight: 10 }}
                className="dashboard-buttongroup-button"
                onClick={() => handleLogout()}
                variant="contained"
                color={"secondary"}
              >
                Logout{" "}
              </Button>
            </div>
          </div>
          {selectedButton === 0 && <FriendRequestList />}
          {selectedButton === 1 && <PenddingRequests />}
          {selectedButton === 2 && <BlockedList />}
          {selectedButton === 3 && <Setttings />}
        </div>
      )}
      {conversationId && <OpenConversation />}
    </div>
  );
}

export default Dashboard;
