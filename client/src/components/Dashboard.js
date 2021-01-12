import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import SideBar from "./SideBar";
import { useSocket } from "../contexts/SocketProvider";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { selectUser, logout } from "../features/user";
import FriendRequestList from "./FriendRequestList";
import "../css/Dashboard.css";

function Dashboard() {
  let history = useHistory();
  const user = useSelector(selectUser);
  const [selectedButton, setSelectedButton] = useState(0);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();
  const socket = useSocket();

  useEffect(() => {
    if (user.user !== null) {
      setName(user.user.name);
      setUserId(user.user.user_id);
    } else {
      history.push("/");
    }
  }, []);

  const handleLogout = async () => {
    let response = await fetch("http://localhost:5000/logout", {
      method: "GET",
      credentials: "include",
    });
    let data = await response.json();
    if (data.message === "logged out") {
      dispatch(logout());
      console.log("logged out");
      history.push("/");
    }
  };

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
                    onClick={() => setSelectedButton(0)}
                  >
                    Requests
                  </Button>
                  <Button
                    style={{ marginRight: 10 }}
                    size={"small"}
                    className="dashboard-buttongroup-button"
                    variant={selectedButton === 1 ? "contained" : "text"}
                    onClick={() => setSelectedButton(1)}
                  >
                    Pending
                  </Button>
                  <Button
                    size={"small"}
                    style={{ marginRight: 10 }}
                    className="dashboard-buttongroup-button"
                    variant={selectedButton === 2 ? "contained" : "text"}
                    onClick={() => setSelectedButton(2)}
                  >
                    Blocked
                  </Button>
                  <Button
                    size={"small"}
                    style={{ marginRight: 10 }}
                    className="dashboard-buttongroup-button"
                    variant={selectedButton === 3 ? "contained" : "text"}
                    onClick={() => setSelectedButton(3)}
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
              {selectedButton === 2 && <h2>Blocked template</h2>}
              {selectedButton === 3 && <h2>Settings template</h2>}
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
