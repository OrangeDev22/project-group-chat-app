import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { deepPurple } from "@material-ui/core/colors";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "./features/user";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
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
  let history = useHistory();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(async () => {
    try {
      let response = await fetch("http://localhost:5000/user", {
        method: "GET",
        credentials: "include",
      });
      let data = await response.json();
      console.log("data in app", data);
      if (data != null) {
        dispatch(
          login({
            email: data.email,
            name: data.user_name,
            user_id: data.user_id.slice(0, 4).toUpperCase(),
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, []);
  // const [id, setId] = useLocalStorage("id");
  // const [name, setName] = useLocalStorage("name");

  if (loading) {
    return <></>;
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
