import { useEffect } from "react";
import { motion } from "framer-motion";

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();
        }, 2500); // 2.5 seconds duration

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className="fixed inset-0 z-50 bg-[#05060A] flex flex-col items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[150px] opacity-30 animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[150px] opacity-30 animate-pulse" style={{ animationDelay: "1s" }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 flex flex-col items-center"
            >
                <div className="w-32 h-32 md:w-40 md:h-40 relative mb-6">
                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                    <img
                        src="/logo/Logo.png"
                        alt="Logo"
                        className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                    />
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-3xl md:text-4xl font-black text-white tracking-tighter"
                >
                    CAMPUS<span className="text-primary">FINDER</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="text-slate-500 text-sm md:text-base mt-2 font-medium tracking-wide uppercase"
                >
                    Secure Lost & Found Grid
                </motion.p>
            </motion.div>

            {/* Loading Bar */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "200px" }}
                transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
                className="absolute bottom-20 h-1 bg-gradient-to-r from-primary to-purple-600 rounded-full"
            />
        </div>
    );
}
