import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import SideBar from "./SideBar";
import { useSocket } from "../contexts/SocketProvider";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { selectUser, logout } from "../features/user";
import FriendRequestList from "./FriendRequestList";
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

function Dashboard() {
  let history = useHistory();
  const user = useSelector(selectUser);
  const friends = useSelector(selectFriends);
  const [selectedButton, setSelectedButton] = useState(2);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();
  const socket = useSocket();

  useEffect(() => {
    const loadRequests = async () => {
      const friendsList = await fetchFriends(user.user.id, 20, 1, +new Date());

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

    return () => socket.off("receiveFriendRequest");
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;

    socket.on("relationshipDeleted", (relationshipId, type) => {
      dispatch(
        deleteRelationship({
          relationshipId,
          type,
        })
      );
    });

    return () => socket.off("relationshipDeleted");
  }, [socket]);

  if (user.user === null) {
    <></>;
  }

  return (
    <div className="dashboard">
      <SideBar name={name} user_id={userId} />
      <div className="dashboard-panel-right">
        <Router>
          <Switch>
            <Route exact path="/dashboard/">
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
            </Route>
            <Route path="/dashboard/:chanel">
              <h1>CHANEL</h1>
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default Dashboard;
