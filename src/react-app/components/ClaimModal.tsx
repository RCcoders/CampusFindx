import { useState } from "react";
import { X, Shield, Lock, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { api } from "../lib/api";

interface ClaimModalProps {
    itemId: number;
    isOpen: boolean;
    onClose: () => void;
    token?: string;
}

export function ClaimModal({ itemId, isOpen, onClose, token }: ClaimModalProps) {
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await api.submitClaim(itemId, { proofDescription: description }, token);
            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setDescription("");
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to submit claim");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0E0F19] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-500">
                        <Shield className="w-5 h-5" />
                        <span className="font-bold tracking-widest text-xs uppercase">Secure Claim Protocol</span>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Verify Ownership</h2>
                                <p className="text-slate-400 text-sm">
                                    To prevent fraud, please describe unique details about this item that are NOT visible in the photo.
                                </p>
                            </div>

                            {error && (
                                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="proof" className="text-white">Proof Description <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="proof"
                                        placeholder="E.g. It has a small scratch on the bottom right corner, or the wallpaper is a picture of a dog..."
                                        className="bg-[#13141F] border-white/10 text-white min-h-[120px] focus-visible:ring-emerald-500/50"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-start space-x-3">
                                    <Lock className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                                    <p className="text-xs text-amber-200/80">
                                        Your claim will be reviewed by the finder or campus authority. False claims may result in account suspension and reputation penalties.
                                    </p>
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-2">
                                <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-slate-400 hover:text-white hover:bg-white/5">
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                                    disabled={isSubmitting || !description.trim()}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Claim"
                                    )}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50 text-emerald-400">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Claim Submitted!</h3>
                            <p className="text-slate-400">
                                The finder has been notified. You can track the status in your dashboard.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
