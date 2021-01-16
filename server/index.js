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

  socket.on("deleteRelationShip", async (id, type) => {
    try {
      const deleteRelationship = await pool.query(
        "DELETE FROM user_relationship WHERE id =$1",
        [id]
      );
      if (deleteRelationship.rowCount > 0) {
        socket.emit("relationshipDeleted", id, type);
      }
    } catch (error) {
      console.error("error", error);
    }
  });

  socket.on("sendFriendRequest", async (user1, user1Id, user2) => {
    let message = "";
    let relationshipId = "";
    if (user1 !== user2 && user2 !== "") {
      const searchUser = await pool.query(
        `SELECT * FROM users WHERE user_name = $1`,
        [user2]
      );
      if (searchUser.rows.length > 0) {
        let user2_id = searchUser.rows[0].user_id;
        let user2Id = searchUser.rows[0].id;
        let relationShipExist = await verifyRelationShip(user1Id, user2Id);
        if (!relationShipExist) {
          type = "pending_second_first";
          const newRelationShip = await pool.query(
            "INSERT INTO user_relationship (user_first_id, user_second_id, type, timestamp) VALUES ($1, $2, $3, $4) RETURNING *",
            [user1Id, user2Id, type, +new Date()]
          );
          if (newRelationShip.rows.length > 0) {
            relationshipId = newRelationShip.rows[0].id;
            socket.broadcast
              .to(user2_id)
              .emit("receiveFriendRequest", user1, relationshipId);
          } else {
            message = "Oops! something went wrong on our side!";
          }
        } else {
          message = "You already have relationship with this person";
        }
      } else {
        message =
          "We didn't find the user. :c please make sure of caps and typos";
      }
    } else {
      message =
        "WOW! Is good to love yourself but you can't befriend yourself in this app. :)";
    }
    socket.emit("returnFriendRequestResponse", message, user2, relationshipId);
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
      });
    }
  })(req, res, next);
});

app.get("/user", (req, res) => {
  res.json(req.user);
});

app.get("/user/requests", async (req, res) => {
  const userId = req.query.id;
  const npp = req.query.npp;
  const requestType = req.query.type;
  const column =
    requestType === "friend_request" ? "user_second_id" : "user_first_id";
  const numPerPage = parseInt(npp, 10) || 1;
  const page = parseInt(req.query.page, 10) || 0;
  const lastFetched = parseInt(req.query.lts, 10) || 0;
  const start = (page - 1) * numPerPage;
  const searchRelationShips = await pool.query(
    `SELECT * FROM user_relationship WHERE ${column}= $1 AND timestamp < $3 ORDER BY timestamp DESC LIMIT $2 `,
    [userId, numPerPage, lastFetched]
  );

  if (searchRelationShips.rows.length > 0) {
    let usersNames = [];
    for (let {
      id,
      user_first_id,
      user_second_id,
      type,
      timestamp,
    } of searchRelationShips.rows) {
      let userName = {};

      if (requestType === "friend_request") {
        userName = await pool.query("SELECT user_name FROM users WHERE id=$1", [
          user_first_id,
        ]);
      } else {
        userName = await pool.query("SELECT user_name FROM users WHERE id=$1", [
          user_second_id,
        ]);
      }

      if (userName.rows.length > 0) {
        let relationship = {
          id,
          name: userName.rows[0].user_name,
          type,
          timestamp,
        };
        type.includes("blocked") || usersNames.push(relationship);
      }
    }
    res.status(200).send(usersNames);
  } else {
    res.status(204).send("didnt find any relationships");
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  let response = { message: "logged out" };
  res.json(response);
});

app.get("/user/block", async (req, res) => {
  const userId = parseInt(req.query.id);
  const searchBlockedRelationships = await pool.query(
    "SELECT * FROM user_relationship WHERE user_first_id = $1 OR user_second_id = $1 AND type LIKE '%blocked%'",
    [userId]
  );
  if (searchBlockedRelationships.rows.length > 0) {
    let usersBlocked = [];
    for (let relationship of searchBlockedRelationships.rows) {
      let userBlockedId;
      if (relationship.user_first_id === userId) {
        userBlockedId =
          relationship.type === "blocked_by_first"
            ? relationship.user_second_id
            : null;
      } else {
        userBlockedId =
          relationship.type === "blocked_by_second"
            ? relationship.user_first_id
            : null;
      }
      if (userBlockedId) {
        const searchBlockedName = await pool.query(
          "SELECT user_name FROM users WHERE id =$1",
          [userBlockedId]
        );
        searchBlockedName.rows.length > 0 &&
          usersBlocked.push({
            name: searchBlockedName.rows[0].user_name,
            id: relationship.id,
            type: relationship.type,
          });
      }
    }
    usersBlocked.length > 0
      ? res.status(200).json(usersBlocked)
      : res.status(204).send("didn't find any blocked users");
  } else {
    res.status(200).send("didn't find any blocked users");
  }
});

app.put("/relationship/block", async (req, res) => {
  const relationshipId = parseInt(req.query.id);
  const newType = parseInt(req.query.type);
  try {
    const blockRelationship = await pool.query(
      "UPDATE user_relationship SET type = $1 WHERE id = $2",
      [newType, relationshipId]
    );

    if (blockRelationship.rowCount > 0) {
      res.status(200).send("blocked");
    } else {
      res.status(204).send("wasnt able to block");
    }
  } catch (error) {
    console.error(error);
  }
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

server.listen(PORT, () => {
  console.log("listening on port" + PORT);
  // > 27
  async function test() {
    for (let i = 0; i < 10; i++) {
      console.log("inserting");

      await pool.query(
        "INSERT INTO user_relationship (user_first_id, user_second_id, type, timestamp) VALUES ($1, $2, $3,$4) RETURNING *",
        [47, 48, "pending_second_first", +new Date()]
      );
    }
  }
  // test();
});
