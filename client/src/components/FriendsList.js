import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from "@material-ui/core";
import {
  selectFriends,
  setFriends,
  deleteRelationship,
  addBlockedUser,
} from "../features/friendsSlice";
import { makeStyles } from "@material-ui/core";
import { selectUser } from "../features/user";
import { Menu, MenuItem, Fade } from "@material-ui/core";
import { fetchFriends, blockFriend } from "../utils/useFetch";
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
}));

function FriendsList({ isCreatingChat }) {
  const friendListRef = useRef();
  const friends = useSelector(selectFriends);
  const friendsList = friends.friends;
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const socket = useSocket();
  const numberPerPage = 40;
  const [selectedFriend, setSelectedFriend] = useState(-1);
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(false);
  const cache = useRef(
    new CellMeasurerCache({
      fixedWidth: true,
      defaultHeight: 50,
    })
  );

  const handleClick = (event, index) => {
    setAnchorEl(event.currentTarget);
    setSelectedFriend(index);
  };

  const handleClose = () => {
    setSelectedFriend(-1);
    setAnchorEl(null);
  };

  const deleteFriendHandler = (id) => {
    socket.emit("deleteRelationShip", id, "friends");
    setSelectedFriend(-1);
    setAnchorEl(null);
  };

  const blockFriendHandler = async (relationshipId, userId, friendName) => {
    let response = await blockFriend(relationshipId, userId);
    if (response) {
      console.log(response);
      dispatch(deleteRelationship({ relationshipId, type: "friends" }));
      dispatch(
        addBlockedUser({
          relationship: {
            id: relationshipId,
            name: friendName,
            type: response,
          },
        })
      );
      setSelectedFriend(-1);
      setAnchorEl(null);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e;
    let bottom = Math.ceil(scrollHeight) - Math.round(scrollTop);
    if (!loading) {
      if (bottom === clientHeight) {
        setPage((prev) => prev + 1);
      }
    }
  };

  useEffect(() => {
    const loadFriends = async () => {
      let lastTimestamp = friendsList[friendsList.length - 1].timestamp;
      setLoading(true);
      const newFriends = await fetchFriends(
        user.user.id,
        numberPerPage,
        page,
        lastTimestamp
      );
      if (newFriends) {
        dispatch(setFriends(newFriends));
      }
      setLoading(false);
    };
    if (page > 1 && friendsList.length > 0) {
      loadFriends();
    }
  }, [page]);

  return (
    <div className="friends_list" ref={friendListRef}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowHeight={cache.current.rowHeight}
            deferredMeasurementCache={cache.current}
            rowCount={friendsList.length}
            onScroll={(e) => handleScroll(e)}
            rowRenderer={({ key, index, style, parent }) => {
              let friend = friendsList[index];
              return (
                <CellMeasurer
                  key={key}
                  cache={cache.current}
                  parent={parent}
                  columnIndex={0}
                  rowIndex={index}
                >
                  <div
                    style={style}
                    className="list_item"
                    onClick={(e) => handleClick(e, index)}
                  >
                    {friendsList && (
                      <>
                        <div
                          className={`side_bar_friend_list_item ${
                            selectedFriend === index ? "selected_friend" : ""
                          }`}
                        >
                          <Avatar
                            className={classes.small}
                            style={{ marginRight: 10 }}
                          >
                            {friend.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <p>{friend.name}</p>
                        </div>
                      </>
                    )}
                  </div>
                </CellMeasurer>
              );
            }}
          ></List>
        )}
      </AutoSizer>
      <Menu
        id="friend_pop_up"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem
          onClick={() => deleteFriendHandler(friendsList[selectedFriend].id)}
        >
          Delete Friend
        </MenuItem>
        <MenuItem
          onClick={() =>
            blockFriendHandler(
              friendsList[selectedFriend].id,
              user.user.id,
              friendsList[selectedFriend].name
            )
          }
        >
          Block User
        </MenuItem>
      </Menu>
    </div>
  );
}

export default FriendsList;
