const express = require("express");
const Issue = require("../models/Issue");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Initial sample seed data with rich coords, AI tags, and initial upvotes
const SAMPLE_ISSUES = [
  {
    title: "Garbage Dump Near Community Center",
    category: "Waste Management",
    location: "Gajuwaka Main Road",
    locationCoords: { lat: 17.6868, lng: 83.2185 },
    status: "Reported",
    aiSeverity: "High",
    aiPriorityScore: 88,
    aiEstimatedDays: 2,
    aiTags: ["#PublicHealth", "#SanitationRisk", "#HighOdor"],
    description: "Unattended heap of household waste accumulating near the entrance of the community center, causing severe foul odor and health risks to visitors and residents.",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    reportedDate: new Date("2026-07-24"),
    assignedDept: "GVMC Waste Management Cell",
  },
  {
    title: "Severe Pothole on Main Arterial Intersection",
    category: "Roads",
    location: "MVP Colony 5th Lane",
    locationCoords: { lat: 17.7412, lng: 83.3312 },
    status: "In Progress",
    aiSeverity: "Critical",
    aiPriorityScore: 95,
    aiEstimatedDays: 1,
    aiTags: ["#TrafficHazard", "#TwoWheelerDanger", "#MonsoonDamage"],
    description: "Deep 8-inch pothole caused by heavy rainfall right at the busiest four-way junction. Poses severe crash risk for commuters during evening hours.",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    reportedDate: new Date("2026-07-22"),
    assignedDept: "Public Works Department (Roads Branch)",
  },
  {
    title: "Burst Pipeline Leaking Clean Drinking Water",
    category: "Water Supply",
    location: "Madhurawada Sector 3",
    locationCoords: { lat: 17.8012, lng: 83.3512 },
    status: "Resolved",
    aiSeverity: "High",
    aiPriorityScore: 82,
    aiEstimatedDays: 1,
    aiTags: ["#WaterConservation", "#InfrastructureBurst", "#Resolved"],
    description: "Underground main water pipeline burst leaking over 5,000 liters of clean drinking water daily onto the main road. Successfully repaired by municipal team.",
    image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80",
    reportedDate: new Date("2026-07-18"),
    assignedDept: "Water Supply & Sewerage Board",
  },
  {
    title: "Unlit Streetlights Creating Dark Safety Corridor",
    category: "Street Lights",
    location: "Steel Plant Highway Outer Stretch",
    locationCoords: { lat: 17.6512, lng: 83.1812 },
    status: "Reported",
    aiSeverity: "Medium",
    aiPriorityScore: 70,
    aiEstimatedDays: 3,
    aiTags: ["#NightSafety", "#PedestrianZone", "#ElectricalFault"],
    description: "A stretch of 6 consecutive high-mast street lights are out, creating a dark, unsafe corridor for shift workers and pedestrians at night.",
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    reportedDate: new Date("2026-07-25"),
    assignedDept: "Electrical Maintenance Board",
  },
  {
    title: "Overflowing Stormwater Drain Spilling Black Water",
    category: "Drainage",
    location: "NAD Junction Commercial Hub",
    locationCoords: { lat: 17.7289, lng: 83.2514 },
    status: "In Progress",
    aiSeverity: "Critical",
    aiPriorityScore: 91,
    aiEstimatedDays: 2,
    aiTags: ["#MonsoonOverflow", "#FootpathBlockage", "#CommercialRisk"],
    description: "Clogged underground drainage channel overflowing onto the commercial walkway, halting pedestrian access and affecting local shopkeepers.",
    image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    reportedDate: new Date("2026-07-21"),
    assignedDept: "Drainage & Sewerage Wing",
  },
  {
    title: "Open Hazardous Burning of Commercial Plastic",
    category: "Public Safety",
    location: "Kurmannapalem Vacant Plots",
    locationCoords: { lat: 17.6321, lng: 83.1589 },
    status: "Reported",
    aiSeverity: "High",
    aiPriorityScore: 86,
    aiEstimatedDays: 2,
    aiTags: ["#ToxicFumes", "#EnvironmentalHazard", "#IllegalBurning"],
    description: "Open burning of commercial plastic packing waste occurring every evening, filling nearby apartment complexes with toxic black smoke.",
    image: "https://images.unsplash.com/photo-1611284446314-60a55ac0d494?auto=format&fit=crop&w=800&q=80",
    reportedDate: new Date("2026-07-26"),
    assignedDept: "Environmental Protection Task Force",
  },
];

