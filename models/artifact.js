const mongoose = require("mongoose");

const artifactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  age: {
    type: Number,
    min: [0, "Age must be positive"],
    max: [1500, "Age seems too high to be true"]
  },
  origin: {
    type: String,
    required: [true, "Origin is required"],
    minlength: [3, "Origin must be at least 3 characters long"]
  }
});

module.exports = mongoose.model("Artifact", artifactSchema);
