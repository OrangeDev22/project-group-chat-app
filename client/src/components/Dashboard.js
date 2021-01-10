import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user";
import Axios from "axios";

function Dashboard() {
  const user = useSelector(selectUser);

  useEffect(() => {
    console.log("user dashboard", user);
    // let response = await fetch("http://localhost:5000/user", {
    //   method: "GET",
    //   credentials: "include",
    // });
    // let data = await response.json();
    // console.log(data);
  }, []);
  console.log("user dashboard 2", user);
  return (
    <div>
      <h1>Welcome back {user.user.name}</h1>
    </div>
  );
}

export default Dashboard;
