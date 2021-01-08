import React, { useRef, useState } from "react";
import { Button, TextField, Container } from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import "./Register.css";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    border: 0,
    borderRadius: 15,
    color: "white",
  },
}));

function Register({ id, onIdSubmit }) {
  const classes = useStyles();
  const idRef = useRef();
  const nameRef = useRef();
  const formRef = useRef();
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formRef.current.reportValidity()) {
      console.log(nameRef.current);
      setError(false);
      console.log("submit working");
    } else {
      setError(true);
    }
  };

  return (
    <div className="login">
      <LockOutlinedIcon
        fontSize="large"
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
        noValidate
        autoComplete="off"
        action="submit"
        onSubmit={(e) => handleSubmit(e)}
        className="login-form"
        ref={formRef}
      >
        <TextField
          className="login-element"
          error={error}
          required
          id="outlined-required"
          placeholder="User Name"
          variant="outlined"
          helperText={error ? "This field is required" : ""}
        />
        <TextField
          className="login-element"
          error={error}
          required
          id="outlined-required"
          placeholder="Email"
          variant="outlined"
          type="email"
          helperText={error ? "This field is required" : ""}
        />
        <TextField
          className="login-element"
          error={error}
          required
          id="outlined-required"
          placeholder="Password"
          variant="outlined"
          type="password"
          helperText={error ? "This field is required" : ""}
        />
        <TextField
          className="login-element"
          error={error}
          required
          id="outlined-required"
          placeholder="Repeat Password"
          type="password"
          variant="outlined"
          helperText={error ? "This field is required" : ""}
        />

        <div className="login-button-container">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size={"large"}
            className="login-element"
          >
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Register;
