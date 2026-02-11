import { useState } from "react";

import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { useAuth } from "../lib/auth";

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [period, setPeriod] = useState<"month" | "all">("month");

    const topThree = [
        {
            rank: 2,
            name: "Sarah Jenkins",
            school: "School of Medicine",
            points: 1940,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
            color: "from-slate-700 to-slate-500",
            glow: "shadow-slate-500/20",
            badgeColor: "bg-slate-400"
        },
        {
            rank: 1,
            name: "Alex Rivera",
            school: "Faculty of Engineering",
            points: 2450,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera",
            color: "from-purple-600 to-violet-600",
            glow: "shadow-purple-500/50",
            badgeColor: "bg-[#7C3AED]"
        },
        {
            rank: 3,
            name: "Chen Wei",
            school: "Department of Arts",
            points: 1820,
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chen",
            color: "from-amber-700 to-amber-600",
            glow: "shadow-amber-500/20",
            badgeColor: "bg-amber-600"
        }
    ];

    const rankings = [
        { rank: 4, name: "Marcus Thorne", department: "Faculty of Law", points: 1750, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus" },
        { rank: 5, name: "Elena Rodriguez", department: "Business School", points: 1680, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena" },
        { rank: 6, name: "Jordan Smith", department: "Social Sciences", points: 1550, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan" },
        { rank: 7, name: "Priya Kapoor", department: "Arts & Design", points: 1420, image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
    ];

    return (
        <Layout>
            <div className="relative min-h-[calc(100vh-64px)] pb-24 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[#0B0C15]" style={{
                    backgroundImage: 'radial-gradient(#ffffff10 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}></div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter mb-2">THE HONOR ROLL</h1>
                            <p className="text-slate-400 font-medium">Rewarding integrity across the university campus.</p>
                        </div>

                        <div className="bg-[#13141F] p-1 rounded-full border border-white/10 flex">
                            <button
                                onClick={() => setPeriod("month")}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${period === "month" ? "bg-[#7C3AED] text-white shadow-lg" : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                This Month
                            </button>
                            <button
                                onClick={() => setPeriod("all")}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${period === "all" ? "bg-[#7C3AED] text-white shadow-lg" : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                All Time
                            </button>
                        </div>
                    </div>

                    {/* Podium */}
                    <div className="flex justify-center items-end gap-4 md:gap-8 mb-20 min-h-[400px]">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-br from-slate-400 to-slate-600 shadow-xl relative z-10">
                                    <Avatar className="w-full h-full border-4 border-[#0B0C15]">
                                        <AvatarImage src={topThree[0].image} />
                                        <AvatarFallback>SJ</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="absolute -bottom-3 right-0 bg-slate-500 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full border-4 border-[#0B0C15] z-20">
                                    2nd
                                </div>
                            </div>
                            <div className={`bg-[#13141F] rounded-t-2xl p-6 w-32 md:w-48 text-center border-t border-x border-white/10 relative h-48 md:h-56 flex flex-col justify-end pb-8 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.5)] ${topThree[0].glow}`}>
                                {/* Podium Block */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl"></div>
                                <div className="relative z-10">
                                    <h3 className="text-white font-bold leading-tight mb-1">{topThree[0].name}</h3>
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-3">{topThree[0].school}</p>
                                    <div className="text-2xl font-black text-slate-300">{topThree[0].points}<span className="text-xs font-normal text-slate-500 ml-1">PTS</span></div>
                                </div>
                            </div>
                        </div>

                        {/* 1st Place */}
                        <div className="flex flex-col items-center z-20 -mb-4">
                            <div className="relative mb-6 transform scale-125">
                                <div className="absolute -inset-4 bg-[#7C3AED] rounded-full opacity-20 blur-xl animate-pulse"></div>
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full p-1 bg-gradient-to-br from-purple-500 to-violet-500 shadow-2xl relative z-10">
                                    <Avatar className="w-full h-full border-4 border-[#0B0C15]">
                                        <AvatarImage src={topThree[1].image} />
                                        <AvatarFallback>AR</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#7C3AED] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border-2 border-[#0B0C15] shadow-lg">
                                    Champion
                                </div>
                                <div className="absolute -bottom-3 right-0 bg-[#7C3AED] text-white text-sm font-bold w-10 h-10 flex items-center justify-center rounded-full border-4 border-[#0B0C15] z-20">
                                    1st
                                </div>
                            </div>
                            <div className={`bg-[#161221] rounded-t-2xl p-6 w-40 md:w-64 text-center border-t border-x border-[#7C3AED]/30 relative h-64 md:h-80 flex flex-col justify-end pb-12 shadow-[0_-10px_60px_-5px_rgba(124,58,237,0.3)] ${topThree[1].glow}`}>
                                {/* Podium Block */}
                                <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/10 to-transparent rounded-t-2xl"></div>
                                <div className="relative z-10">
                                    <div className="inline-flex items-center space-x-1 mb-2">
                                        <h3 className="text-white font-bold text-lg md:text-xl leading-tight">{topThree[1].name}</h3>
                                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-0 w-4 h-4 p-0 flex items-center justify-center rounded-full text-[10px]">✓</Badge>
                                    </div>
                                    <p className="text-[#A78BFA] text-xs uppercase font-bold tracking-wider mb-6">{topThree[1].school}</p>
                                    <div className="bg-[#7C3AED] text-white px-6 py-2 rounded-xl text-3xl font-black shadow-lg shadow-purple-500/25 inline-block transform hover:scale-105 transition-transform">
                                        {topThree[1].points}<span className="text-xs font-bold opacity-80 ml-1">PTS</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="flex flex-col items-center">
                            <div className="relative mb-4">
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-br from-amber-600 to-amber-800 shadow-xl relative z-10">
                                    <Avatar className="w-full h-full border-4 border-[#0B0C15]">
                                        <AvatarImage src={topThree[2].image} />
                                        <AvatarFallback>CW</AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="absolute -bottom-3 right-0 bg-amber-700 text-white text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full border-4 border-[#0B0C15] z-20">
                                    3rd
                                </div>
                            </div>
                            <div className={`bg-[#13141F] rounded-t-2xl p-6 w-32 md:w-48 text-center border-t border-x border-white/10 relative h-40 md:h-48 flex flex-col justify-end pb-8 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.5)] ${topThree[2].glow}`}>
                                {/* Podium Block */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-t-2xl"></div>
                                <div className="relative z-10">
                                    <h3 className="text-white font-bold leading-tight mb-1">{topThree[2].name}</h3>
                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-3">{topThree[2].school}</p>
                                    <div className="text-2xl font-black text-amber-500">{topThree[2].points}<span className="text-xs font-normal text-slate-500 ml-1">PTS</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* List Table */}
                    <div className="bg-[#13141F] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Header Row */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 bg-[#0F1016] text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-11 md:col-span-5">Student Identity</div>
                            <div className="hidden md:block col-span-4">Department</div>
                            <div className="hidden md:block col-span-2 text-right">Karma Points</div>
                        </div>

                        {/* Rows */}
                        {rankings.map((user) => (
                            <div key={user.rank} className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-white/5 items-center hover:bg-white/5 transition-colors group">
                                <div className="col-span-1 font-mono text-slate-400 font-bold opacity-50 text-xl">#{String(user.rank).padStart(2, '0')}</div>
                                <div className="col-span-11 md:col-span-5 flex items-center space-x-4">
                                    <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-[#7C3AED] transition-colors">
                                        <AvatarImage src={user.image} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-white text-base">{user.name}</span>
                                        <span className="md:hidden text-xs text-slate-500">{user.department}</span>
                                    </div>
                                </div>
                                <div className="hidden md:block col-span-4">
                                    <Badge variant="secondary" className="bg-[#1A1B26] hover:bg-[#1A1B26] text-slate-300 border border-white/10 px-3 py-1">
                                        {user.department}
                                    </Badge>
                                </div>
                                <div className="hidden md:block col-span-2 text-right">
                                    <span className="font-black text-white text-lg">{user.points}</span>
                                </div>
                            </div>
                        ))}

                        <div className="p-4 text-center">
                            <Button variant="ghost" className="text-[#a8aabc] hover:text-white uppercase text-xs font-bold tracking-widest hover:bg-white/5">
                                View More Rankings
                            </Button>
                        </div>
                    </div>

                </div>

                {/* Floating User Stats - Sticky Footer */}
                <div className="fixed bottom-0 left-0 right-0 z-40">
                    {/* Gradient top border effect */}
                    <div className="h-12 bg-gradient-to-t from-[#7C3AED] to-transparent opacity-20 w-full absolute -top-12 pointer-events-none"></div>

                    <div className="bg-gradient-to-r from-[#7C3AED] to-[#C026D3] p-0.5 shadow-[0_-10px_40px_-5px_rgba(124,58,237,0.5)]">
                        <div className="bg-[#0B0C15] flex items-center justify-between px-6 py-4 md:px-12">
                            <div className="flex items-center space-x-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Your Rank</span>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-3xl font-black text-white">#{user?.rank || "-"}</span>
                                        <span className="text-sm font-bold text-slate-500 uppercase">{user?.name || "Student"}</span>
                                    </div>
                                </div>

                                <div className="h-8 w-px bg-white/10 hidden md:block"></div>

                                <div className="flex flex-col hidden md:flex">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Karma</span>
                                    <div className="flex items-baseline space-x-1">
                                        <span className="text-2xl font-black text-white">{user?.reputation_points || 0}</span>
                                        <span className="text-xs font-bold text-slate-500">PTS</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <span className="hidden md:inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 shadow-inner">
                                    Top 15% of Campus
                                </span>
                                <Button className="bg-white text-[#7C3AED] hover:bg-slate-100 font-bold shadow-lg">
                                    SEE STATS
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
