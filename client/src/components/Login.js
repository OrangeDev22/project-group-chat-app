import React, { useState, useRef } from "react";
import { Button, TextField, InputAdornment } from "@material-ui/core";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import "../css/Login.css";
function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(emailRef.current.value, passwordRef.current.value);
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
