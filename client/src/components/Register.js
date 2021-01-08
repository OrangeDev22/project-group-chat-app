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
  const NAME_ERROR = 400,
    EMAIL_ERROR = 401,
    PASSWORD_ERROR = 401,
    PASSWORD2_ERROR = 402;
  const formRef = useRef();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [error, setError] = useState(false);
  const [error2, setError2] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleErrors() < 400) {
      setError(false);
      let user_id = uuidv4();
      try {
        const body = {
          name,
          email,
          user_id,
          password,
          password2,
        };
        console.log(JSON.stringify(body));
      } catch (error) {
        console.error(error.message);
      }
      console.log("submit working");
    } else {
      setError(true);
    }
  };

  const handleErrors = () => {
    if (!name) {
      return NAME_ERROR;
    } else if (!email) {
      return EMAIL_ERROR;
    } else if (!password) {
      return PASSWORD_ERROR;
    } else if (!password2) {
      return PASSWORD2_ERROR;
    } else {
      return 200;
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
          onChange={(e) => setName(e.target.value)}
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
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
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
          onChange={(e) => setPassword2(e.target.value)}
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
