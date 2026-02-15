import { Shield, Package, Trophy, AlertCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../lib/auth";
import { Button } from "../components/ui/button";
import Layout from "../components/Layout";

export default function LandingPage() {
    const { redirectToLogin } = useAuth();

    // If user is already logged in, redirect to dashboard - REMOVED for now to allow viewing landing page
    /*
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    */

    return (
        <Layout>
            <div className="min-h-screen bg-[#0B0C15] text-white overflow-hidden relative">
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                </div>

                {/* Hero Section */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center text-center">
                    <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md animate-fade-in-up">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-sm font-medium text-slate-300">Campus Lost & Found System</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up delay-100">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                            Find What's Lost,
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
                            Claim What's Yours.
                        </span>
                    </h1>

                    <p className="max-w-2xl text-lg text-slate-400 mb-10 animate-fade-in-up delay-200 leading-relaxed">
                        Join the trusted community for recovering lost items on campus. Earn Karma points for helping others and climb the leaderboard as a top finder.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-full text-base font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105"
                            onClick={redirectToLogin}
                        >
                            Get Started
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Feature Cards */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Package,
                                title: "Report Lost Items",
                                desc: "Quickly post details about items you've lost. Our community will help you find them.",
                                color: "text-blue-400",
                                bg: "bg-blue-400/10"
                            },
                            {
                                icon: Shield,
                                title: "Secure & Verified",
                                desc: "Items are securely handed over with verification codes to ensure they reach the rightful owner.",
                                color: "text-emerald-400",
                                bg: "bg-emerald-400/10"
                            },
                            {
                                icon: Trophy,
                                title: "Earn Karma Rewards",
                                desc: "Get recognized for your honesty. Earn badges and rewards for returning found items.",
                                color: "text-purple-400",
                                bg: "bg-purple-400/10"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-[#13141F] border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 duration-300 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-32 h-32 ${feature.bg} rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`}></div>
                                <div className={`w-14 h-14 ${feature.bg} rounded-2xl flex items-center justify-center mb-6`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Section */}
                <div className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mb-8">Trusted by Students & Faculty</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {/* Placeholders for partner logos or stats */}
                            <div className="flex items-center space-x-2">
                                <Shield className="w-8 h-8" />
                                <span className="text-xl font-bold">CampusSecure</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Package className="w-8 h-8" />
                                <span className="text-xl font-bold">SafeKeep</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-8 h-8" />
                                <span className="text-xl font-bold">LostFound</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
