import { Link } from "react-router-dom";
import { Search, Package, ArrowRight, Clock, ShieldCheck, MapPin, Trophy, Activity } from "lucide-react";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { stubFoundItems } from "../data/stub-items";
import { useAuth } from "../lib/auth";

export default function HomePage() {
  const { user } = useAuth();
  const recentFound = stubFoundItems.slice(0, 4);

  return (
    <Layout>
      <div className="min-h-screen bg-[#05060A] text-foreground font-sans selection:bg-primary/30">

        {/* Ambient Background Effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] opacity-40"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] opacity-40"></div>
          <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-amber-500/10 rounded-full blur-[100px] opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Header / Greeting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-500">System Online</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
                Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{user?.name || "Operative"}</span>
              </h1>
              <p className="text-slate-400 text-lg">Welcome to the Campus Grid. Status: <span className="text-white font-bold">Secure</span>.</p>
            </div>

            <div className="flex items-center space-x-4 bg-[#13141F]/80 backdrop-blur-md border border-white/5 p-2 rounded-full pr-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Karma Score</div>
                <div className="text-lg font-black text-white leading-none">{user?.reputation_points || 0}</div>
              </div>
            </div>
          </div>

          {/* Main Action Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">

            {/* Lost Interaction */}
            <Link to="/report-lost" className="group relative overflow-hidden rounded-[2rem] bg-[#0E0F19] border border-white/5 hover:border-amber-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(245,158,11,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-10 h-full flex flex-col justify-between relative z-10">
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-amber-500/20">
                    <Search className="w-8 h-8 text-amber-500" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-3 tracking-tight group-hover:text-amber-500 transition-colors">I LOST IT</h2>
                  <p className="text-slate-400 text-lg font-medium max-w-xs leading-relaxed">
                    Initiate a search protocol. The Ghost Grid will help track your missing asset.
                  </p>
                </div>
                <div className="flex items-center text-amber-500 font-bold tracking-widest uppercase text-sm group-hover:translate-x-2 transition-transform">
                  Activate Search <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>

              {/* Decorative Background Icon */}
              <Search className="absolute -right-12 -bottom-12 w-64 h-64 text-amber-500/5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700" />
            </Link>

            {/* Found Interaction */}
            <Link to="/upload-found" className="group relative overflow-hidden rounded-[2rem] bg-[#0E0F19] border border-white/5 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(16,185,129,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="p-10 h-full flex flex-col justify-between relative z-10">
                <div className="mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-emerald-500/20">
                    <Package className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-3 tracking-tight group-hover:text-emerald-500 transition-colors">I FOUND IT</h2>
                  <p className="text-slate-400 text-lg font-medium max-w-xs leading-relaxed">
                    Secure a found item. Earn Karma and build your reputation as a trusted node.
                  </p>
                </div>
                <div className="flex items-center text-emerald-500 font-bold tracking-widest uppercase text-sm group-hover:translate-x-2 transition-transform">
                  Secure Asset <ArrowRight className="ml-2 w-5 h-5" />
                </div>
              </div>

              {/* Decorative Background Icon */}
              <Package className="absolute -right-12 -bottom-12 w-64 h-64 text-emerald-500/5 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700" />
            </Link>

          </div>

          {/* Live Feed Section */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Activity className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white leading-none">Live Grid Activity</h2>
                  <p className="text-slate-500 text-sm mt-1">Real-time object detection and recovery.</p>
                </div>
              </div>
              <Button variant="ghost" asChild className="text-slate-400 hover:text-white hover:bg-white/5">
                <Link to="/found" className="flex items-center">
                  Full Registry <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {recentFound.map((item, i) => (
                <Link key={item.id} to={`/item/${item.id}`} className="group relative block">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  <Card className="bg-[#13141F] border-white/5 overflow-hidden group-hover:border-primary/50 transition-all duration-300 h-full relative z-10 flex flex-col">
                    <div className="relative h-48 bg-[#0B0C15] overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-30">
                          <Package className="w-12 h-12 text-slate-500" />
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] uppercase font-bold tracking-wider hover:bg-black/80">
                          {item.category}
                        </Badge>
                      </div>

                      {/* Status Indicator */}
                      <div className="absolute bottom-3 right-3">
                        <div className="flex items-center space-x-1.5 bg-emerald-500/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                          <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>
                          <span>SECURED</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col">
                      <h3 className="text-white font-bold text-lg mb-1 leading-snug group-hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                      <p className="text-slate-500 text-xs mb-4 line-clamp-2">{item.description}</p>

                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center text-xs text-slate-400">
                          <Clock className="w-3 h-3 mr-1.5" />
                          <span>{i * 15 + 2}m ago</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-400">
                          <MapPin className="w-3 h-3 mr-1.5" />
                          <span className="truncate max-w-[80px]">Campus</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Leaderboard Teaser */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0E0F19]">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent"></div>
            <div className="grid md:grid-cols-[1fr_auto] items-center p-8 md:p-12 gap-8 relative z-10">
              <div>
                <div className="flex items-center space-x-3 text-primary mb-2">
                  <Trophy className="w-6 h-6" />
                  <span className="font-bold tracking-widest uppercase text-sm">Top Agents</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Elite Recoveries This Week</h2>
                <p className="text-slate-400 text-lg max-w-xl">
                  Join the ranks of the top finders. Earn badges, unlock perks, and build your legacy on the grid.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-14 h-14 rounded-full border-4 border-[#0E0F19] bg-gradient-to-br ${i === 1 ? 'from-amber-400 to-orange-600' : i === 2 ? 'from-slate-300 to-slate-500' : 'from-amber-700 to-amber-900'} flex items-center justify-center shadow-lg relative z-${10 - i}`}>
                      <span className="font-bold text-white text-lg">{i}</span>
                    </div>
                  ))}
                </div>
                <div className="h-12 w-px bg-white/10 mx-2"></div>
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 h-12 rounded-xl px-6">
                  View Leaderboard
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
