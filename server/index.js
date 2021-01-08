const Express = require("express");
const { pool } = require("./dbConfig");
const { bcrypt } = require("bcrypt");

const app = Express();
const PORT = 5000;
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.post("users/register", async (req, res) => {
  let { name, email, user_id, password, password2, canRegister } = req.body;
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
  if (errors.length === 0) {
    hashedPassword = await bcrypt.has(password, 10);
    pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email],
      (error, results) => {
        if (error) {
          console.log(error);
        }

        if (results.rows.length > 0) {
          console.log("user already registered");
        } else {
          pool.query(
            "INSERT INTO users (user_id,user_name,email, password) VALUES ($1, $2, $3, $4)",
            [user_id, name, email, password]
          );
        }
      }
    );
  }
});

app.listen(PORT, () => console.log("listening on port" + PORT));
