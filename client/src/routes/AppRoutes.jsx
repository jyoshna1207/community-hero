// File path: src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext'; // Note the '../' to go up from routes/ to src/

import ProtectedRoute from './ProtectedRoute'; // Same folder
import RoleBasedRoute from './RoleBasedRoute'; // Same folder

// Layouts (Go up one directory into src/, then into layouts/)
import CitizenLayout from '../layouts/CitizenLayout';
import AdminLayout from '../layouts/AdminLayout';
import OfficerLayout from '../layouts/OfficerLayout';
import DepartmentLayout from '../layouts/DepartmentLayout';

// Auth Pages (Go up one directory into src/, then into pages/auth/)
import LoginPage from '../pages/auth/Loginpage'; 
import RegisterPage from '../pages/auth/Registerpage';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

// Public & Citizen Pages
import Home from '../pages/Citizen/Home/Home';
import Contact from '../pages/Citizen/Contact/Contact';
import CitizenDashboard from '../pages/Citizen/Dashboard/Dashboard';
import ReportIssue from '../pages/Citizen/ReportIssue/ReportIssue';
import IssuesList from '../pages/Citizen/Issues/Issues';
import IssueDetail from '../pages/Citizen/IssueDetails/IssueDetails';
import TrackReport from '../pages/Citizen/TrackReport/TrackReport';
import MyReports from '../pages/Citizen/MyReports/MyReports';
import Profile from '../pages/Citizen/Profile/Profile';

// Admin Pages
import AdminDashboard from '../pages/Admin/AdminDashboard/AdminDashboard';
import ManageUsers from '../pages/Admin/ManageUsers/ManageUsers';
import ManageIssues from '../pages/Admin/ManageIssues/ManageIssues';
import ManageDepartments from '../pages/Admin/ManageDepartments/ManageDepartments';
import ManageWards from '../pages/Admin/ManageWards/ManageWards';
import AdminReports from '../pages/Admin/Reports/Reports';
import AdminSettings from '../pages/Admin/Settings/Settings';

// Officer Pages
import OfficerDashboard from '../pages/Officer/Dashboard/OfficerDashboard';
import WardDashboard from '../pages/Officer/WardDashboard/WardDashboard';
import VerifyIssues from '../pages/Officer/VerifyIssues/VerifyIssues';
import AssignedIssues from '../pages/Officer/AssignedIssues/AssignedIssues';
import OfficerHistory from '../pages/Officer/IssueHistory/IssueHistory';

// Department Pages
import DepartmentDashboard from '../pages/Department/DepartmentDashboard/DepartmentDashboard';
import AssignedWork from '../pages/Department/AssignedWork/AssignedWork';
import UpdateProgress from '../pages/Department/UpdateProgress/UpdateProgress';
import CompletedWork from '../pages/Department/CompletedWork/CompletedWork';

import MobileAppContainer from '../mobile/MobileAppContainer';

const AppRoutes = () => {
  return (
      
        <Routes>
          {/* Public Web App Routes */}
          <Route element={<CitizenLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="/mobile" element={<MobileAppContainer />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Citizen Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<CitizenLayout />}>
              <Route path="/dashboard" element={<CitizenDashboard />} />
              <Route path="/report-issue" element={<ReportIssue />} />
              <Route path="/issues" element={<IssuesList />} />
              <Route path="/issues/:id" element={<TrackReport />} />
              <Route path="/track-report/:id" element={<TrackReport />} />
              <Route path="/my-reports" element={<MyReports />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRole="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/manage-users" element={<ManageUsers />} />
              <Route path="/admin/manage-issues" element={<ManageIssues />} />
              <Route path="/admin/manage-departments" element={<ManageDepartments />} />
              <Route path="/admin/manage-wards" element={<ManageWards />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* Protected Ward Officer Routes */}
          <Route element={<ProtectedRoute allowedRole="officer" />}>
            <Route path="/ward-dashboard" element={<WardDashboard />} />
            <Route element={<OfficerLayout />}>
              <Route path="/officer/dashboard" element={<WardDashboard />} />
              <Route path="/officer/verify-issues" element={<VerifyIssues />} />
              <Route path="/officer/assigned-issues" element={<AssignedIssues />} />
              <Route path="/officer/history" element={<OfficerHistory />} />
            </Route>
          </Route>

          {/* Protected Department Routes */}
          <Route element={<ProtectedRoute allowedRole="department" />}>
            <Route element={<DepartmentLayout />}>
              <Route path="/department" element={<DepartmentDashboard />} />
              <Route path="/department/dashboard" element={<DepartmentDashboard />} />
              <Route path="/department/assigned-work" element={<AssignedWork />} />
              <Route path="/department/update-progress" element={<UpdateProgress />} />
              <Route path="/department/completed-work" element={<CompletedWork />} />
            </Route>
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
  );
};

export default AppRoutes;