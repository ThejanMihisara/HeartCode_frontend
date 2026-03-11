import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/landing";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import MenuPage from "./pages/menu";
import GamePage from "./pages/game";
import LeaderboardPage from "./pages/leaderboard";
import ProgressLogPage from "./pages/progresslog";
import ProfilePage from "./pages/profile";
import { useAuth } from "./lib/auth";

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center text-secondary/80">
      <div className="rounded-2xl border border-secondary/20 bg-black/20 px-5 py-4 text-sm">
        Checking your session...
      </div>
    </div>
  );
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (user) return <Navigate to="/menu" replace />;

  return children;
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-secondary text-primary">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
        <Route path="/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        <Route path="/progress-log" element={<ProtectedRoute><ProgressLogPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}
