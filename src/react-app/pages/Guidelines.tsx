import Layout from "../components/Layout";
import { Shield, FileText, AlertTriangle, Scale } from "lucide-react";

export default function GuidelinesPage() {
    return (
        <Layout>
            <div className="min-h-screen bg-[#0B0C15] text-white p-6 md:p-12">
                <div className="max-w-4xl mx-auto space-y-12 animate-fade-in-up">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-2xl border border-white/10 mb-4">
                            <Scale className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            Guidelines & Policies
                        </h1>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Please read our community guidelines and policies carefully to ensure a safe and helpful experience for everyone on Campus Finder.
                        </p>
                    </div>

                    {/* Community Guidelines */}
                    <section className="bg-[#13141F] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <Shield className="w-8 h-8 text-emerald-400" />
                            <h2 className="text-2xl font-bold">Community Guidelines</h2>
                        </div>
                        <ul className="space-y-4 text-slate-300 leading-relaxed">
                            <li className="flex gap-3">
                                <span className="bg-emerald-400/10 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                <span><strong>Be Honest:</strong> Only claim items that truly belong to you. False claims harm the community and may result in a ban.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-emerald-400/10 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                <span><strong>Submit to Counter:</strong> If you find an item, please submit it to the designated Lost & Found Counter. Do not try to find the owner yourself.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-emerald-400/10 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                <span><strong>Anonymous Process:</strong> The process is completely anonymous. Finders and owners do not meet or exchange contact information.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="bg-emerald-400/10 text-emerald-400 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                                <span><strong>Claiming Items:</strong> To claim an item, visit the counter and provide the verification details shown in the app.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Disclaimer */}
                    <section className="bg-[#13141F] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <AlertTriangle className="w-8 h-8 text-amber-400" />
                            <h2 className="text-2xl font-bold">Disclaimer</h2>
                        </div>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                Campus Finder is a platform designed to track lost items and facilitate their return via the official Lost & Found Counter.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-amber-400">
                                <li>We are <strong>not responsible</strong> for any items that are lost, stolen, or damaged before reaching the counter.</li>
                                <li>The counter staff verifies claims to the best of their ability, but we do not guarantee the condition of returned items.</li>
                                <li><strong>No Direct Contact:</strong> Users are advised NOT to arrange personal meetings. All handovers must occur through the official counter.</li>
                                <li>The Karma system is for engagement purposes and does not hold real-world monetary value.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Terms & Privacy */}
                    <section className="bg-[#13141F] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4 mb-6">
                            <FileText className="w-8 h-8 text-blue-400" />
                            <h2 className="text-2xl font-bold">Terms & Privacy</h2>
                        </div>
                        <div className="space-y-4 text-slate-300 leading-relaxed">
                            <p>
                                By using Campus Finder, you agree to the following:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 marker:text-blue-400">
                                <li><strong>Data Usage:</strong> We collect basic profile information (name, email) from your Google login to create your account and track reputation.</li>
                                <li><strong>Public Information:</strong> Details about lost/found items you post are visible to other logged-in users.</li>
                                <li><strong>Account Termination:</strong> We reserve the right to ban accounts that violate community guidelines or engage in fraudulent activity.</li>
                                <li><strong>Changes:</strong> These policies may be updated at any time. Continued use of the platform constitutes acceptance of any changes.</li>
                            </ul>
                        </div>
                    </section>

                    <div className="text-center pt-8 text-slate-500 text-sm">
                        <p>© {new Date().getFullYear()} Campus Finder. All rights reserved.</p>
                    </div>

                </div>
            </div>
        </Layout>
    );
}
