import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Search, Package } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";

export default function GetStartedPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#05060A] relative overflow-hidden flex flex-col items-center justify-between py-12 px-6">

            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent"></div>
                <div className="absolute bottom-0 inset-x-0 h-96 bg-gradient-to-t from-[#05060A] via-[#05060A] to-transparent"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center mt-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-24 h-24 mb-8 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl backdrop-blur-sm"
                >
                    <img src="/logo/Logo.png" alt="Logo" className="w-16 h-16 object-contain" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="text-4xl font-black text-white tracking-tight mb-4"
                >
                    Lost it? <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">We Found It.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-slate-400 text-lg leading-relaxed mb-10"
                >
                    The official secure grid for recovering lost assets on campus. Connect, verify, and reclaim what's yours.
                </motion.p>

                {/* Features List */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="grid gap-4 w-full mb-10"
                >
                    <div className="flex items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="p-2 bg-amber-500/10 rounded-lg mr-4">
                            <Search className="w-5 h-5 text-amber-500" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white text-sm">Smart Search</div>
                            <div className="text-slate-500 text-xs">Instantly locate missing items</div>
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="p-2 bg-emerald-500/10 rounded-lg mr-4">
                            <Package className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white text-sm">Secure Return</div>
                            <div className="text-slate-500 text-xs">Verified handover protocols</div>
                        </div>
                    </div>

                    <div className="flex items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                        <div className="p-2 bg-purple-500/10 rounded-lg mr-4">
                            <ShieldCheck className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="text-left">
                            <div className="font-bold text-white text-sm">Earn Karma</div>
                            <div className="text-slate-500 text-xs">Get rewarded for honesty</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Action Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="w-full max-w-md relative z-20 pb-8"
            >
                <Button
                    size="lg"
                    className="w-full h-16 text-lg font-bold bg-white text-black hover:bg-slate-200 rounded-2xl shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all transform hover:scale-[1.02]"
                    onClick={() => navigate("/")}
                >
                    Next
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <p className="text-center text-slate-600 text-xs mt-4">
                    By continuing, you agree to our Terms of Service & Privacy Policy.
                </p>
            </motion.div>
        </div>
    );
}
