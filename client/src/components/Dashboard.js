import React, { useState, useEffect } from "react";
import Axios from "axios";

function Dashboard() {
  const [user, setUser] = useState([]);

  useEffect(async () => {
    let response = await fetch("http://localhost:5000/user", {
      method: "GET",
      credentials: "include",
    });
    let data = await response.json();
    console.log(data);
  }, []);

  return <div></div>;
}

export default Dashboard;
