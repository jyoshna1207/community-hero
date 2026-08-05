export const officerSummaryStats = {
  pendingVerification: 14,
  verifiedToday: 8,
  assignedIssues: 26,
  inProgress: 19,
  resolvedIssues: 142,
  rejectedReports: 5
};

export const officerNotifications = [
  { id: 1, title: "Urgent Pothole Report", message: "New high-priority report logged in Ward 4.", time: "5m ago", unread: true },
  { id: 2, title: "Department Acknowledged", message: "Sanitation department accepted issue #ISS-402.", time: "1h ago", unread: true },
  { id: 3, title: "Resolution Verified", message: "Citizen confirmed fix for street light issue #ISS-389.", time: "3h ago", unread: false },
];

export const officerActivities = [
  { id: 1, action: "Verified issue #ISS-401", time: "10 mins ago", officer: "Priya Patel" },
  { id: 2, action: "Assigned #ISS-398 to Sanitation Dept", time: "45 mins ago", officer: "Priya Patel" },
  { id: 3, action: "Rejected invalid report #ISS-392", time: "2 hours ago", officer: "Priya Patel" },
];

export const verificationQueueData = [
  {
    id: "ISS-401",
    title: "Large Pothole near Central Market Gate",
    description: "Deep pothole causing traffic slowdown and minor two-wheeler skids during evening hours.",
    category: "Roads",
    priority: "High",
    location: "Main Street, Sector 4, Ward 4",
    ward: "Ward 4",
    reporterName: "Aarav Sharma",
    reportedDate: "2026-03-27",
    status: "Pending Verification",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc19fe7?w=400"
  },
  {
    id: "ISS-402",
    title: "Overflowing Garbage Skip Bin",
    description: "Municipal skip bin hasn't been cleared for 3 days, spreading foul odor and stray animals.",
    category: "Sanitation",
    priority: "Medium",
    location: "Block C Market Crossroad, Ward 4",
    ward: "Ward 4",
    reporterName: "Sunita Rao",
    reportedDate: "2026-03-27",
    status: "Pending Verification",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400"
  },
  {
    id: "ISS-403",
    title: "Exposed Electrical Wiring Box",
    description: "Junction box door is missing, leaving live wires exposed near children's playground.",
    category: "Electricity",
    priority: "Urgent",
    location: "Green Park Avenue, Ward 4",
    ward: "Ward 4",
    reporterName: "Vikram Singh",
    reportedDate: "2026-03-26",
    status: "Pending Verification",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400"
  }
];

export const assignedIssuesData = [
  {
    id: "ISS-388",
    title: "Water Pipeline Leakage on 2nd Cross",
    department: "Water Supply",
    assignedDate: "2026-03-24",
    priority: "High",
    status: "In Progress",
    estimatedCompletion: "2026-03-30",
    progress: 65,
    currentStage: "Repair Work Underway"
  },
  {
    id: "ISS-385",
    title: "Broken Streetlight Fixture",
    department: "Electricity",
    assignedDate: "2026-03-22",
    priority: "Medium",
    status: "Assigned",
    estimatedCompletion: "2026-03-29",
    progress: 25,
    currentStage: "Officer Dispatched"
  },
  {
    id: "ISS-380",
    title: "Blocked Drainage Grate causing waterlogging",
    department: "Drainage",
    assignedDate: "2026-03-20",
    priority: "Urgent",
    status: "In Progress",
    estimatedCompletion: "2026-03-28",
    progress: 85,
    currentStage: "Final Clearing & Testing"
  }
];

export const issueHistoryData = [
  {
    id: "ISS-350",
    title: "Main Street Storm Drain Cleanup",
    category: "Drainage",
    ward: "Ward 4",
    department: "Drainage",
    verificationDate: "2026-03-10",
    completionDate: "2026-03-15",
    finalStatus: "Closed",
    beforeImage: "https://images.unsplash.com/photo-1584467735811-c9185a02e6c5?w=400",
    afterImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    timeline: [
      { stage: "Reported", date: "2026-03-09" },
      { stage: "Verified", date: "2026-03-10" },
      { stage: "Assigned", date: "2026-03-10" },
      { stage: "Work Started", date: "2026-03-11" },
      { stage: "Completed", date: "2026-03-15" },
      { stage: "Citizen Confirmed", date: "2026-03-16" },
      { stage: "Closed", date: "2026-03-16" }
    ]
  },
  {
    id: "ISS-342",
    title: "Park Bench Repair & Waste Bin Replacement",
    category: "Parks",
    ward: "Ward 4",
    department: "Parks & Horticulture",
    verificationDate: "2026-03-05",
    completionDate: "2026-03-08",
    finalStatus: "Resolved",
    beforeImage: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400",
    afterImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400",
    timeline: [
      { stage: "Reported", date: "2026-03-04" },
      { stage: "Verified", date: "2026-03-05" },
      { stage: "Assigned", date: "2026-03-05" },
      { stage: "Work Started", date: "2026-03-06" },
      { stage: "Completed", date: "2026-03-08" }
    ]
  }
];

export const wardMonthlyPerformance = [
  { month: "Nov", resolved: 110, reported: 125 },
  { month: "Dec", resolved: 130, reported: 140 },
  { month: "Jan", resolved: 125, reported: 130 },
  { month: "Feb", resolved: 150, reported: 160 },
  { month: "Mar", resolved: 142, reported: 155 }
];