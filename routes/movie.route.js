const express = require("express");
const router = express.Router();

const Movie = require("../models/movie.model");

router.post("/", async (req, res) => {
  try {
    const directorId = req.headers["director-id"];

    if (!directorId) {
      return res.status(400).json({
        message: "director-id is required",
      });
    }

    const movie = await Movie.create({
      title: req.body.title,
      director: directorId,
    });

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().populate("director");
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id).populate("director");
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
