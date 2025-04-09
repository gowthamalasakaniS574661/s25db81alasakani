const mongoose = require("mongoose");

const artifactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  origin: { type: String, required: true }
});

module.exports = mongoose.model("Artifact", artifactSchema);
