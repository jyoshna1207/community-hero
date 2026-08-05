import React from 'react';
import { FiPlusCircle, FiList, FiUser } from 'react-icons/fi';

export const dashboardCardsData = {
  totalReports: 12,
  pendingReports: 3,
  resolvedReports: 9,
  communityScore: "85%"
};

export const recentReportsData = [
  { id: "REP-01", title: "Garbage Dump Overflow", category: "Waste Management", status: "Reported", date: "2026-06-25" },
  { id: "REP-02", title: "Street Light Not Working", category: "Electricity", status: "In Progress", date: "2026-06-22" },
  { id: "REP-03", title: "Road Pothole Hazard", category: "Roads", status: "Resolved", date: "2026-06-18" },
  { id: "REP-04", title: "Water Pipe Leakage", category: "Water Supply", status: "Verified", date: "2026-06-15" }
];

export const quickActionsData = [
  { id: 1, icon: React.createElement(FiPlusCircle), label: "Report New Issue", path: "/report-issue" },
  { id: 2, icon: React.createElement(FiList), label: "View All Issues", path: "/issues" },
  { id: 3, icon: React.createElement(FiUser), label: "Update Profile", path: "/profile" }
];

export const communityScoreData = {
  score: 85,
  percentile: 5
};