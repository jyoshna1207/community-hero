import React from 'react';
import { FiCamera, FiCheckSquare, FiActivity } from 'react-icons/fi';

export const homeStats = {
  resolvedCount: "1,420+",
  responseRate: "98%",
  totalIssues: "1,850",
  resolved: "1,420",
  pending: "430",
  citizens: "5,200+"
};

export const featureCards = [
  {
    id: 1,
    icon: React.createElement(FiCamera),
    title: "1. Snap & Report",
    description: "Take a photo of the civic issue (pothole, garbage dump, broken street light) and submit it instantly with precise location tagging."
  },
  {
    id: 2,
    icon: React.createElement(FiActivity),
    title: "2. Real-Time Tracking",
    description: "Watch your report move through verification, officer assignment, field execution, and final citizen confirmation status milestones."
  },
  {
    id: 3,
    icon: React.createElement(FiCheckSquare),
    title: "3. Community Impact",
    description: "Earn community score points as your reported issues get resolved, contributing directly to a cleaner and safer ward."
  }
];

export const latestIssues = [
  { id: "ISS-101", title: "Garbage Dump Overflow", location: "Main Street, Ward 4", status: "Reported" },
  { id: "ISS-102", title: "Street Light Not Working", location: "Park Avenue, Ward 2", status: "In Progress" },
  { id: "ISS-103", title: "Severe Road Pothole", location: "Market Square, Ward 6", status: "Resolved" }
];

export const successStories = [
  {
    id: 1,
    title: "Park Avenue Lighting Restored",
    description: "Thanks to 12 citizen reports, the municipal electrical department replaced all broken LED fixtures within 48 hours.",
    ward: "Ward 2",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    title: "Main Street Cleanup Drive",
    description: "An illegal dumping ground was completely cleared and converted into a green pocket park by local authorities.",
    ward: "Ward 4",
    image: "https://images.unsplash.com/photo-1584467735811-6286ca63d33a?auto=format&fit=crop&w=600&q=80"
  }
];