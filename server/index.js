const Express = require("express");
const app = Express();
const http = require("http");
const server = http.createServer(app);
const PORT = 5000;
const cors = require("cors");
const socketio = require("socket.io");
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const { pool } = require("./dbConfig");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const flash = require("express-flash");

// Run when client connects
io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  socket.join(id);
  console.log("New WS Connection...", id);

  socket.on("sendFriendRequest", async (user1, user1Id, user2) => {
    if (user1 !== user2 && user2 !== "") {
      const searchUser = await pool.query(
        `SELECT * FROM users WHERE user_name = $1`,
        [user2]
      );
      if (searchUser.rows.length > 0) {
        let user2_id = searchUser.rows[0].user_id.slice(0, 4).toUpperCase();
        let user2Id = searchUser.rows[0].id;
        let relationShipExist = await verifyRelationShip(user1Id, user2Id);
        if (!relationShipExist) {
          console.log("ok so it doesnt exist");
          type = "pending_second_first";
          const newRelationShip = await pool.query(
            "INSERT INTO user_relationship (user_first_id, user_second_id, type) VALUES ($1, $2, $3) RETURNING *",
            [user1Id, user2Id, type]
          );
          if (newRelationShip.rows.length > 0) {
            relationshipId = newRelationShip.rows[0].id;
            socket.broadcast
              .to(user2_id)
              .emit("receieveFriendRequest", user1, id);
            socket.emit("returnFriendRequestResponse", true);
          } else {
            socket.emit("returnFriendRequestResponse", false);
          }
        } else {
          socket.emit("returnFriendRequestResponse", false);
        }
      } else {
        socket.emit("returnFriendRequestResponse", false);
      }
    }
  });
});

async function verifyRelationShip(user1Id, user2Id) {
  const searchRelationShip = await pool.query(
    "SELECT FROM user_relationship WHERE user_first_id = $1 AND user_second_id = $2",
    [user1Id, user2Id]
  );
  if (searchRelationShip.rows.length > 0) {
    return true;
  } else {
    return false;
  }
}

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
            id: user.id,
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

app.get("/user/data", async (req, res) => {
  console.log("body", req.query);
  const { id } = req.query;
  let searchRelationShips = await pool.query(
    "SELECT * FROM user_relationship WHERE user_first_id=$1 OR user_second_id=$1",
    [id]
  );
  if (searchRelationShips.rows.length > 0) {
    res.status(200).json(searchRelationShips.rows);
  } else {
    let response = { message: "didnt find any relationships" };
    res.status(400).json(response);
  }
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

server.listen(PORT, () => console.log("listening on port" + PORT));
