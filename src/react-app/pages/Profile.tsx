import { useState, useEffect } from "react";
import { Gift, Shield, Star, Coffee, Printer, Shirt, Key, Eye, Trophy } from "lucide-react";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { EditProfileModal } from "../components/EditProfileModal";

export default function ProfilePage() {
    const { user, isPending, redirectToLogin } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [rewards, setRewards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isPending) return;
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);

        Promise.all([
            api.getUserStats(),
            api.getRewards()
        ]).then(([statsData, rewardsData]) => {
            setStats(statsData);
            setRewards(rewardsData);
        }).catch(err => {
            console.error(err);
            setError(err instanceof Error ? err.message : "Failed to load profile data");
        })
            .finally(() => setLoading(false));
    }, [user, isPending]);

    const handleRedeem = (rewardId: number, cost: number) => {
        if (stats?.user.reputation_points < cost) return;

        if (window.confirm("Are you sure you want to redeem this reward?")) {
            api.redeemReward(rewardId).then(() => {
                alert("Reward redeemed successfully!");
                // Refresh stats
                api.getUserStats().then(setStats);
            }).catch(() => alert("Failed to redeem reward."));
        }
    };

    const getIcon = (name: string) => {
        const icons: any = { Coffee, Printer, Shirt, Key, Shield, Star, Eye, Trophy, Gift };
        return icons[name] || Gift;
    };

    if (isPending) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout>
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in Required</h2>
                    <p className="text-slate-600 mb-6">Please sign in to view your profile and reports.</p>
                    <Button onClick={redirectToLogin}>Sign In</Button>
                </div>
            </Layout>
        );
    }

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
            </Layout>
        );
    }

    if (error || !stats) {
        return (
            <Layout>
                <div className="flex flex-col justify-center items-center min-h-[60vh] space-y-4">
                    <div className="text-red-500 font-bold text-xl">Unable to load profile</div>
                    <p className="text-slate-400">Please try refreshing the page.</p>
                    <p className="text-xs text-slate-600 font-mono bg-black/20 p-2 rounded">{error || "User stats not found"}</p>
                    <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Profile Header */}
                <div className="bg-[#13141F] rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="flex items-center gap-6 relative z-10">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 p-1 bg-[#1A1B26]">
                                <img src={stats.user.picture || "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera"} alt={stats.user.name} className="w-full h-full object-cover rounded-xl" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-[#6D28D9] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#0B0C15]">
                                LVL {Math.floor(stats.user.reputation_points / 25)}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-3xl font-bold text-white">{stats.user.name}</h1>
                                <Shield className="w-5 h-5 text-blue-400 fill-blue-400/20" />
                            </div>
                            <p className="text-slate-400 text-sm mb-3">Rank #{stats.user.rank} • {stats.user.email}</p>

                            <div className="flex items-center gap-4">
                                <div className="bg-[#1A1B26] px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                    <span className="text-primary font-bold text-sm">{stats.user.reputation_points} Karma Balance</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <EditProfileModal user={stats.user} onProfileUpdate={() => api.getUserStats().then(setStats)} />
                </div>

                {/* Profile Details Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-[#13141F] p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center space-x-3 text-slate-400 mb-2">
                            <div className="p-2 bg-slate-800/50 rounded-lg">
                                <Shield className="w-5 h-5 text-indigo-400" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider">Academic Info</span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">College ID</p>
                                <p className="text-white font-mono">{stats.user.college_id || "Not verified"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Roll Number</p>
                                <p className="text-white font-mono">{stats.user.college_roll_number || "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Department & Block</p>
                                <p className="text-white">{stats.user.department || "—"} {stats.user.block ? `(Block ${stats.user.block})` : ""}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#13141F] p-6 rounded-2xl border border-white/5 space-y-4">
                        <div className="flex items-center space-x-3 text-slate-400 mb-2">
                            <div className="p-2 bg-slate-800/50 rounded-lg">
                                <Gift className="w-5 h-5 text-emerald-400" /> {/* Reusing Gift icon as placeholder for contact */}
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider">Contact Details</span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Primary Phone</p>
                                <p className="text-white font-mono">{stats.user.phone_number || "—"}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Alt. Contact</p>
                                <p className="text-white font-mono text-sm">{stats.user.alternative_phone || "—"}</p>
                                <p className="text-slate-500 text-xs">{stats.user.alternative_email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#13141F] p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center space-y-4">
                        <p className="text-xs text-slate-500 uppercase font-bold">Digital ID Card</p>
                        {stats.user.college_id_image_url ? (
                            <div className="relative group cursor-pointer">
                                <img src={stats.user.college_id_image_url} alt="ID Card" className="w-32 h-20 object-cover rounded-lg border border-white/10 group-hover:opacity-75 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Eye className="w-6 h-6 text-white drop-shadow-md" />
                                </div>
                            </div>
                        ) : (
                            <div className="w-32 h-20 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                <span className="text-xs text-slate-600">No Upload</span>
                            </div>
                        )}
                        <div className="flex items-center space-x-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">
                            <Shield className="w-3 h-3" />
                            <span>Verified Student</span>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
                    {/* Reputation Graph */}
                    <div className="bg-[#0F1016] rounded-2xl p-6 border border-white/5 shadow-lg flex flex-col justify-between min-h-[300px]">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Reputation Graph</h2>
                                <p className="text-slate-500 text-sm">Trust Score Trend (98% Reliability)</p>
                            </div>
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
                        </div>
                        {/* Placeholder Graph */}
                        <div className="flex-1 flex items-end justify-between gap-2 h-40 px-2 pb-2 mt-4 relative">
                            {stats.recentEvents && stats.recentEvents.length > 0 ? (
                                (() => {
                                    // Calculate max value for scaling
                                    const events = [...stats.recentEvents].reverse(); // Oldest to newest
                                    const maxPoints = Math.max(...events.map((e: any) => Math.abs(e.points_awarded)), 1);

                                    return events.map((event: any) => {
                                        const heightPercentage = Math.max((Math.abs(event.points_awarded) / maxPoints) * 100, 10);
                                        const isPositive = event.points_awarded >= 0;

                                        return (
                                            <div key={event.id} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group cursor-help">
                                                {/* Tooltip */}
                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#1A1B26] border border-white/10 p-2 rounded-lg text-xs shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                                    <div className="font-bold text-white mb-1">{event.description || event.event_type}</div>
                                                    <div className={`font-mono font-bold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                                                        {isPositive ? "+" : ""}{event.points_awarded} Karma
                                                    </div>
                                                    <div className="text-slate-500 text-[10px] mt-1 border-t border-white/5 pt-1">
                                                        {new Date(event.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>

                                                {/* Bar */}
                                                <div
                                                    style={{ height: `${heightPercentage}%` }}
                                                    className={`w-full max-w-[24px] rounded-t-md transition-all duration-500 relative
                                                        ${isPositive
                                                            ? "bg-emerald-500/20 border-t border-x border-emerald-500/30 group-hover:bg-emerald-500"
                                                            : "bg-red-500/20 border-t border-x border-red-500/30 group-hover:bg-red-500"
                                                        }
                                                    `}
                                                >
                                                    <div className={`absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                                                        {event.points_awarded}
                                                    </div>
                                                </div>

                                                {/* X-Axis Label */}
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    {new Date(event.created_at).getDate()}/{new Date(event.created_at).getMonth() + 1}
                                                </span>
                                            </div>
                                        );
                                    });
                                })()
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs text-center border border-dashed border-white/5 rounded-xl bg-white/5">
                                    <Shield className="w-6 h-6 mb-2 opacity-20" />
                                    No reputation history yet.
                                    <span className="opacity-50 mt-1">Found items + Claims = Karma</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="bg-[#0F1016] rounded-2xl p-6 border border-white/5 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-6">Current Rank Badge</h2>

                        {(() => {
                            const karma = stats.user.reputation_points;

                            if (karma === 0) {
                                return (
                                    <div className="flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-48 h-48 mb-4 border-4 border-dashed border-white/10 rounded-full flex items-center justify-center bg-white/5">
                                            <Shield className="w-16 h-16 text-slate-600 opacity-50" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-500 uppercase tracking-wider mb-2">No Badge Yet</h3>
                                        <p className="text-sm text-slate-400 max-w-xs">
                                            Do Karma (find items, help others) to earn your first badge!
                                        </p>

                                        <div className="w-full max-w-xs mt-6">
                                            <div className="flex justify-between text-[10px] text-slate-500 mb-1 uppercase font-bold tracking-wider">
                                                <span>Progress to Trustworthy</span>
                                                <span>0/500</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div className="h-full bg-slate-800 w-0"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            let badgeImage = "/badges/badge1.png";
                            let badgeName = "Trustworthy";

                            if (karma >= 2500) {
                                badgeImage = "/badges/badge6.png";
                                badgeName = "Lost & Found Legend";
                            } else if (karma >= 2000) {
                                badgeImage = "/badges/badge5.png";
                                badgeName = "Top Finder";
                            } else if (karma >= 1500) {
                                badgeImage = "/badges/badge4.png";
                                badgeName = "Campus Guardian";
                            } else if (karma >= 1000) {
                                badgeImage = "/badges/badge3.png";
                                badgeName = "Helper Hero";
                            } else if (karma >= 500) {
                                badgeImage = "/badges/badge2.png";
                                badgeName = "Honesty Champion";
                            }

                            return (
                                <div className="flex flex-col items-center justify-center p-6">
                                    <div className="relative w-48 h-48 mb-4 transition-transform hover:scale-105 duration-300">
                                        <img src={badgeImage} alt={badgeName} className="relative z-10 w-full h-full object-contain drop-shadow-2xl" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-1 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">{badgeName}</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-xs font-mono text-slate-400 bg-black/30 px-3 py-1 rounded-full border border-white/5">
                                            Current Karma: <span className="text-primary">{karma}</span>
                                        </span>
                                    </div>

                                    {/* Progress to next badge */}
                                    {karma < 2500 && (
                                        <div className="w-full max-w-xs mt-6">
                                            <div className="flex justify-between text-[10px] text-slate-500 mb-1 uppercase font-bold tracking-wider">
                                                <span>Progress to next rank</span>
                                                <span>{karma % 500}/500</span>
                                            </div>
                                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000"
                                                    style={{ width: `${(karma % 500) / 500 * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {/* Existing Badges (Hidden or kept as "Collected Badges" if needed, but user asked to display THE badge) */}
                        {/* 
                        <div className="grid grid-cols-2 gap-4 mt-8 opacity-50">
                            {stats.badges.length > 0 ? stats.badges.map((badge: any) => {
                                const Icon = getIcon(badge.icon_name);
                                return (
                                    <div key={badge.id} className="flex flex-col items-center justify-center p-4 rounded-xl border border-primary/20 bg-primary/5">
                                        <Icon className="w-8 h-8 text-primary mb-2" />
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">{badge.name}</span>
                                    </div>
                                )
                            }) : null}
                        </div>
                        */}
                    </div>
                </div>

                {/* Redemption Store */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Redemption Store</h2>
                        <div className="bg-[#1A1B26] px-4 py-2 rounded-lg border border-white/5 flex items-center space-x-2 text-primary font-bold shadow-lg shadow-black/50">
                            <Gift className="w-4 h-4" />
                            <span>{stats.user.reputation_points} Karma Remaining</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {rewards.map((item) => {
                            const Icon = getIcon(item.image_url); // Assuming image_url is icon name for now
                            const canAfford = stats.user.reputation_points >= item.cost;

                            return (
                                <div key={item.id} className="bg-[#13141F] rounded-2xl overflow-hidden border border-white/5 group hover:border-primary/50 transition-all shadow-lg flex flex-col">
                                    <div className="bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center relative p-6 h-32">
                                        <Icon className="w-16 h-16 text-white/20 group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-white font-bold mb-1">{item.title}</h3>
                                        <p className="text-slate-500 text-xs mb-4 flex-1">{item.description}</p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <span className="text-[#A78BFA] font-bold">{item.cost} Karma</span>
                                            <Button
                                                size="sm"
                                                onClick={() => handleRedeem(item.id, item.cost)}
                                                disabled={!canAfford}
                                                className={canAfford ? "bg-primary hover:bg-[#5B21B6] text-white" : "bg-slate-800 text-slate-500 border border-white/5"}
                                            >
                                                {canAfford ? "REDEEM" : "Insufficient"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
