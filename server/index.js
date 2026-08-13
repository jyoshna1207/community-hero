require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const issueRoutes = require("./routes/issues");
const eventRoutes = require("./routes/events");
const leaderboardRoutes = require("./routes/leaderboard");

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
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

app.get("/", (req, res) => {
  res.send("Community Hero Backend API is Running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});