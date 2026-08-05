export const departmentSummaryStats = {
  assignedIssues: 18,
  acceptedIssues: 14,
  workInProgress: 11,
  completedToday: 4,
  totalCompleted: 118,
  delayedWorks: 2
};

export const departmentNotifications = [
  { id: 1, title: "Urgent Dispatch", message: "High-priority water pipe burst assigned in Ward 3.", time: "10m ago", unread: true },
  { id: 2, title: "Deadline Approaching", message: "Streetlight repair task #ISS-385 due tomorrow.", time: "1h ago", unread: true },
  { id: 3, title: "Citizen Verification", message: "Completed work #ISS-350 verified successfully by citizen.", time: "4h ago", unread: false },
];

export const departmentDeadlines = [
  { id: "ISS-388", title: "Main Pipeline Leakage", dueDate: "2026-03-30", timeLeft: "2 days", status: "In Progress" },
  { id: "ISS-392", title: "Substation Junction Cover", dueDate: "2026-03-29", timeLeft: "1 day", status: "Work Started" },
];

export const departmentAssignedWorks = [
  {
    id: "ISS-388",
    title: "Water Pipeline Leakage on 2nd Cross",
    description: "Major leakage causing water wastage and low pressure across residential blocks.",
    category: "Water Supply",
    priority: "High",
    ward: "Ward 4",
    department: "Water Department",
    assignedDate: "2026-03-24",
    expectedCompletion: "2026-03-30",
    currentStatus: "In Progress",
    progress: 65,
    currentStage: "Repair Work Underway",
    image: "https://images.unsplash.com/photo-1584467735811-c9185a02e6c5?w=400"
  },
  {
    id: "ISS-385",
    title: "Broken Streetlight Fixture & Exposed Box",
    description: "Multiple poles with non-functional sodium lamps and unsecured electrical junction box.",
    category: "Electricity",
    priority: "Medium",
    ward: "Ward 2",
    department: "Electrical Department",
    assignedDate: "2026-03-22",
    expectedCompletion: "2026-03-29",
    currentStatus: "Accepted",
    progress: 25,
    currentStage: "Materials Dispatched",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400"
  },
  {
    id: "ISS-391",
    title: "Clogged Stormwater Drain Grate",
    description: "Silt and plastic waste blocking drainage leading to localized street flooding.",
    category: "Drainage",
    priority: "Urgent",
    ward: "Ward 1",
    department: "Sanitation & Drainage",
    assignedDate: "2026-03-26",
    expectedCompletion: "2026-03-28",
    currentStatus: "Assigned",
    progress: 10,
    currentStage: "Pending Acceptance",
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400"
  }
];

export const departmentCompletedWorks = [
  {
    id: "ISS-350",
    title: "Main Street Storm Drain Desilting",
    department: "Sanitation & Drainage",
    ward: "Ward 4",
    completionDate: "2026-03-15",
    finalStatus: "Completed",
    workDuration: "4 Days",
    completionSummary: "Successfully cleared 150 meters of blocked concrete drainage channels and replaced broken gratings.",
    beforeImage: "https://images.unsplash.com/photo-1584467735811-c9185a02e6c5?w=400",
    afterImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400"
  },
  {
    id: "ISS-342",
    title: "Transformer Sparking Repair",
    department: "Electrical Department",
    ward: "Ward 2",
    completionDate: "2026-03-12",
    finalStatus: "Closed",
    workDuration: "2 Days",
    completionSummary: "Inspected high-voltage transformer unit, replaced blown fuse cutout switches and secured housing enclosure.",
    beforeImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
    afterImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc19fe7?w=400"
  }
];