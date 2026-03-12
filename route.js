const express = require("express");
const app = express();
const os = require('os');
// const os = require('node:os');


app.use(express.json());

function logger(req, res, next) {
  console.log("Request:", req.method, req.url);
  next();
}

app.use(logger);

app.get("/home", (req, res) => {
  res.send("Home Page");
});

app.get("/users", (req, res) => {
  res.send("Users List");
});

app.post("/users", (req, res) => {
  res.send("User Created");
});

app.put("/users", (req, res) => {
  res.send("User Updated");
});

app.delete("/home", (req, res) => {
  res.send("Home Page Deleted");
});

app.put("/home", (req, res) => {
  res.send("Home Page upddated");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

console.log(os.hostname());
console.log(os.platform());
console.log(os.freemem())