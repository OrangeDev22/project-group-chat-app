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

function Register() {
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
  const [errorMessages, setErrorMessages] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !password2 || name.includes(" ")) {
      setError(true);
      let message = name.includes(" ")
        ? "Name format not valid"
        : "Please verify your fields";
      setErrorMessages([{ message }]);
    } else {
      setError(false);
      setErrorMessages([]);
      let user_id = uuidv4();
      try {
        const body = {
          name: name,
          email: email,
          user_id: user_id,
          password: password,
          password2: password2,
        };
        const response = await fetch("http://localhost:5000/users/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const jsonData = await response.json();
        if (jsonData.length > 0) {
          setErrorMessages(jsonData);
        } else {
          // console.log("submit working");
          setName("");
          setEmail("");
          setPassword("");
          setPassword2("");
        }
      } catch (error) {
        console.error("error", error.message);
      }
    }
  };

  return (
    <div className="register">
      <LockOutlinedIcon
        fontSize="large"
        className="register-icon"
        style={{
          margin: "10px",
          alignSelf: "center",
          backgroundColor: "#7e57c2",
          padding: "10px",
          borderRadius: "50%",
        }}
      />
      <form
        autoComplete="off"
        action="submit"
        onSubmit={(e) => handleSubmit(e)}
        className="register-form"
        ref={formRef}
      >
        <div className="">
          {errorMessages.map((error, index) => (
            <p className="register-element error" key={index}>
              {error.message}
            </p>
          ))}
        </div>

        <TextField
          className="register-element"
          error={error}
          required
          id="outlined-required"
          placeholder="User Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          className="register-element"
          error={error}
          required
          id="outlined-required"
          placeholder="Email"
          variant="outlined"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          className="register-element"
          error={error}
          required
          id="outlined-required"
          placeholder="Password"
          variant="outlined"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          className="register-element"
          error={error}
          required
          value={password2}
          id="outlined-required"
          placeholder="Repeat Password"
          type="password"
          variant="outlined"
          onChange={(e) => setPassword2(e.target.value)}
        />

        <div className="register-button-container">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size={"large"}
            className="register-element"
          >
            Create User
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Register;
