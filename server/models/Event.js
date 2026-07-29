const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add an event title"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Please select a category"],
    enum: ["Cleanliness", "Education", "Health", "Plantation", "Awareness"],
  },
  date: {
    type: String,
    required: [true, "Please add a date"],
  },
  time: {
    type: String,
    required: [true, "Please add a time"],
  },
  location: {
    type: String,
    required: [true, "Please add a location"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please add a description"],
    trim: true,
  },
  maxVolunteers: {
    type: Number,
    required: [true, "Please specify maximum volunteers"],
    min: [1, "Maximum volunteers must be at least 1"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", EventSchema);
