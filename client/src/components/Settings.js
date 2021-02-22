import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user";
import { Button } from "@material-ui/core";

function Settings() {
  const user = useSelector(selectUser);

  return (
    <div className="settings">
      <div className="settings_item">
        <p className="settings_label">User name</p>
        <div className="settings_wrapper">
          <p>{user.user.name}</p>
          <Button
            style={{ marginLeft: "auto" }}
            color="primary"
            size="small"
            variant="contained"
          >
            Change
          </Button>
        </div>
      </div>
      <div className="settings_item">
        <p className="settings_label">Email</p>
        <div className="settings_wrapper">
          <p>{user.user.email}</p>
          <Button
            style={{ marginLeft: "auto" }}
            color="primary"
            variant="contained"
            size="small"
          >
            Change
          </Button>
        </div>
      </div>
      <div className="settings_item">
        <div className="settings_wrapper">
          <p>DELETE ACCOUNT</p>
          <Button
            style={{ marginLeft: "auto" }}
            color="secondary"
            variant="contained"
            size="small"
          >
            DELETE
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
