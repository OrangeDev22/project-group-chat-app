import Express from "express";

const app = Express();
const port = 5000;
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => console.log("listening on port" + port));
