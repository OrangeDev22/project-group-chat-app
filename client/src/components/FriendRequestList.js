import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { green, grey } from "@material-ui/core/colors";
import {
  selectFriends,
  setFriendRequests,
  deleteRelationship,
  addBlockedUser,
} from "../features/friendsSlice";
import { selectUser } from "../features/user";
import { Avatar, Button } from "@material-ui/core";
import { useSocket } from "../contexts/SocketProvider";
import { makeStyles } from "@material-ui/core";
import { fetchRequests, blockRelationship } from "../utils/useFetch";
import {
  List,
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
} from "react-virtualized";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: 10,
  },
  accept: {
    color: "white",
    marginRight: 8,
    backgroundColor: green[400],
    "&:hover": {
      background: green[500],
    },
  },
  blockUser: {
    color: "white",
    marginLeft: 8,
    backgroundColor: grey[800],
    "&:hover": {
      background: grey[500],
    },
  },
}));

function FriendRequestList() {
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50,
    })
  );
  const socket = useSocket();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const friends = useSelector(selectFriends);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const friendRequests = friends.friendRequests;
  const classes = useStyles();
  const numberPerPage = 20;

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e;
    let bottom = Math.ceil(scrollHeight) - Math.round(scrollTop);
    if (!loading) {
      if (bottom === clientHeight) {
        setPage((prev) => prev + 1);
      }
    }
  };

  const addFriendHandler = async (id, receiverName, senderName) => {
    console.log("USER ID", user.user_id);
    socket.emit("addFriend", id, senderName, receiverName, user.user.user_id);
  };

  const blockUserhandler = async (id, name) => {
    let response = await blockRelationship(id, "blocked_by_second");

    if (response) {
      dispatch(
        deleteRelationship({
          relationshipId: id,
          type: "pending_second_first",
        })
      );
      dispatch(
        addBlockedUser({
          relationship: {
            id,
            name,
            type: "blocked_by_second",
          },
        })
      );
    }
  };

  const handleDenyRequest = async (id) => {
    socket.emit("deleteRelationShip", id, "pending_second_first");
  };

  useEffect(() => {
    const loadRequests = async () => {
      let lastTimestamp = friendRequests[friendRequests.length - 1].timestamp;
      setLoading(true);
      const newFriendRequests = await fetchRequests(
        user.user.id,
        numberPerPage,
        page,
        "friend_request",
        lastTimestamp
      );
      if (newFriendRequests) {
        dispatch(setFriendRequests(newFriendRequests));
      }
      setLoading(false);
    };
    if (page > 1 && friendRequests.length > 0) {
      loadRequests();
    }
  }, [page]);

  return (
    <div className="right-panel">
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowHeight={cache.current.rowHeight}
            deferredMeasurementCache={cache.current}
            rowCount={friendRequests.length}
            onScroll={(e) => handleScroll(e)}
            rowRenderer={({ key, index, style, parent }) => {
              let request = friendRequests[index];
              return (
                <CellMeasurer
                  key={key}
                  cache={cache.current}
                  parent={parent}
                  columnIndex={0}
                  rowIndex={index}
                >
                  <div style={style} className="list_item">
                    {friendRequests && (
                      <div
                        className="right-panel-friend-request-item"
                        key={request.id}
                      >
                        <Avatar
                          className={classes.small}
                          style={{ marginRight: 10 }}
                        >
                          {request.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <p>{request.name}</p>
                        <div className="friend-request-buttons-container">
                          <Button
                            variant="contained"
                            size="small"
                            className={classes.accept}
                            onClick={() =>
                              addFriendHandler(
                                request.id,
                                user.user.name,
                                request.name
                              )
                            }
                          >
                            Accept
                          </Button>

                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => handleDenyRequest(request.id)}
                            style={{ marginLeft: 8 }}
                          >
                            Deny
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              blockUserhandler(request.id, request.name)
                            }
                            className={classes.blockUser}
                          >
                            Block
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CellMeasurer>
              );
            }}
          ></List>
        )}
      </AutoSizer>

      {loading && <h1>Loading...</h1>}
    </div>
  );
}

export default FriendRequestList;
