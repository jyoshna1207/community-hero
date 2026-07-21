import "./App.css";
import { Routes, Route } from "react-router-dom";
import Events from "./pages/Events/Events";
import CreateEvent from "./pages/CreateEvent/CreateEvent";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Profile from "./pages/Profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="/events" element={<Events />} />
<Route path="/create-event" element={<CreateEvent />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;