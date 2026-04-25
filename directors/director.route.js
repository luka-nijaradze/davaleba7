const express = require("express");
const router = express.Router();
const zod = require("zod");

const Director = require("./director.model");
const Movie = require("../movies/movie.model");

const schema = zod.object({
  name: zod.string().min(1),
});

router.post("/", async (req, res) => {
  try {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(result.error.errors);
    }

    const director = await Director.create(result.data);
    res.json(director);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const directors = await Director.find().populate("movies");
    res.json(directors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const director = await Director.findById(req.params.id).populate("movies");

    if (!director) {
      return res.status(404).json({ message: "Director not found" });
    }

    res.json(director);
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

    const updated = await Director.findByIdAndUpdate(
      req.params.id,
      result.data,
      { new: true },
    );

    if (!updated) {
      return res.status(404).json({ message: "Director not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const director = await Director.findById(req.params.id);

    if (!director) {
      return res.status(404).json({ message: "Director not found" });
    }

    await Movie.deleteMany({ _id: { $in: director.movies } });

    await Director.findByIdAndDelete(req.params.id);

    res.json({ message: "Director and movies deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
