import React, { useRef, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/user";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import "./Register.css";
import { v4 as uuidv4 } from "uuid";

function Register() {
  let history = useHistory();
  const user = useSelector(selectUser);
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
          history.push("/");
        }
      } catch (error) {
        console.error("error", error.message);
      }
    }
  };
  if (user.user != null) {
    history.push("/dashboard");
  }
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
        <div className="register-element">
          Already have an account?{" "}
          <a href="/" className="link">
            {" "}
            Log in here :)
          </a>
        </div>
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
