const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

mongoose
  .connect("mongodb://localhost:27017", { dbName: "backend" })
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const users = mongoose.model("user", userSchema);

const app = express();

app.use(express.static(path.join(__dirname, "public"))); //express.static is a middleware thats why we use app.use to access this middleware.
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

let user = [];
app.get("/ejs", (req, res) => {
  res.render("index.ejs");
});
/** 
app.get("/add", async (req, res) => {
  await Messge.create({ name: "Abhishek", email: "aasheka@gmail.com" });
  res.send("Nioiice");
});
*/

const isAuthenticated = (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    next();
  } else {
    res.render("login.ejs");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout.ejs");
});

app.post("/login", (req, res) => {
  res.cookie("token", "imIn", {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });

  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.redirect("/");
});

app.post("/success", async (req, res) => {
  console.log(req.body);

  const { name, email } = req.body;

  const messageData = { name: name, email: email };

  await Messge.create(messageData);

  res.render("success.ejs", { name: "Sitesh" });
});

// app.get("/users", (req, res) => {
//   res.json({
//     user,
//   });
// });

// app.get("/success", (req, res) => {
//   res.render("success.ejs", { name: "Sitesh" });
// });

//with this we can render any html or js files by using  dirname and that file address
// app.get("/htm", (req, res) => {
//   res.sendFile(__dirname + "/index.htm");
// });

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
