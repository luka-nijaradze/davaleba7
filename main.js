const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

const directorRoutes = require("./directors/director.route");
const movieRoutes = require("./movies/movie.route");

app.use("/directors", directorRoutes);
app.use("/movies", movieRoutes);

app.get("/", (req, res) => {
  res.send("API working");
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");

  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });
});
  