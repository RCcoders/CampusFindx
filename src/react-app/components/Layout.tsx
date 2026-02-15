import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Search, Package, AlertCircle, Trophy, Gift, HelpCircle } from "lucide-react";
import LoginButton from "./LoginButton";
import { ChatAssistant } from "./ChatAssistant";
import { NotificationDropdown } from "./NotificationDropdown";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0C15]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Karma
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {user && [
                { name: "Dashboard", path: "/dashboard", icon: Search },
                { name: "I Found", path: "/lost", icon: Package },
                { name: "I Lost", path: "/found", icon: AlertCircle },
                { name: "Leaderboard", path: "/leaderboard", icon: Trophy },
                { name: "Reports", path: "/profile", icon: Gift },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-bold tracking-wide ${isActive(item.path)
                    ? "text-white bg-white/5"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  {/* Icon hidden for text-primary focus as per screenshot, but keeping structure */}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 mr-4">
                <NotificationDropdown />
                <Link to="/guidelines">
                  <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </Link>
              </div>

              <LoginButton />

              {/* Mobile upload button explicitly shown if needed, otherwise handled by LoginButton or separate calls */}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16 min-h-screen">{children}</main>
      <ChatAssistant />
    </div>
  );
}
