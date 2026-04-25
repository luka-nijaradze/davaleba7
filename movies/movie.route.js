const express = require("express");
const router = express.Router();
const zod = require("zod");

const Movie = require("./movie.model");
const Director = require("../directors/director.model");

const schema = zod.object({
  title: zod.string().min(1),
});

router.post("/", async (req, res) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error.errors);
    }

    const directorId = req.headers["director-id"];

    if (!directorId) {
      return res.status(400).json({ message: "director-id is required" });
    }

    const director = await Director.findById(directorId);

    if (!director) {
      return res.status(404).json({ message: "Director not found" });
    }

    const movie = await Movie.create({
      title: result.data.title,
      director: directorId,
    });

    await Director.findByIdAndUpdate(directorId, {
      $push: { movies: movie._id },
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

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json(result.error.errors);
    }

    const updated = await Movie.findByIdAndUpdate(
      req.params.id,
      { title: result.data.title },
      { new: true },
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    await Director.findByIdAndUpdate(movie.director, {
      $pull: { movies: movie._id },
    });

    await Movie.findByIdAndDelete(req.params.id);

    res.json({ message: "Movie deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
