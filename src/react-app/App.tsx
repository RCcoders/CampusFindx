import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import HomePage from "./pages/Home";
import LandingPage from "./pages/Landing";
import GuidelinesPage from "./pages/Guidelines";
import FoundItemsPage from "./pages/FoundItems";
import LostItemsPage from "./pages/LostItems";
import LeaderboardPage from "./pages/Leaderboard";
import ItemDetailPage from "./pages/ItemDetail";
import ReportLostPage from "./pages/ReportLost";
import UploadFoundPage from "./pages/UploadFound";
import HandoverPage from "./pages/Handover";
import ProfilePage from "./pages/Profile";
import AuthCallbackPage from "./pages/AuthCallback";
import SplashScreen from "./components/SplashScreen";
import GetStartedPage from "./pages/GetStarted";

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we've already shown splash in this session
  useEffect(() => {
    const hasShownSplash = sessionStorage.getItem("hasShownSplash");
    if (hasShownSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem("hasShownSplash", "true");
    // Navigate to Get Started if at root
    if (location.pathname === "/") {
      navigate("/get-started");
    }
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/get-started" element={<GetStartedPage />} />
      <Route path="/dashboard" element={<HomePage />} />
      <Route path="/found" element={<FoundItemsPage />} />
      <Route path="/lost" element={<LostItemsPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/items/:id" element={<ItemDetailPage />} />
      <Route path="/report-lost" element={<ReportLostPage />} />
      <Route path="/upload-found" element={<UploadFoundPage />} />
      <Route path="/handover" element={<HandoverPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/guidelines" element={<GuidelinesPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
