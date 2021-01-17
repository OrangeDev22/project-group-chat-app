import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { Tabs, Tab, Avatar, Modal, TextField } from "@material-ui/core";
import { TabPanel, TabContext } from "@material-ui/lab";
import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "../css/SideBar.css";
import { selectUser } from "../features/user";
import {
  selectFriends,
  resetFriends,
  addPendingRequest,
  addFriend,
  deleteRelationship,
} from "../features/friendsSlice";
import { useSelector, useDispatch } from "react-redux";
import FriendsList from "./FriendsList";

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
  const [friends, setFriends] = useState([]);
  const [selectedTab, setSelectedTab] = useState("2");
  const [openFriendModal, setOpenFriendModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  let clickHandler = () => {
    setModalMessage("");
    setOpenFriendModal(true);
  };

  let handleClose = () => {
    openFriendModal && setOpenFriendModal(false);
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
            Item One
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
            Add Friend
            {/* {selectedTab === "1" ? "Create new Chat" : "Add new Contact"} */}
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
    </div>
  );
}

export default SideBar;
