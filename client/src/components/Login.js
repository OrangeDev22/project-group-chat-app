import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, TextField, InputAdornment } from "@material-ui/core";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Axios from "axios";
import "../css/Login.css";

function Login() {
  let history = useHistory();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    let response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    let data = await response.json();
    // console.log("data", data.message);
    if (data.message === "Authenticated") {
      history.push("/dashboard");
    } else {
      console.log("failed", data);
    }
  };

  return (
    <div className="login">
      <LockOpenIcon
        className="login-icon"
        style={{
          margin: "10px",
          alignSelf: "center",
          backgroundColor: "#7e57c2",
          padding: "10px",
          borderRadius: "50%",
        }}
      />
      <form
        className="login-form"
        action="submit"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="login-errors">
          {errors.map((error) => (
            <p className="login-element error">{error.message}</p>
          ))}
        </div>
        <TextField
          className="login-element"
          placeholder="Email"
          inputRef={emailRef}
          variant="outlined"
        />
        <TextField
          className="login-element"
          placeholder="password"
          variant="outlined"
          inputRef={passwordRef}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </InputAdornment>
            ),
          }}
          type={showPassword ? "text" : "password"}
        />
        <Button
          className="login-element"
          variant="contained"
          type="submit"
          color="primary"
          size="large"
        >
          Log in
        </Button>
      </form>
    </div>
  );
}

export default Login;
