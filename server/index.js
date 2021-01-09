const Express = require("express");
const { pool } = require("./dbConfig");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { render } = require("ejs");

const app = Express();
const PORT = 5000;
app.use(cors());
app.use(Express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.get("/users/register", (req, res) => {
  res.send("hello world");
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
