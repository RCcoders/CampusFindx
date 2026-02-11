import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth";
import HomePage from "./pages/Home";
import FoundItemsPage from "./pages/FoundItems";
import LostItemsPage from "./pages/LostItems";
import LeaderboardPage from "./pages/Leaderboard";
import ItemDetailPage from "./pages/ItemDetail";
import ReportLostPage from "./pages/ReportLost";
import UploadFoundPage from "./pages/UploadFound";
import HandoverPage from "./pages/Handover";
import ProfilePage from "./pages/Profile";
import AuthCallbackPage from "./pages/AuthCallback";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/found" element={<FoundItemsPage />} />
          <Route path="/lost" element={<LostItemsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/report-lost" element={<ReportLostPage />} />
          <Route path="/upload-found" element={<UploadFoundPage />} />
          <Route path="/handover" element={<HandoverPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
