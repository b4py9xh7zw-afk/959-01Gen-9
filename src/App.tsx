import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, matchPath } from "react-router-dom";
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

const allowedRoutesByRole = {
  admin: ['/', '/marketplace', '/marketplace/:id', '/seats', '/updates', '/payments', '/profile'],
  member: ['/', '/marketplace', '/marketplace/:id', '/seats', '/updates', '/profile'],
  author: ['/', '/marketplace', '/marketplace/:id', '/updates', '/profile'],
} as const;

function isPathAllowed(role: keyof typeof allowedRoutesByRole, pathname: string) {
  return allowedRoutesByRole[role].some(pattern =>
    Boolean(matchPath({ path: pattern, end: true }, pathname))
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppStore();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isPathAllowed(currentUser.role, location.pathname)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { currentRole, currentUser } = useAppStore();
  const activeRole = currentUser?.role ?? currentRole;
  const homePage = activeRole === 'author' ? <AuthorCenter /> : <Dashboard />;

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<RequireAuth>{homePage}</RequireAuth>} />
      <Route path="/marketplace" element={<RequireAuth><Marketplace /></RequireAuth>} />
      <Route path="/marketplace/:id" element={<RequireAuth><PluginDetail /></RequireAuth>} />
      <Route path="/seats" element={<RequireAuth><Seats /></RequireAuth>} />
      <Route path="/updates" element={<RequireAuth><Updates /></RequireAuth>} />
      <Route path="/payments" element={<RequireAuth><Payments /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
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