// Helper to seed sample data if DB is empty (Disabled to allow clean fresh issue testing)
const seedSampleIssuesIfEmpty = async () => {
  // Disabled auto-seeding to keep database fresh and clean as requested by user
  return;
};

// @desc    Purge/Delete all issues from database
// @route   DELETE /api/issues/purge-all
// @access  Public
router.delete("/purge-all", async (req, res) => {
  try {
    const result = await Issue.deleteMany({});
    res.json({ message: "All issues removed successfully", deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ message: "Error clearing issues", error: error.message });
  }
});

// @desc    AI Intelligent Analysis endpoint using Google Gemini
// @route   POST /api/issues/ai-analyze
// @access  Public
const { GoogleGenAI } = require("@google/genai");

router.post("/ai-analyze", async (req, res) => {
  try {
    const { title = "", description = "", image = "" } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not found in .env, falling back to mock analysis");
      // Fallback mock logic if no API key is provided
      const text = `${title} ${description}`.toLowerCase();
      let category = "Other";
      let aiSeverity = "Medium";
      let aiPriorityScore = 65;
      let aiEstimatedDays = 3;
      let aiTags = ["#CommunityReport"];

      if (text.includes("pothole") || text.includes("road") || text.includes("crack") || text.includes("asphalt")) {
        category = "Roads";
        aiSeverity = text.includes("deep") || text.includes("severe") || text.includes("accident") ? "Critical" : "High";
        aiPriorityScore = aiSeverity === "Critical" ? 94 : 82;
        aiEstimatedDays = 2;
        aiTags = ["#RoadHazard", "#TrafficSafety", "#PotholeAlert"];
      } else if (text.includes("garbage") || text.includes("waste") || text.includes("trash") || text.includes("dump")) {
        category = "Waste Management";
        aiSeverity = text.includes("toxic") || text.includes("school") || text.includes("odor") ? "High" : "Medium";
        aiPriorityScore = 80;
        aiEstimatedDays = 1;
        aiTags = ["#CleanNeighborhood", "#Sanitation", "#WasteRemoval"];
      } else if (text.includes("water") || text.includes("leak") || text.includes("pipe") || text.includes("burst")) {
        category = "Water Supply";
        aiSeverity = text.includes("burst") || text.includes("drinking") ? "Critical" : "High";
        aiPriorityScore = 90;
        aiEstimatedDays = 1;
        aiTags = ["#WaterConservation", "#PipeBurst", "#CivicResource"];
      }
      return res.json({
        category,
        aiSeverity,
        aiPriorityScore,
        aiEstimatedDays,
        aiTags,
        suggestedDept: `GVMC ${category} Task Force`,
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    let parts = [];
    parts.push({
        text: `Analyze this community issue report.
Title: ${title}
Description: ${description}

Classify the issue strictly into one of these categories: "Waste Management", "Roads", "Water Supply", "Electricity", "Street Lights", "Drainage", "Public Safety", "Parks", "Other".
Determine Severity ("Low", "Medium", "High", "Critical").
Estimate Priority Score (0 to 100).
Estimate Fix Days (integer).
Provide 3 relevant hashtag tags.

Return ONLY a valid JSON object matching this exact structure:
{
  "category": "String",
  "aiSeverity": "String",
  "aiPriorityScore": Number,
  "aiEstimatedDays": Number,
  "aiTags": ["String", "String", "String"]
}`
    });

    if (image && image.startsWith("data:image/")) {
      // Extract base64 and mime type
      const mimeTypeMatch = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
      const base64Data = image.split(",")[1];
      
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: parts
    });

    const responseText = response.text().replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(responseText);

    res.json({
      ...parsed,
      suggestedDept: `GVMC ${parsed.category} Task Force`,
    });
  } catch (error) {
    console.error("AI analysis failed:", error);
    res.status(500).json({ message: "AI analysis failed", error: error.message });
  }
});

// @desc    Predictive Insights endpoint
// @route   GET /api/issues/insights
// @access  Public
router.get("/insights", async (req, res) => {
  try {
    await seedSampleIssuesIfEmpty();

    const insights = {
      hotspots: [
        { zone: "Gajuwaka Main Road Corridor", riskLevel: "Critical Risk (92%)", primaryIssue: "Waste Dumping & Drain Blockage", recommendedAction: "Deploy daily compaction trucks & clear storm drains" },
        { zone: "MVP Colony Intersection", riskLevel: "High Risk (84%)", primaryIssue: "Road Potholes & Rain Erosion", recommendedAction: "Apply quick-curing cold asphalt patch" },
        { zone: "NAD Junction Commercial Area", riskLevel: "High Risk (79%)", primaryIssue: "Stormwater Drain Overflow", recommendedAction: "Clear underground silt traps before monsoon peak" },
        { zone: "Steel Plant Outer Belt", riskLevel: "Moderate Risk (65%)", primaryIssue: "Unlit Streetlights", recommendedAction: "Upgrade high-mast bulbs to smart LED grid" },
      ],
      seasonalForecast: [
        { season: "Monsoon Period (July - Sept)", forecast: "High risk of drainage overflow (+40%) & street pothole widening (+65%)" },
        { season: "Summer Season (March - June)", forecast: "Peak underground pipeline pressure leading to pipe bursts (+30%)" },
      ],
      civicEfficiencyScore: 89,
      totalWaterSavedLiters: 18500,
      totalPotholesSealed: 34,
      totalLightsRestored: 52,
    };

    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching insights", error: error.message });
  }
});

// @desc    Get all issues with optional filtering & search
// @route   GET /api/issues
// @access  Public
router.get("/", async (req, res) => {
  try {
    await seedSampleIssuesIfEmpty();

    const { search, category, status } = req.query;
    let query = {};

    if (category && category !== "All" && category !== "All Categories") {
      query.category = category;
    }

    if (status && status !== "All" && status !== "All Status") {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { category: searchRegex },
        { location: searchRegex },
        { description: searchRegex },
      ];
    }

    const issues = await Issue.find(query)
      .populate("user", "name email points level title")
      .sort({ createdAt: -1 });

    res.json(issues);
  } catch (error) {
    console.error("Get Issues Error:", error);
    res.status(500).json({ message: "Server error fetching issues", error: error.message });
  }
});

