const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Director",
    required: true,
  },
});

module.exports = mongoose.model("Movie", movieSchema);
