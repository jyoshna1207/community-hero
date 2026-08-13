const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const formatUserResponse = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role || "citizen",
  points: user.points ?? 150,
  level: user.level ?? 1,
  title: user.title || "Bronze Civic Guard",
  badges: user.badges || [],
  streakDays: user.streakDays ?? 3,
  upvotedIssues: user.upvotedIssues || [],
  verifiedIssues: user.verifiedIssues || [],
  createdAt: user.createdAt,
  ...(token ? { token } : {}),
});

// Seed demo users for each role if missing
const seedDemoUsers = async () => {
  try {
    const demoAccounts = [
      { name: "Jyoshna Kosana", email: "citizen@hero.com", password: "password123", role: "citizen", points: 450, level: 3, title: "Gold Community Guardian" },
      { name: "Officer Rajesh Kumar", email: "officer@hero.com", password: "password123", role: "officer", points: 720, level: 5, title: "Ward 4 Chief Inspector" },
      { name: "Public Works Lead", email: "dept@hero.com", password: "password123", role: "department", points: 600, level: 4, title: "Municipal Operations Lead" },
      { name: "System Admin", email: "admin@hero.com", password: "password123", role: "admin", points: 1000, level: 10, title: "Super Municipal Admin" },
    ];

    for (const acc of demoAccounts) {
      const exists = await User.findOne({ email: acc.email });
      if (!exists) {
        await User.create(acc);
      }
    }
  } catch (err) {
    console.error("Demo user seed error:", err);
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const validRole = ["citizen", "admin", "officer", "department"].includes(role) ? role : "citizen";

    const user = await User.create({
      name,
      email,
      password,
      role: validRole,
    });

    if (user) {
      res.status(201).json(formatUserResponse(user, generateToken(user._id)));
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
});

// @desc    Authenticate user and get token
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  try {
    await seedDemoUsers();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json(formatUserResponse(user, generateToken(user._id)));
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    res.json(formatUserResponse(req.user));
  } catch (error) {
    console.error("Profile Fetch Error:", error);
    res.status(500).json({ message: "Server error retrieving profile", error: error.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.password && req.body.password.trim().length > 0) user.password = req.body.password;

    await user.save();
    res.json(formatUserResponse(user));
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server error updating profile", error: error.message });
  }
});

module.exports = router;