// @desc    Get dashboard metrics & stats
// @route   GET /api/issues/stats
// @access  Public
router.get("/stats", async (req, res) => {
  try {
    await seedSampleIssuesIfEmpty();

    const total = await Issue.countDocuments();
    const reported = await Issue.countDocuments({ status: "Reported" });
    const inProgress = await Issue.countDocuments({ status: "In Progress" });
    const resolved = await Issue.countDocuments({ status: "Resolved" });

    const categories = [
      "Waste Management",
      "Roads",
      "Water Supply",
      "Electricity",
      "Street Lights",
      "Drainage",
      "Public Safety",
      "Parks",
      "Other",
    ];

    const categoryCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Issue.countDocuments({ category: cat });
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return { category: cat, count, percentage };
      })
    );

    const recentReports = await Issue.find()
      .populate("user", "name level points")
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      total,
      reported,
      inProgress,
      resolved,
      pending: reported + inProgress,
      categoryCounts,
      recentReports,
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({ message: "Server error fetching stats", error: error.message });
  }
});

// @desc    Get my reported issues
// @route   GET /api/issues/my-reports
// @access  Private
router.get("/my-reports", protect, async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    console.error("Get My Reports Error:", error);
    res.status(500).json({ message: "Server error fetching your reports", error: error.message });
  }
});

// @desc    Get single issue by ID (Increments views count)
// @route   GET /api/issues/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("user", "name email points level title");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }
    res.json(issue);
  } catch (error) {
    console.error("Get Issue Error:", error);
    res.status(500).json({ message: "Server error fetching issue details", error: error.message });
  }
});

// @desc    Toggle Like on issue report
// @route   POST /api/issues/:id/like
// @access  Private
router.post("/:id/like", protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const userId = req.user._id.toString();
    const existingIndex = issue.likes.findIndex((l) => l.user.toString() === userId);

    let isLiked = false;
    if (existingIndex > -1) {
      issue.likes.splice(existingIndex, 1);
      isLiked = false;
    } else {
      issue.likes.push({ user: req.user._id });
      isLiked = true;
    }

    await issue.save();
    res.json({ message: isLiked ? "Liked report!" : "Unliked report!", likesCount: issue.likes.length, isLiked });
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ message: "Server error updating like status", error: error.message });
  }
});

