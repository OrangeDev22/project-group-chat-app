const Express = require("express");
const app = Express();
const PORT = 5000;
const { pool } = require("./dbConfig");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const flash = require("express-flash");

app.use(
  cors({
    origin: "http://localhost:3000", // <-- location of the react app were connecting to
    credentials: true,
  })
);

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.use(cookieParser("secretcode"));
app.use(flash());
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
// app.use(cookieParser("secretcode"));

app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
const initializePassport = require("./passportConfig");
initializePassport(passport);

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) {
      let response = {
        message: info.message,
      };
      res.json(response);
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        let response = {
          message: "Authenticated",
          user: {
            name: user.user_name,
            email: user.email,
            user_id: user.user_id,
          },
        };
        res.json(response);
        // console.log(req.user);
      });
    }
  })(req, res, next);
});

app.get("/user", (req, res) => {
  console.log("request user", req.user);
  res.json(req.user);
});

app.get("/logout", (req, res) => {
  req.logout();
  let response = { message: "logged out" };
  res.json(response);
});

app.post("/users/register", async (req, res) => {
  let { name, email, user_id, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password must be a least 6 characters long" });
  }

  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }
  const searchUser = await pool.query(
    `SELECT * FROM users WHERE email = $1 OR user_name =$2`,
    [email, name]
  );
  if (errors.length === 0) {
    hashedPassword = await bcrypt.hash(password, 10);

    if (searchUser.rows.length > 0) {
      if (searchUser.rows[0].email === email) {
        errors.push({ message: "Email already in use" });
      }
      if (searchUser.rows[0].user_name === name) {
        errors.push({ message: "User name already in use" });
      }
      res.json(errors);
    } else {
      await pool.query(
        "INSERT INTO users (user_id,user_name,email, password) VALUES ($1, $2, $3, $4) RETURNING *",
        [user_id, name, email, hashedPassword]
      );
      res.json(errors);
    }
  } else {
    res.json(errors);
  }
});

app.listen(PORT, () => console.log("listening on port" + PORT));
