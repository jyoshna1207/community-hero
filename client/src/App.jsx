import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import Issues from "./pages/Issues/Issues";
import IssueDetails from "./pages/IssueDetails/IssueDetails";
import ReportIssue from "./pages/ReportIssue/ReportIssue";
import MyReports from "./pages/MyReports/MyReports";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/NotFound/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/issues" 
            element={
              <ProtectedRoute>
                <Issues />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/issues/:id" 
            element={
              <ProtectedRoute>
                <IssueDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report-issue" 
            element={
              <ProtectedRoute>
                <ReportIssue />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-reports" 
            element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </AuthProvider>
  );
}

export default App;