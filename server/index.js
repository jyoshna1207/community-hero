const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const issueRoutes = require("./routes/issues");
const eventRoutes = require("./routes/events");
const leaderboardRoutes = require("./routes/leaderboard");

// Connect to MongoDB and seed default users
connectDB().then(() => {
  if (authRoutes.seedDemoUsers) {
    authRoutes.seedDemoUsers();
  }
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Auth routes
app.use("/api/auth", authRoutes);

// Issue routes
app.use("/api/issues", issueRoutes);

// Leaderboard routes
app.use("/api/leaderboard", leaderboardRoutes);

// Event routes
app.use("/api/events", eventRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/", (req, res) => {
  res.send("Community Hero Backend API is Running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});