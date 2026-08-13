// Mock Data for Community Hero Mobile App Showcase

export const INITIAL_ISSUES = [
  {
    id: "CH-8921",
    title: "Hazardous Pothole on 5th Avenue",
    category: "Pothole",
    categoryIcon: "AlertCircle",
    severity: "Critical",
    status: "In Progress",
    address: "5th Ave & 42nd St, Ward 14",
    distance: "0.3 km away",
    reportedAt: "2 hours ago",
    upvotes: 42,
    hasUpvoted: false,
    description: "Deep pothole causing vehicle tire damage and severe traffic slowdown near the bus stop.",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    completedImageUrl: "https://images.unsplash.com/photo-1584463688353-27c1966559c0?auto=format&fit=crop&w=800&q=80",
    assignedDepartment: "Public Works & Road Maintenance",
    assignedOfficer: "Officer Officer Rodriguez",
    reporter: {
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
    },
    timeline: [
      { step: "Reported", label: "Report Submitted", date: "Today, 09:15 AM", completed: true, by: "Alex Rivera" },
      { step: "Verified", label: "AI & Ward Verification", date: "Today, 10:00 AM", completed: true, by: "Ward Officer Patel" },
      { step: "Assigned", label: "Assigned to PWD Team", date: "Today, 10:30 AM", completed: true, by: "Public Works Dept" },
      { step: "In Progress", label: "Asphalt Repair Crew En Route", date: "Today, 11:15 AM", completed: true, current: true, by: "Crew Lead Gomez" },
      { step: "Completed", label: "Final Inspection & Signoff", date: "Estimated 4:00 PM", completed: false }
    ],
    updates: [
      {
        id: "u1",
        author: "Public Works Dept",
        role: "Official Authority",
        text: "Repair crew dispatched with asphalt mixer unit #4. Work scheduled to complete by 4:00 PM today.",
        timestamp: "30 mins ago",
        isOfficial: true
      }
    ],
    comments: [
      { id: "c1", user: "Michael S.", text: "Damaged my bicycle wheel here yesterday! Glad it's being fixed quickly.", timestamp: "1 hour ago" },
      { id: "c2", user: "Elena Rostova", text: "Upvoted! Thank you Alex for reporting this.", timestamp: "45 mins ago" }
    ],
    coords: { x: 45, y: 35 } // Map position %
  },
  {
    id: "CH-8920",
    title: "Major Water Pipe Burst",
    category: "Water Leakage",
    categoryIcon: "Droplets",
    severity: "High",
    status: "Verified",
    address: "Oak Street & 12th Cross",
    distance: "0.8 km away",
    reportedAt: "4 hours ago",
    upvotes: 28,
    hasUpvoted: true,
    description: "Clean drinking water leaking continuously onto the road creating heavy waterlogging.",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=800&q=80",
    assignedDepartment: "City Water & Sewerage Board",
    assignedOfficer: "Eng. Suresh Kumar",
    reporter: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    timeline: [
      { step: "Reported", label: "Report Submitted", date: "Today, 07:30 AM", completed: true },
      { step: "Verified", label: "Verified by Sensor & Inspection", date: "Today, 08:15 AM", completed: true, current: true },
      { step: "Assigned", label: "Pending Plumbing Unit", date: "Pending", completed: false },
      { step: "In Progress", label: "Pipe Valve Isolation", date: "Pending", completed: false },
      { step: "Completed", label: "Pipe Replacement Complete", date: "Pending", completed: false }
    ],
    updates: [],
    comments: [
      { id: "c3", user: "Rohan M.", text: "Water supply cutoff in block B might be related to this.", timestamp: "2 hours ago" }
    ],
    coords: { x: 65, y: 25 }
  },
  {
    id: "CH-8918",
    title: "Broken Streetlight & Exposed Wires",
    category: "Streetlight",
    categoryIcon: "Zap",
    severity: "Medium",
    status: "Reported",
    address: "Greenwood Avenue, Sector 9",
    distance: "1.2 km away",
    reportedAt: "5 hours ago",
    upvotes: 19,
    hasUpvoted: false,
    description: "Streetlight pole non-functional at night making dark stretch unsafe for pedestrians.",
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    assignedDepartment: "Electrical Grid Department",
    reporter: {
      name: "David Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    timeline: [
      { step: "Reported", label: "Report Submitted", date: "Today, 06:45 AM", completed: true, current: true },
      { step: "Verified", label: "Pending Officer Check", date: "Pending", completed: false },
      { step: "Assigned", label: "Pending Electrical Crew", date: "Pending", completed: false },
      { step: "In Progress", label: "Bulb & Wiring Repair", date: "Pending", completed: false },
      { step: "Completed", label: "Lit Up & Verified", date: "Pending", completed: false }
    ],
    updates: [],
    comments: [],
    coords: { x: 28, y: 60 }
  },
  {
    id: "CH-8915",
    title: "Overflowing Garbage Dumpster",
    category: "Garbage Overflow",
    categoryIcon: "Trash2",
    severity: "High",
    status: "Completed",
    address: "Market Square Lane, Block C",
    distance: "1.5 km away",
    reportedAt: "1 day ago",
    upvotes: 56,
    hasUpvoted: true,
    description: "Waste spilled over sidewalk creating unhygienic conditions near food market.",
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    completedImageUrl: "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80",
    assignedDepartment: "Sanitation & Waste Management",
    reporter: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    timeline: [
      { step: "Reported", label: "Reported by Priya", date: "Yesterday, 08:00 AM", completed: true },
      { step: "Verified", label: "Sanitation Inspector Verified", date: "Yesterday, 09:30 AM", completed: true },
      { step: "Assigned", label: "Assigned to Zone 4 Truck", date: "Yesterday, 10:15 AM", completed: true },
      { step: "In Progress", label: "Compactor Truck Dispatched", date: "Yesterday, 01:00 PM", completed: true },
      { step: "Completed", label: "Cleaned & Disinfected", date: "Yesterday, 03:30 PM", completed: true, current: true }
    ],
    updates: [
      {
        id: "u2",
        author: "Sanitation Dept",
        role: "Official Authority",
        text: "Special compactor unit cleared all waste and disinfected the market square perimeter.",
        timestamp: "Yesterday",
        isOfficial: true
      }
    ],
    comments: [
      { id: "c4", user: "Carlos V.", text: "Super fast turnaround by the sanitation team! Thank you!", timestamp: "Yesterday" }
    ],
    coords: { x: 75, y: 70 }
  }
];

