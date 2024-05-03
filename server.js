require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/dbConnection");
const mongoose = require("mongoose");
const path = require("path");

const { User, Exercise } = require("./models/index");

//connect to the database
connectDB();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/api/users", async (req, res) => {
  const { username } = req.body;
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    const newUser = await User.create({ username });
    return res.json({
      _id: newUser._id,
      username: newUser.username,
    });
  } else {
    return res.json({ error: "Username already taken" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({});
    const list = users.map((user) => ({
      _id: user._id,
      username: user.username,
    }));
    res.json(list);
  } catch (e) {
    res.json({ error: e.message });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;
  let user = await User.findById(_id);
  if (!user) {
    res.json({ error: "User not found" });
  }
  let exercise = await Exercise.create({
    description,
    duration,
    date: date ? new Date(date) : new Date(),
    user: user._id,
  });
  user.log.push(exercise);
  user.count = user.log.length;
  await user.save();
  res.json({
    _id: user._id,
    username: user.username,
    date: exercise.date.toDateString(),
    duration: exercise.duration,
    description: exercise.description,
  });
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  try {
    let user = await User.findById(_id);
    if (!user) {
      return res.json({ error: "User not found" });
    }

    let logs = user.log;

    logs = logs.map((exercise) => ({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString(),
    }));

    res.json({
      _id: user._id,
      username: user.username,
      count: logs.length,
      log: logs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "connection error:"));
connection.once("open", () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  console.log("MongoDB database connection established successfully");
});
