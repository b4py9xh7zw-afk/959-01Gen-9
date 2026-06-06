import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import PluginDetail from "./pages/PluginDetail";
import Seats from "./pages/Seats";
import Updates from "./pages/Updates";
import Payments from "./pages/Payments";
import AuthorCenter from "./pages/AuthorCenter";
import Profile from "./pages/Profile";
import { useAppStore } from "./store/useAppStore";

function AppRoutes() {
  const { currentRole, currentUser } = useAppStore();
  const isLoggedIn = !!currentUser;

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (currentRole === 'author') {
    return (
      <Routes>
        <Route path="/" element={<AuthorCenter />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<PluginDetail />} />
        <Route path="/updates" element={<Updates />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/marketplace" element={<Marketplace />} />
      <Route path="/marketplace/:id" element={<PluginDetail />} />
      <Route path="/seats" element={<Seats />} />
      <Route path="/updates" element={<Updates />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
