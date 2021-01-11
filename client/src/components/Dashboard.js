import React, { useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import SideBar from "./SideBar";
import { selectUser } from "../features/user";
import "../css/Dashboard.css";

function Dashboard() {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard">
      <SideBar user={user} />
      <div className="dashboard-panel-right">
        <h1>Welcome back {user.user.name}</h1>
      </div>
    </div>
  );
}

export default Dashboard;
