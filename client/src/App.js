import React, { useState } from "react";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";
import { deepPurple } from "@material-ui/core/colors";
import "./App.css";
import useLocalStorage from "./hooks/useLocalStorage";
import Register from "./components/Register";
import "fontsource-roboto";
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
        <Register onIdSubmit={setId} id={id} />
      </ThemeProvider>
    </div>
  );
}

export default App;