export const LEADERBOARD_USERS = [
  {
    rank: 1,
    name: "Sarah Jenkins",
    badge: "Master Solver 🏆",
    points: 2450,
    solvedCount: 38,
    reportsCount: 42,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    level: "Level 12 Hero",
    upvotes: 680
  },
  {
    rank: 2,
    name: "David Chen",
    badge: "Civic Guardian 🥈",
    points: 2120,
    solvedCount: 31,
    reportsCount: 35,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    level: "Level 10 Hero",
    upvotes: 540
  },
  {
    rank: 3,
    name: "Priya Sharma",
    badge: "Community Legend 🥉",
    points: 1890,
    solvedCount: 27,
    reportsCount: 29,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    level: "Level 9 Hero",
    upvotes: 490
  },
  {
    rank: 4,
    name: "Alex Rivera",
    badge: "Pothole Patrol",
    points: 1640,
    solvedCount: 22,
    reportsCount: 24,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    level: "Level 8 Hero",
    upvotes: 342
  },
  {
    rank: 5,
    name: "Marcus Vance",
    badge: "Eco Warrior",
    points: 1480,
    solvedCount: 19,
    reportsCount: 21,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    level: "Level 7 Hero",
    upvotes: 295
  },
  {
    rank: 6,
    name: "Elena Rostova",
    badge: "Lighting Guard",
    points: 1290,
    solvedCount: 16,
    reportsCount: 18,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    level: "Level 6 Hero",
    upvotes: 210
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Issue In Progress 🛠️",
    message: "Public Works Dept has dispatched an asphalt crew to fix Pothole #CH-8921 on 5th Avenue.",
    time: "10m ago",
    unread: true,
    type: "status",
    issueId: "CH-8921"
  },
  {
    id: "n2",
    title: "+50 Hero Points Earned! 🌟",
    message: "Your report for Water Pipe Burst #CH-8920 was verified by the Ward Officer.",
    time: "2h ago",
    unread: true,
    type: "points"
  },
  {
    id: "n3",
    title: "Issue Solved 🎉",
    message: "Overflowing Garbage #CH-8915 has been successfully cleared and disinfected.",
    time: "Yesterday",
    unread: false,
    type: "completed",
    issueId: "CH-8915"
  },
  {
    id: "n4",
    title: "Rank Up! 🏆",
    message: "Congratulations! You moved up to Rank #4 in Ward 14 Leaderboard.",
    time: "2 days ago",
    unread: false,
    type: "achievement"
  }
];

export const MOCK_USER_PROFILE = {
  name: "Alex Rivera",
  email: "alex.rivera@civic.gov",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
  levelTitle: "Level 8 Citizen Hero",
  ward: "Ward #14 - Central Metro",
  points: 1850,
  rank: 4,
  stats: {
    submitted: 24,
    solved: 19,
    upvotes: 342,
    impactScore: "94%"
  },
  badges: [
    { id: "b1", title: "Pothole Patrol", icon: "AlertCircle", desc: "Reported 10+ road hazards", color: "#2563EB" },
    { id: "b2", title: "First Responder", icon: "Zap", desc: "First to report 5 critical issues", color: "#F59E0B" },
    { id: "b3", title: "Community Legend", icon: "Award", desc: "Over 300 community upvotes", color: "#22C55E" },
    { id: "b4", title: "Eco Champion", icon: "Trash2", desc: "Resolved 8 waste overflow sites", color: "#10B981" }
  ]
};
