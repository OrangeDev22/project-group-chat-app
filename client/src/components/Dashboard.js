import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import SideBar from "./SideBar";
import { selectUser, logout } from "../features/user";
import "../css/Dashboard.css";

function Dashboard() {
  let history = useHistory();
  const user = useSelector(selectUser);
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.user !== null) {
      setName(user.user.name);
      setUserId(user.user.user_id);
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
    history.push("/");
  }

  return (
    <div className="dashboard">
      <SideBar name={name} user_id={userId} />
      <div className="dashboard-panel-right">
        <Button onClick={() => handleLogout()}>Logout </Button>
        <h1>Welcome back {name}</h1>
      </div>
    </div>
  );
}

export default Dashboard;
