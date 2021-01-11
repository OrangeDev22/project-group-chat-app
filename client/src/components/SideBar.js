import React, { useState } from "react";
import { Tabs, Tab } from "@material-ui/core";
import { TabPanel, TabContext } from "@material-ui/lab";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "../css/SideBar.css";

const useStyles = makeStyles((theme) => ({
  tabs: {
    backgroundColor: "#2f3136",
    width: 350,
  },
}));

function SideBar() {
  const classes = useStyles();
  let [selectedTab, setSelectedTab] = useState("1");
  return (
    <div className={`classes.tabs ${"sidebar"}`}>
      <TabContext value={selectedTab}>
        <div className="sidebar-tabs">
          {" "}
          <div className="sidebar-tabs-container">
            {" "}
            <Tabs
              value={selectedTab}
              variant="fullWidth"
              centered
              onChange={(e, value) => setSelectedTab(value)}
            >
              <Tab label="Messages" value="1" />
              <Tab label="Contacts" value="2" />
            </Tabs>
          </div>
        </div>
        <div className="sidebar-tabs-panel">
          <TabPanel value="1">Item One</TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
        </div>
        <div className="sidebar-tabs-button">
          <Button color="primary" variant="contained" size={"large"} fullWidth>
            {selectedTab === "1" ? "Create new Chat" : "Add new Contact"}
          </Button>
        </div>
      </TabContext>
    </div>
  );
}

export default SideBar;