// @desc    Update issue status & officer details (Ward Officer / Admin)
// @route   PUT /api/issues/:id/officer-update
// @access  Private / Public
router.put("/:id/officer-update", async (req, res) => {
  try {
    const { 
      status, priority, assignedDepartment, officerRemarks, 
      actionTaken, expectedResolutionDate, resolutionImage, 
      resolutionNote, updatedBy 
    } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (status) issue.status = status;
    if (priority) issue.priority = priority;
    if (assignedDepartment) issue.assignedDept = assignedDepartment;
    if (officerRemarks !== undefined) issue.officerRemarks = officerRemarks;
    if (actionTaken !== undefined) issue.actionTaken = actionTaken;
    if (expectedResolutionDate !== undefined) issue.expectedResolutionDate = expectedResolutionDate;
    if (resolutionImage !== undefined) issue.resolutionImage = resolutionImage;
    if (resolutionNote !== undefined) issue.resolutionNote = resolutionNote;
    if (updatedBy) issue.updatedByOfficer = updatedBy;

    // Timeline event record
    const statusNote = officerRemarks || actionTaken || `Status updated to ${status || issue.status}`;
    issue.timeline.push({
      status: status || issue.status,
      note: statusNote,
      updatedBy: updatedBy || "Ward Officer",
      date: new Date(),
    });

    await issue.save();
    const updated = await Issue.findById(req.params.id).populate("user", "name email points level title");
    res.json(updated);
  } catch (error) {
    console.error("Officer Update Error:", error);
    res.status(500).json({ message: "Server error updating issue by officer", error: error.message });
  }
});

// @desc    Update issue status (Admin / Authority)
// @route   PUT /api/issues/:id/status
// @access  Public / Private
router.put("/:id/status", async (req, res) => {
  try {
    const { status, note, updatedBy } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (status) {
      issue.status = status;
      issue.timeline.push({
        status: status,
        note: note || `Status updated to ${status}`,
        updatedBy: updatedBy || "Authority / Admin",
        date: new Date(),
      });
    }

    await issue.save();
    const updated = await Issue.findById(req.params.id).populate("user", "name email points level title");
    res.json(updated);
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ message: "Server error updating status", error: error.message });
  }
});

// @desc    Create new issue (Awards +50 XP to Reporter)
// @route   POST /api/issues
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      location,
      latitude,
      longitude,
      locationCoords,
      image,
      video,
      aiSeverity,
      aiPriorityScore,
      aiEstimatedDays,
      aiTags,
    } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const latVal = latitude !== undefined ? Number(latitude) : (locationCoords?.lat || locationCoords?.latitude || 17.6868);
    const lngVal = longitude !== undefined ? Number(longitude) : (locationCoords?.lng || locationCoords?.longitude || 83.2185);

    const issue = await Issue.create({
      title,
      category,
      description,
      location,
      latitude: latVal,
      longitude: lngVal,
      locationCoords: { lat: latVal, lng: lngVal },
      image: image || "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
      video: video || "",
      aiSeverity: aiSeverity || "Medium",
      aiPriorityScore: aiPriorityScore || 75,
      aiEstimatedDays: aiEstimatedDays || 3,
      aiTags: aiTags || ["#CitizenReport"],
      user: req.user._id,
      timeline: [
        { status: "Reported", note: "Issue logged by Citizen Hero (+50 XP)", updatedBy: req.user.name, date: new Date() },
        { status: "Under Review", note: "Auto-forwarded to Municipal Task Force", updatedBy: "AI Router", date: new Date() },
      ],
    });

    // Award +50 Hero XP to user for reporting an issue
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 50 },
    });

    const populatedIssue = await Issue.findById(issue._id).populate("user", "name email points level title");
    res.status(201).json(populatedIssue);
  } catch (error) {
    console.error("Create Issue Error:", error);
    res.status(500).json({ message: "Server error creating issue", error: error.message });
  }
});

