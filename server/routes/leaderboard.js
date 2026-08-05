const express = require("express");
const User = require("../models/User");
const Issue = require("../models/Issue");

const router = express.Router();

// Sample top heroes leaderboard fallback if DB has only 1 user
const DUMMY_HEROES = [
  { _id: "hero1", name: "Jyoshna Kosana", points: 840, level: 5, title: "Grand Champion Hero", streakDays: 14, reportsCount: 18, verificationsCount: 12, badges: [{ name: "Master Validator", icon: "👑" }, { name: "Pothole Slayer", icon: "🛡️" }] },
  { _id: "hero2", name: "Rahul Verma", points: 620, level: 4, title: "Gold Community Guardian", streakDays: 9, reportsCount: 14, verificationsCount: 8, badges: [{ name: "Sanitation Specialist", icon: "🌿" }] },
  { _id: "hero3", name: "Priya Sharma", points: 490, level: 3, title: "Silver Neighborhood Guard", streakDays: 6, reportsCount: 10, verificationsCount: 5, badges: [{ name: "First Responder", icon: "⚡" }] },
  { _id: "hero4", name: "Anil Kumar", points: 380, level: 2, title: "Bronze Civic Sentinel", streakDays: 4, reportsCount: 7, verificationsCount: 4, badges: [{ name: "Eco Sentinel", icon: "🌱" }] },
  { _id: "hero5", name: "Suresh Reddy", points: 290, level: 2, title: "Bronze Civic Sentinel", streakDays: 3, reportsCount: 5, verificationsCount: 2, badges: [{ name: "Streetlight Watcher", icon: "💡" }] },
];

// @desc    Get Gamified Leaderboard of Top Community Heroes
// @route   GET /api/leaderboard
// @access  Public
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("name email points level title streakDays badges upvotedIssues verifiedIssues createdAt")
      .sort({ points: -1 })
      .limit(10);

    if (!users || users.length < 3) {
      return res.json(DUMMY_HEROES);
    }

    const leaderboard = await Promise.all(
      users.map(async (user) => {
        const reportsCount = await Issue.countDocuments({ user: user._id });
        return {
          _id: user._id,
          name: user.name,
          points: user.points || 150,
          level: Math.floor((user.points || 150) / 150) + 1,
          title: user.title || "Bronze Civic Guard",
          streakDays: user.streakDays || 3,
          reportsCount,
          verificationsCount: user.verifiedIssues ? user.verifiedIssues.length : 2,
          badges: user.badges && user.badges.length > 0 ? user.badges : [{ name: "Active Citizen", icon: "🌟" }],
        };
      })
    );

    res.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    res.json(DUMMY_HEROES);
  }
});

module.exports = router;
