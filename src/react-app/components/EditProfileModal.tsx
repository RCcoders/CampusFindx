import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { api } from "../lib/api";
import { Edit2, Upload, Loader2, CheckCircle2 } from "lucide-react";

interface EditProfileModalProps {
    user: any;
    onProfileUpdate: () => void;
}

export function EditProfileModal({ user, onProfileUpdate }: EditProfileModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        collegeId: "",
        rollNumber: "",
        department: "",
        block: "",
        phoneNumber: "",
        altEmail: "",
        altPhone: "",
        collegeIdImageUrl: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                collegeId: user.college_id || "",
                rollNumber: user.college_roll_number || "",
                department: user.department || "",
                block: user.block || "",
                phoneNumber: user.phone_number || "",
                altEmail: user.alternative_email || "",
                altPhone: user.alternative_phone || "",
                collegeIdImageUrl: user.college_id_image_url || "",
            });
        }
    }, [user, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, block: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { url } = await api.uploadImage(file);
            setFormData((prev) => ({ ...prev, collegeIdImageUrl: url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formData.collegeId && !formData.collegeId.endsWith("@cgc.edu.in")) {
                alert("College ID must end with @cgc.edu.in");
                setLoading(false);
                return;
            }

            await api.updateProfile(formData);
            onProfileUpdate();
            setOpen(false);
        } catch (error: any) {
            console.error("Update failed", error);
            alert(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#6D28D9] hover:bg-[#5B21B6] text-white shadow-lg shadow-primary/25 relative z-10 flex items-center">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-[#13141F] border-white/10 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="collegeId">College Email ID</Label>
                            <Input
                                id="collegeId"
                                name="collegeId"
                                value={formData.collegeId}
                                onChange={handleChange}
                                placeholder="student@cgc.edu.in"
                                className="bg-[#0B0C15] border-white/10"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="rollNumber">College Roll Number</Label>
                            <Input
                                id="rollNumber"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                placeholder="1234567"
                                className="bg-[#0B0C15] border-white/10"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <Input
                                id="department"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="CSE"
                                className="bg-[#0B0C15] border-white/10"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="block">Block</Label>
                            <Select
                                value={formData.block}
                                onValueChange={handleSelectChange}
                            >
                                <SelectTrigger className="bg-[#0B0C15] border-white/10">
                                    <SelectValue placeholder="Select Block" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#13141F] border-white/10 text-white">
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                                        <SelectItem key={num} value={num.toString()}>
                                            Block {num}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+91..."
                                className="bg-[#0B0C15] border-white/10"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="altPhone">Alt Phone Number</Label>
                            <Input
                                id="altPhone"
                                name="altPhone"
                                value={formData.altPhone}
                                onChange={handleChange}
                                placeholder="+91..."
                                className="bg-[#0B0C15] border-white/10"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="altEmail">Alternative Email</Label>
                        <Input
                            id="altEmail"
                            name="altEmail"
                            value={formData.altEmail}
                            onChange={handleChange}
                            placeholder="personal@gmail.com"
                            className="bg-[#0B0C15] border-white/10"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>College ID Card Image</Label>
                        <div className="flex gap-4 items-center">
                            {formData.collegeIdImageUrl && (
                                <div className="relative w-24 h-16 rounded overflow-hidden border border-white/10 shrink-0">
                                    <img src={formData.collegeIdImageUrl} alt="ID Card" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    </div>
                                </div>
                            )}

                            <Label htmlFor="id-upload" className="flex-1 cursor-pointer">
                                <div className={`border-2 border-dashed border-white/20 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-white/5 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                    {uploading ? (
                                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 text-slate-400 mb-2" />
                                            <span className="text-xs text-slate-400">
                                                {formData.collegeIdImageUrl ? "Change ID Card Image" : "Upload ID Card Image"}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </Label>
                            <input
                                id="id-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={loading || uploading} className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