// @desc    Upvote issue (+10 XP to upvoter, +5 XP to reporter)
// @route   POST /api/issues/:id/upvote
// @access  Private
router.post("/:id/upvote", protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Check if user already upvoted
    const alreadyUpvoted = issue.upvotes.some((u) => u.user.toString() === req.user._id.toString());
    if (alreadyUpvoted) {
      return res.status(400).json({ message: "You have already upvoted this issue!" });
    }

    issue.upvotes.push({ user: req.user._id });
    await issue.save();

    // Award +10 XP to voter
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 10 },
      $addToSet: { upvotedIssues: issue._id },
    });

    // Award +5 XP to issue owner
    if (issue.user) {
      await User.findByIdAndUpdate(issue.user, { $inc: { points: 5 } });
    }

    const updated = await Issue.findById(req.params.id).populate("user", "name points level");
    res.json({ message: "Upvoted! +10 XP awarded to you!", upvotesCount: updated.upvotes.length });
  } catch (error) {
    console.error("Upvote Error:", error);
    res.status(500).json({ message: "Server error upvoting issue", error: error.message });
  }
});

// @desc    Community verify issue (+20 XP)
// @route   POST /api/issues/:id/verify
// @access  Private
router.post("/:id/verify", protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const alreadyVerified = issue.verifications.some((v) => v.user.toString() === req.user._id.toString());
    if (alreadyVerified) {
      return res.status(400).json({ message: "You have already verified this issue!" });
    }

    const note = req.body.note || "Verified on-site by community member";
    issue.verifications.push({ user: req.user._id, note });
    
    // Add verification log to timeline
    issue.timeline.push({
      status: "Verified",
      note: `Verified by ${req.user.name}: "${note}"`,
      updatedBy: req.user.name,
      date: new Date(),
    });

    await issue.save();

    // Award +20 XP to verifier
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: 20 },
      $addToSet: { verifiedIssues: issue._id },
    });

    const updated = await Issue.findById(req.params.id).populate("user", "name points level");
    res.json({ message: "Issue verified! +20 XP awarded to you!", verificationsCount: updated.verifications.length });
  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({ message: "Server error verifying issue", error: error.message });
  }
});

// @desc    Update issue progress by Department (Accept, Progress %, Resolve)
// @route   PUT /api/issues/:id/department-progress
// @access  Public / Private
router.put("/:id/department-progress", async (req, res) => {
  try {
    const { action, progress, remarks, resolutionImage, updatedBy } = req.body;
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const officerName = updatedBy || "Department Field Team";

    if (action === "accept") {
      issue.status = "In Progress";
      issue.timeline.push({
        status: "In Progress",
        note: remarks || "Work order accepted by Municipal Department. Dispatch authorized.",
        updatedBy: officerName,
        date: new Date(),
      });
    } else if (action === "start") {
      issue.status = "In Progress";
      issue.timeline.push({
        status: "In Progress",
        note: remarks || "Field crew deployed on site with repair equipment.",
        updatedBy: officerName,
        date: new Date(),
      });
    } else if (action === "progress") {
      issue.status = "In Progress";
      issue.actionTaken = remarks || issue.actionTaken;
      issue.timeline.push({
        status: "In Progress",
        note: `Progress Milestone: ${progress || 50}% completed. Note: ${remarks || "Work proceeding as scheduled."}`,
        updatedBy: officerName,
        date: new Date(),
      });
    } else if (action === "complete" || action === "resolve") {
      issue.status = "Resolved";
      if (resolutionImage) issue.resolutionImage = resolutionImage;
      issue.resolutionNote = remarks || "Municipal repair completed. Before & after evidence logged.";
      issue.timeline.push({
        status: "Resolved",
        note: remarks || "Issue resolved on site. Ready for citizen verification.",
        updatedBy: officerName,
        date: new Date(),
      });
    } else {
      if (remarks) issue.officerRemarks = remarks;
      if (progress) {
        issue.timeline.push({
          status: issue.status,
          note: `Progress updated to ${progress}%: ${remarks || ""}`,
          updatedBy: officerName,
          date: new Date(),
        });
      }
    }

    await issue.save();
    const updated = await Issue.findById(req.params.id).populate("user", "name email points level");
    res.json(updated);
  } catch (error) {
    console.error("Department progress error:", error);
    res.status(500).json({ message: "Error updating department progress", error: error.message });
  }
});

// @desc    Delete issue report (Citizen, Officer, or Admin)
// @route   DELETE /api/issues/:id
// @access  Public / Private
router.delete("/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: "Issue report removed successfully", id: req.params.id });
  } catch (error) {
    console.error("Delete Issue Error:", error);
    res.status(500).json({ message: "Server error deleting issue", error: error.message });
  }
});

module.exports = router;
