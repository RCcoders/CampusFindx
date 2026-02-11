import { Link } from "react-router-dom";
import { User, Package, Shield, Phone } from "lucide-react";
import { Button } from "../components/ui/button";

export default function HandoverPage() {
    return (
        <div className="min-h-screen bg-[#05060A] text-white font-sans selection:bg-primary/30">
            {/* Top Header - different from Layout to match the "Secure Mode" feel */}
            <header className="border-b border-white/5 bg-[#0B0C15]/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">KARMA</span>
                    </Link>

                    <div className="flex items-center space-x-8">
                        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">
                            <Link to="/" className="hover:text-white transition-colors">Dashboard</Link>
                            <Link to="/found" className="hover:text-white transition-colors">Inventory</Link>
                            <Link to="/reports" className="hover:text-white transition-colors">Reports</Link>
                        </nav>

                        <Button className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-semibold flex items-center shadow-[0_0_15px_rgba(109,40,217,0.4)]">
                            <Shield className="w-4 h-4 mr-2" />
                            Security Desk
                        </Button>

                        <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden border border-white/10">
                            {/* User Avatar Placeholder */}
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Security" alt="Officer" className="w-full h-full" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">HANDOVER IDENTITY VERIFICATION</h1>
                    <div className="flex items-center justify-center space-x-4 text-sm font-mono text-slate-400">
                        <span className="bg-[#6D28D9]/20 text-[#A78BFA] px-3 py-1 rounded border border-[#6D28D9]/30">SECURE SESSION</span>
                        <span>CASE ID: KR-98234-LM</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                    {/* Authorized Claimant Card */}
                    <div className="bg-[#13141F] rounded-2xl p-2 border border-white/5 shadow-2xl relative group">
                        <div className="bg-[#1A1B26] rounded-xl overflow-hidden relative aspect-square mb-6">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=AlexRivera" alt="Claimant" className="w-full h-full object-cover" />
                            <div className="absolute top-4 right-4 text-white/50 group-hover:text-white transition-colors">
                                <User className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="px-4 pb-6">
                            <p className="text-[#A78BFA] text-xs font-bold uppercase tracking-widest mb-1">Authorized Claimant</p>
                            <h2 className="text-3xl font-bold text-white mb-1">Alex Rivera</h2>
                            <p className="text-slate-400 font-mono text-sm mb-4">ID: 2024-UN-8892</p>
                            <div className="flex space-x-2">
                                <span className="bg-white/5 text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-white/5">FACULTY OF ARTS</span>
                                <span className="bg-white/5 text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-white/5">LEVEL 3</span>
                            </div>
                        </div>
                    </div>

                    {/* Central Verification Scanner */}
                    <div className="relative flex flex-col items-center justify-center py-8">
                        {/* Scanner Frame */}
                        <div className="relative w-full aspect-square max-w-sm bg-[#1A1B26] rounded-3xl border-2 border-primary/30 flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,0.15)] overflow-hidden">
                            {/* Scanner Lines */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary rounded-tl-xl m-4"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-xl m-4"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-xl m-4"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary rounded-br-xl m-4"></div>

                            {/* Content inside scanner */}
                            <div className="bg-white p-4 rounded-lg shadow-lg transform rotate-0 transition-transform hover:scale-105 duration-500">
                                <div className="border-4 border-[#123E38] p-4 text-center">
                                    <div className="w-40 h-40 bg-slate-200 mb-2 flex items-center justify-center">
                                        {/* QR Code Placeholder */}
                                        <div className="grid grid-cols-5 grid-rows-5 gap-1 w-32 h-32 opacity-80">
                                            {[...Array(25)].map((_, i) => (
                                                <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="font-mono text-xs text-[#123E38] font-bold">VERIFICATION</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <div className="flex items-center justify-center space-x-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                <p className="text-[#A78BFA] font-bold text-sm tracking-widest uppercase">Waiting for Admin Scan...</p>
                            </div>
                            <p className="text-slate-500 text-[10px] font-mono">DYNAMIC TOKEN EXPIRES IN 01:45</p>
                        </div>
                    </div>

                    {/* Verified Asset Card */}
                    <div className="bg-[#13141F] rounded-2xl p-2 border border-white/5 shadow-2xl relative group">
                        <div className="bg-[#E5E7EB] rounded-xl overflow-hidden relative aspect-square mb-6 flex items-center justify-center p-8">
                            {/* Mock Image of Macbook */}
                            <div className="w-full h-auto drop-shadow-2xl">
                                <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&auto=format&fit=crop&q=60" alt="Macbook" className="w-full object-contain rounded-lg" />
                            </div>
                            <div className="absolute top-4 right-4 text-slate-400">
                                <Package className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="px-4 pb-6">
                            <p className="text-[#A78BFA] text-xs font-bold uppercase tracking-widest mb-1">Verified Asset</p>
                            <h2 className="text-3xl font-bold text-white mb-1">MacBook Pro 14"</h2>
                            <p className="text-slate-400 font-mono text-sm mb-4">Serial: C02-XJ92-LN21</p>
                            <div className="flex space-x-2">
                                <span className="bg-white/5 text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-white/5">ELECTRONICS</span>
                                <span className="bg-white/5 text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-white/5">SILVER</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-[#0B0C15] border-t border-white/5 p-4 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Location</p>
                        <p className="text-white font-bold">Central Library - Security Post A</p>
                    </div>

                    <div className="hidden md:block">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Handover Protocol</p>
                        <p className="text-[#A78BFA] font-bold">Biometric-QR Hybrid</p>
                    </div>

                    <div className="flex space-x-4">
                        <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20 uppercase text-xs font-bold tracking-wider">
                            Cancel Session
                        </Button>
                        <Button className="bg-[#1F2937] hover:bg-[#374151] text-white border border-white/10 uppercase text-xs font-bold tracking-wider flex items-center">
                            <Phone className="w-3 h-3 mr-2" />
                            Call Supervisor
                        </Button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
