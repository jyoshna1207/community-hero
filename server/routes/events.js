const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { protect } = require("../middleware/authMiddleware");

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error("Fetch Events Error:", error);
    res.status(500).json({ message: "Server error retrieving events", error: error.message });
  }
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { title, category, date, time, location, description, maxVolunteers } = req.body;

    if (!title || !category || !date || !time || !location || !description || !maxVolunteers) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const event = await Event.create({
      title,
      category,
      date,
      time,
      location,
      description,
      maxVolunteers: Number(maxVolunteers),
      createdBy: req.user._id, // Set the logged-in user as the creator
    });

    res.status(201).json(event);
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ message: "Server error creating event", error: error.message });
  }
});

module.exports = router;
