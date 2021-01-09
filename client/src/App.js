import React, { useState } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { deepPurple } from "@material-ui/core/colors";
import "./App.css";
import useLocalStorage from "./hooks/useLocalStorage";
import Register from "./components/Register";
import "fontsource-roboto";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple[400],
    },
    type: "dark",
  },
});

function App() {
  const [id, setId] = useLocalStorage("id");
  // const [name, setName] = useLocalStorage("name");
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/"><h1>HOME PAGE TEMPLATE</h1></Route>
            <Route path="/register">
              <Register onIdSubmit={setId} id={id} />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
