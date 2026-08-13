const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Waste Management",
        "Roads",
        "Water Supply",
        "Electricity",
        "Street Lights",
        "Drainage",
        "Public Safety",
        "Parks",
        "Other",
      ],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [20, "Description must be at least 20 characters long"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    latitude: {
      type: Number,
      default: 17.6868,
    },
    longitude: {
      type: Number,
      default: 83.2185,
    },
    locationCoords: {
      lat: { type: Number, default: 17.6868 },
      lng: { type: Number, default: 83.2185 },
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    },
    video: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Reported", "Under Review", "In Progress", "Resolved"],
      default: "Reported",
    },
    views: {
      type: Number,
      default: 125,
    },
    likes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    aiSeverity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    aiPriorityScore: {
      type: Number,
      default: 75,
    },
    aiEstimatedDays: {
      type: Number,
      default: 3,
    },
    aiTags: [
      {
        type: String,
      },
    ],
    upvotes: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    verifications: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: { type: String, default: "Community Verified" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    timeline: [
      {
        status: String,
        note: String,
        updatedBy: { type: String, default: "System / AI" },
        date: { type: Date, default: Date.now },
      },
    ],
    assignedDept: {
      type: String,
      default: "Municipal Public Works Department",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Issue", issueSchema);
