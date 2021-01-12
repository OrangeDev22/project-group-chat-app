import React, { useState, useEffect, useCallBack } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectFriends, addFriendRequest } from "../features/friendsSlice";
import { Avatar, Button } from "@material-ui/core";
import { useSocket } from "../contexts/SocketProvider";
import { makeStyles } from "@material-ui/core";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  accept: {
    backgroundColor: "#23d300",
    color: "white",
    marginRight: 8,
  },
}));

function FriendRequestList() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const friends = useSelector(selectFriends);
  const [friendRequests, setFriendRequests] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setFriendRequests(friends.friendRequests);
  }, [friends.friendRequests]);

  useEffect(() => {
    if (socket == null) return;

    socket.on("receieveFriendRequest", function (senderName, senderId) {
      dispatch(
        addFriendRequest({
          friend: {
            name: senderName,
            id: senderId,
          },
        })
      );
    });

    return () => socket.off("receieveFriendRequest");
  }, [socket]);

  return (
    <div>
      {friendRequests.map((friend, index) => {
        return (
          <div className="right-panel-friend-request-item" key={index}>
            <Avatar className={classes.small} style={{ marginRight: 10 }}>
              {friend.name.charAt(0).toUpperCase()}
            </Avatar>
            <p>{friend.name}</p>
            <div className="friend-request-buttons-container">
              <Button
                variant="contained"
                size="small"
                className={classes.accept}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                size="small"
                color="secondary"
                style={{ marginLeft: 8 }}
              >
                Deny
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FriendRequestList;
