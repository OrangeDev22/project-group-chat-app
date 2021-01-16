import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/user";
import { selectUser } from "../features/user";
import { Button, TextField, InputAdornment } from "@material-ui/core";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import "../css/Login.css";

function Login() {
  let history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

    if (data.message === "Authenticated") {
      dispatch(
        login({
          email: data.user.email,
          name: data.user.name,
          user_id: data.user.user_id,
          id: data.user.id,
        })
      );
      window.location.replace("/dashboard");
    } else {
      setError(true);
      setErrorMessage(data.message);
    }
  };

  useEffect(() => {
    if (user.user != null) {
      window.location.replace("/dashboard");
    }
  }, []);

  if (user.user != null) {
    return <></>;
  }
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
          <p className="login-element error">{errorMessage}</p>
        </div>
        <TextField
          className="login-element"
          placeholder="Email"
          inputRef={emailRef}
          error={error}
          variant="outlined"
        />
        <TextField
          className="login-element"
          placeholder="password"
          variant="outlined"
          inputRef={passwordRef}
          error={error}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                className="show-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </InputAdornment>
            ),
          }}
          type={showPassword ? "text" : "password"}
        />
        <div className="login-element">
          Need a new account?
          <a href="/register" className="link">
            {" "}
            Register here :)
          </a>
        </div>
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
