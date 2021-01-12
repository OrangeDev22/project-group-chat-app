import React, { useState, useEffect } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { deepPurple } from "@material-ui/core/colors";
import { useDispatch, useSelector } from "react-redux";
import { login, selectUser } from "./features/user";
import "./App.css";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "fontsource-roboto";
import { SocketProvider } from "./contexts/SocketProvider";
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
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        let response = await fetch("http://localhost:5000/user", {
          method: "GET",
          credentials: "include",
        });
        let data = await response.json();

        if (data != null) {
          dispatch(
            login({
              email: data.email,
              name: data.user_name,
              user_id: data.user_id.slice(0, 4).toUpperCase(),
              id: data.id,
            })
          );
        }
      } catch (error) {
        console.error(error);
      }
      try {
        let response = await fetch("http://localhost:5000/user", {
          method: "GET",
          credentials: "include",
        });
        let data = await response.json();

        if (data != null) {
          dispatch(
            login({
              email: data.email,
              name: data.user_name,
              user_id: data.user_id.slice(0, 4).toUpperCase(),
              id: data.id,
            })
          );
        }
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (user.user !== null) setId(user.user.user_id);
  }, [user.user]);
  // const [id, setId] = useLocalStorage("id");
  // const [name, setName] = useLocalStorage("name");

  if (loading) {
    return <></>;
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <SocketProvider id={id}>
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
        </SocketProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
