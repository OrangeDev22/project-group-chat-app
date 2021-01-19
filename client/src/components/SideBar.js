import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../contexts/SocketProvider";
import {
  Tabs,
  Tab,
  Avatar,
  Modal,
  TextField,
  Button,
  Checkbox,
} from "@material-ui/core";
import { TabPanel, TabContext } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import "../css/SideBar.css";
import { v4 as uuidv4 } from "uuid";
import { selectUser } from "../features/user";
import {
  selectFriends,
  resetFriends,
  addPendingRequest,
  addFriend,
  deleteRelationship,
} from "../features/friendsSlice";
import {
  selectApp,
  addConversation,
  setSelectedConversation,
} from "../features/app";
import { List } from "react-virtualized";
import { useSelector, useDispatch } from "react-redux";
import FriendsList from "./FriendsList";
import ConversationList from "./ConversationsList";

const useStyles = makeStyles((theme) => ({
  tabs: {
    backgroundColor: "#2f3136",
    width: 350,
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: "#36393f",
    outline: "none",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  modal: {
    display: "flex",
    padding: theme.spacing(2),
    alignItems: "center",
    justifyContent: "center",
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  tabPanel: {
    padding: 0,
    height: "100%",
  },
}));

function SideBar({ name, user_id }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const classes = useStyles();
  const modalInputRef = useRef();
  const socket = useSocket();
  const friends = useSelector(selectFriends);
  const app = useSelector(selectApp);
  const [friendsList, setFriendsList] = useState([]);
  const [selectedTab, setSelectedTab] = useState("2");
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [openFriendModal, setOpenFriendModal] = useState(false);
  const [openNewChatModal, setOpenNewChatModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const createConversation = (e) => {
    e.preventDefault();
    let recipients = [];
    let conversationId = uuidv4();
    selectedFriends.forEach((friend) => {
      let newRecipient = { name: friend.name, id: friend.id };
      recipients.push(newRecipient);
    });
    dispatch(setSelectedConversation(app.selectedConversationIndex + 1));
    dispatch(addConversation({ id: conversationId, recipients, messages: [] }));

    setOpenNewChatModal(false);
    setSelectedFriends([]);
  };

  let clickHandler = () => {
    setModalMessage("");
    selectedTab === "2" ? setOpenFriendModal(true) : setOpenNewChatModal(true);
  };

  let handleOpen = () => {
    if (selectedTab === "1") {
      setFriendsList(friends.friends.slice(0, 20));
    }
  };

  let handleClose = () => {
    selectedTab === "2"
      ? setOpenFriendModal(false)
      : setOpenNewChatModal(false);
    if (selectedTab === "1") {
      setFriendsList([]);
      setSelectedFriends([]);
    }
  };

  const changeTabHandler = (value) => {
    setSelectedTab(value);
    if (value === "1") {
      dispatch(resetFriends());
    }
  };

  useEffect(() => {
    if (socket == null) return;

    socket.on(
      "friendRequestAccepted",
      (relationshipId, name, user_id, type) => {
        let relationshipType =
          type === "receiver" ? "pending_second_first" : "request_sender";

        dispatch(
          deleteRelationship({
            relationshipId,
            type: relationshipType,
          })
        );

        dispatch(
          addFriend({
            friend: {
              relationshipId,
              name,
              user_id,
            },
          })
        );
      }
    );

    return () => socket.off("friendRequestAccepted");
  }, [socket]);

  let handleSendFriendRequest = (e) => {
    e.preventDefault();
    let user2 = modalInputRef.current.value;
    let user1 = user.user;
    socket.emit("sendFriendRequest", user1.name, user1.id, user2);
    socket.on("returnFriendRequestResponse", function (message, name, id) {
      if (!message) {
        setOpenFriendModal(false);
        dispatch(
          addPendingRequest({
            relationship: {
              name,
              id,
            },
          })
        );
      } else {
        setModalMessage(message);
      }
      socket.off("returnFriendRequestResponse");
    });
  };

  const handleChangeCheckBox = (friendId, friendName) => {
    setSelectedFriends((prev) => {
      prev.filter((prevFriend) => prevFriend.id !== friendId);
      if (containsFriend(prev, friendId)) {
        return prev.filter((prevFriend) => {
          return friendId !== prevFriend.id;
        });
      } else {
        return [...prev, { id: friendId, name: friendName }];
      }
    });
  };

  const containsFriend = (friendsList, friendId) => {
    let found = false;
    for (let friend of friendsList) {
      if (friend.id === friendId) {
        found = true;
        break;
      }
    }
    return found;
  };

  const bodyNewChatModal = (
    <div className={classes.paper}>
      <form
        action="submit"
        className="modal-form"
        onSubmit={(e) => {
          createConversation(e);
        }}
      >
        <div className="error" style={{ margin: 8 }}>
          {modalMessage}
        </div>
        <h3 style={{ margin: 8 }}>Create new chat</h3>
        <List
          width={350}
          height={300}
          rowHeight={50}
          rowCount={friendsList.length}
          // onScroll={(e) => handleScroll(e)}
          rowRenderer={({ key, index, style, parent }) => {
            let friend = friendsList[index];
            return (
              <div
                style={style}
                key={key}
                className="modal_list_item"
                // onClick={(e) => handleClick(e, index)}
              >
                <Checkbox
                  inputProps={{ "aria-label": "Checkbox A" }}
                  onChange={() =>
                    handleChangeCheckBox(friend.user_id, friend.name)
                  }
                  color="primary"
                />
                {friendsList && (
                  <>
                    <div className="side_bar_modal_friends">
                      <p>{friend.name}</p>
                    </div>
                  </>
                )}
              </div>
            );
          }}
        ></List>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ margin: 8 }}
        >
          Create
        </Button>
      </form>
    </div>
  );

  const bodyFriendModal = (
    <div className={classes.paper}>
      <form
        action="submit"
        className="modal-form"
        onSubmit={(e) => {
          handleSendFriendRequest(e);
        }}
      >
        <div className="error" style={{ margin: 8 }}>
          {modalMessage}
        </div>
        <h3 style={{ margin: 8 }}>Send a request to</h3>
        <TextField
          className="modal-text-field"
          placeholder="Type the user name you want to add"
          variant="outlined"
          inputRef={modalInputRef}
          style={{ margin: 8 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ margin: 8 }}
        >
          Send Friend Request
        </Button>
      </form>
    </div>
  );

  return (
    <div className={`sidebar`}>
      <TabContext value={selectedTab}>
        <div className="sidebar-tabs">
          {" "}
          <div className="sidebar-tabs-container">
            {" "}
            <Tabs
              value={selectedTab}
              variant="fullWidth"
              centered
              onChange={(e, value) => changeTabHandler(value)}
            >
              <Tab label="Messages" value="1" />
              <Tab label="Friends" value="2" />
            </Tabs>
          </div>
        </div>
        <div className="sidebar-tabs-panel">
          <TabPanel value="1" className={classes.tabPanel}>
            <ConversationList />
          </TabPanel>
          <TabPanel value="2" className={classes.tabPanel}>
            <FriendsList></FriendsList>
          </TabPanel>
        </div>
        <div className="sidebar-bottom-container">
          <div className="sidebar-avatar-wrapper">
            <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
            <div className="sidebar-avatar-info">
              <p>{name}</p>
            </div>
          </div>
        </div>
        <div className="sidebar-button">
          <Button
            color="primary"
            variant="contained"
            size={"large"}
            fullWidth
            onClick={() => clickHandler()}
          >
            {selectedTab === "1" ? "Create new Chat" : "Add Friend"}
          </Button>
        </div>
      </TabContext>
      <Modal
        className={classes.modal}
        open={openFriendModal}
        onClose={handleClose}
      >
        {bodyFriendModal}
      </Modal>
      <Modal
        className={classes.modal}
        open={openNewChatModal}
        onRendered={handleOpen}
        onClose={handleClose}
      >
        {bodyNewChatModal}
      </Modal>
    </div>
  );
}

export default SideBar;
