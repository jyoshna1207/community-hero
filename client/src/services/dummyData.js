export const dummyUsers = [
  { id: 1, name: "Aarav Sharma", email: "aarav.citizen@gmail.com", role: "Citizen", status: "Active", ward: "Ward 4", department: "N/A", createdDate: "2026-01-15", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" },
  { id: 2, name: "Priya Patel", email: "priya.ward@gov.in", role: "Ward Officer", status: "Active", ward: "Ward 12", department: "Sanitation", createdDate: "2025-11-20", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
  { id: 3, name: "Rohan Verma", email: "rohan.dept@gov.in", role: "Department Officer", status: "Active", ward: "All Wards", department: "Roads", createdDate: "2025-08-10", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  { id: 4, name: "Admin Super", email: "admin@communityhero.org", role: "Administrator", status: "Active", ward: "All Wards", department: "Administration", createdDate: "2025-01-01", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
  { id: 5, name: "Sneha Reddy", email: "sneha.citizen@yahoo.com", role: "Citizen", status: "Suspended", ward: "Ward 8", department: "N/A", createdDate: "2026-02-05", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
];

export const dummyIssues = [
  { id: "ISS-1001", title: "Large Pothole near Main Street", category: "Roads", priority: "High", location: "Sector 4, Main Road", ward: "Ward 4", department: "Roads", status: "Assigned", reporter: "Aarav Sharma", assignedOfficer: "Rohan Verma", reportedDate: "2026-03-20" },
  { id: "ISS-1002", title: "Overflowing Garbage Bin", category: "Sanitation", priority: "Medium", location: "Market Complex Gate 2", ward: "Ward 12", department: "Sanitation", status: "In Progress", reporter: "Sunita Rao", assignedOfficer: "Priya Patel", reportedDate: "2026-03-21" },
  { id: "ISS-1003", title: "Broken Streetlight Pole", category: "Electricity", priority: "High", location: "Park Avenue Cross", ward: "Ward 2", department: "Electricity", status: "Pending", reporter: "Vikram Singh", assignedOfficer: "Unassigned", reportedDate: "2026-03-22" },
  { id: "ISS-1004", title: "Water Pipeline Leakage", category: "Water Supply", priority: "Urgent", location: "Lane 5, Subhash Nagar", ward: "Ward 7", department: "Water Supply", status: "Verified", reporter: "Ananya Roy", assignedOfficer: "Manoj Kumar", reportedDate: "2026-03-22" },
  { id: "ISS-1005", title: "Clogged Drainage Grate", category: "Drainage", priority: "Medium", location: "Station Road", ward: "Ward 9", department: "Drainage", status: "Resolved", reporter: "Karan Johar", assignedOfficer: "Suresh Menon", reportedDate: "2026-03-18" },
];

export const dummyDepartments = [
  { id: 1, name: "Roads", officerCount: 8, openIssues: 14, completedIssues: 85, completionPercentage: 86 },
  { id: 2, name: "Sanitation", officerCount: 15, openIssues: 22, completedIssues: 140, completionPercentage: 91 },
  { id: 3, name: "Water Supply", officerCount: 10, openIssues: 9, completedIssues: 110, completionPercentage: 92 },
  { id: 4, name: "Drainage", officerCount: 7, openIssues: 12, completedIssues: 64, completionPercentage: 84 },
  { id: 5, name: "Electricity", officerCount: 6, openIssues: 5, completedIssues: 95, completionPercentage: 95 },
  { id: 6, name: "Parks", officerCount: 4, openIssues: 3, completedIssues: 42, completionPercentage: 93 },
  { id: 7, name: "Public Health", officerCount: 9, openIssues: 7, completedIssues: 78, completionPercentage: 91 },
];

export const dummyWards = [
  { wardNumber: "Ward 1", wardOfficer: "Rajesh Kumar", population: 45000, openIssues: 4, resolvedIssues: 45, performanceScore: 92 },
  { wardNumber: "Ward 2", wardOfficer: "Meena Iyer", population: 52000, openIssues: 7, resolvedIssues: 60, performanceScore: 89 },
  { wardNumber: "Ward 3", wardOfficer: "Amitabh Roy", population: 38000, openIssues: 2, resolvedIssues: 50, performanceScore: 96 },
  { wardNumber: "Ward 4", wardOfficer: "Deepika Sen", population: 61000, openIssues: 9, resolvedIssues: 72, performanceScore: 88 },
  { wardNumber: "Ward 5", wardOfficer: "Sanjay Gupta", population: 49000, openIssues: 5, resolvedIssues: 58, performanceScore: 91 },
];

export const dummyReports = {
  today: { newIssues: 14, resolved: 9, activeOfficers: 42 },
  weekly: { newIssues: 95, resolved: 82, activeOfficers: 50 },
  monthly: { newIssues: 410, resolved: 385, activeOfficers: 55 },
  yearly: { newIssues: 4800, resolved: 4620, activeOfficers: 58 }
};

export const dummyNotifications = [
  { id: 1, title: "High Priority Issue", message: "New water pipeline burst reported in Ward 7.", time: "10 mins ago", unread: true },
  { id: 2, title: "Officer Assigned", message: "Priya Patel assigned to Sanitation issue #1002.", time: "1 hour ago", unread: true },
  { id: 3, title: "System Backup", message: "Automated weekly cloud backup completed successfully.", time: "5 hours ago", unread: false },
];

export const dummyActivities = [
  { id: 1, action: "Issue #1004 Verified", user: "Admin Super", time: "15 mins ago" },
  { id: 2, action: "New user registered: Aarav Sharma", user: "System", time: "1 hour ago" },
  { id: 3, action: "Department target updated for Roads", user: "Rohan Verma", time: "3 hours ago" },
  { id: 4, action: "Ward 3 performance score recalibrated", user: "Admin Super", time: "5 hours ago" },
];