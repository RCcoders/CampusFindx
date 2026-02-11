import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleAlert, Loader2, Upload, Star, Shield, FileWarning, ArrowLeft } from "lucide-react";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

export default function ReportLostPage() {
  const navigate = useNavigate();
  const { user, session, redirectToLogin } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
    privateProof: "",
    reward: "",
    imageUrl: "",
    itemCondition: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSpecialComplaint, setIsSpecialComplaint] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Electronics", "Accessories", "Documents", "Clothing", "Books", "Other"];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { url } = await api.uploadImage(file, session?.access_token);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      redirectToLogin();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await api.reportLostItem({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        dateLost: formData.date,
        privateProof: formData.privateProof,
        reward: isSpecialComplaint ? formData.reward : undefined,
        imageUrl: formData.imageUrl,
        itemCondition: formData.itemCondition
      }, session?.access_token);
      navigate("/lost");
    } catch (err) {
      setError("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#05060A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-slate-400 hover:text-white pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Cancel Report
          </Button>

          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
              <CircleAlert className="w-8 h-8 text-amber-500" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">Report Lost Item</h1>
            <p className="text-slate-400 max-w-lg mx-auto">
              Create a secure entry in the Ghost Grid. Sensitive details are kept private and revealed only for verification.
            </p>
          </div>

          <Card className="bg-[#0E0F19] border border-white/5 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>

            <CardContent className="p-8 md:p-12">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-8 flex items-center">
                  <FileWarning className="w-5 h-5 mr-3 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">

                {/* Section 1: Item Identity */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-amber-500 mb-4">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Asset Identification</span>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-slate-300">Item Name</Label>
                    <Input
                      id="title"
                      placeholder="e.g., MacBook Pro M1, Blue Hydro Flask"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="bg-[#13141F] border-white/5 text-white placeholder:text-slate-600 focus:ring-amber-500/50 h-14 text-lg"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-slate-300">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger className="bg-[#13141F] border-white/5 text-white h-14">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1B26] border-white/10 text-white">
                          {categories.map((category) => (
                            <SelectItem key={category} value={category} className="focus:bg-amber-500 focus:text-black">
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="itemCondition" className="text-slate-300">Condition</Label>
                      <Select value={formData.itemCondition} onValueChange={(value) => setFormData({ ...formData, itemCondition: value })}>
                        <SelectTrigger id="itemCondition" className="bg-[#13141F] border-white/5 text-white h-14">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1A1B26] border-white/10 text-white">
                          <SelectItem value="New" className="focus:bg-amber-500 focus:text-black">New</SelectItem>
                          <SelectItem value="Good" className="focus:bg-amber-500 focus:text-black">Good</SelectItem>
                          <SelectItem value="Fair" className="focus:bg-amber-500 focus:text-black">Fair</SelectItem>
                          <SelectItem value="Poor" className="focus:bg-amber-500 focus:text-black">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-300">Visual Attributes</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe visible features (color, stickers, dents). Do NOT include serial numbers here."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                      className="bg-[#13141F] border-white/5 text-white placeholder:text-slate-600 focus:ring-amber-500/50 min-h-[120px] resize-none"
                    />
                  </div>
                </div>

                <div className="h-px bg-white/5 my-8"></div>

                {/* Section 2: Temporal & Spatial Data */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-amber-500 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <span className="text-xs font-bold uppercase tracking-widest">Space-Time Coordinates</span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-slate-300">Last Seen Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Library 2nd Floor, Cafeteria"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                        className="bg-[#13141F] border-white/5 text-white placeholder:text-slate-600 focus:ring-amber-500/50 h-14"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-slate-300">Date of Loss</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                        className="bg-[#13141F] border-white/5 text-white placeholder:text-slate-600 focus:ring-amber-500/50 h-14 [color-scheme:dark]"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-white/5 my-8"></div>

                {/* Section 3: Evidence & Verification */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 text-amber-500 mb-4">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Verification Data</span>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Reference Image (Optional)</Label>
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-white/5 hover:border-amber-500/30 transition-all group">
                      {formData.imageUrl ? (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden">
                          <img src={formData.imageUrl} className="w-full h-full object-cover opacity-80" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="text-xs font-bold text-white bg-black/50 px-3 py-1 rounded-full border border-white/20">Image Secured</span>
                          </div>
                        </div>
                      ) : (
                        <label htmlFor="image-upload" className="cursor-pointer text-center w-full">
                          <div className="w-12 h-12 rounded-full bg-[#13141F] flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform">
                            <Upload className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                          </div>
                          <span className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors block">
                            Upload Reference Photo
                          </span>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                        </label>
                      )}
                      {isUploading && <Loader2 className="w-6 h-6 text-amber-500 animate-spin mt-4" />}
                    </div>
                  </div>

                  <div className="bg-[#13141F] border border-amber-500/20 rounded-xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Shield className="w-24 h-24 text-amber-500" />
                    </div>
                    <Label htmlFor="privateProof" className="text-amber-500 flex items-center mb-2 font-bold">
                      Private Verification Details
                    </Label>
                    <p className="text-xs text-slate-500 mb-4 max-w-lg">
                      Details known ONLY to you (e.g., Lock Screen text, Battery level, scratches on underside). These details will be used to verify your ownership when a match is found.
                    </p>
                    <Textarea
                      id="privateProof"
                      placeholder="Enter specific details that only the owner would know..."
                      value={formData.privateProof}
                      onChange={(e) => setFormData({ ...formData, privateProof: e.target.value })}
                      rows={4}
                      required
                      className="bg-[#0B0C15] border-amber-500/20 text-white placeholder:text-slate-700/50 focus:ring-amber-500/50 min-h-[100px] font-mono text-sm"
                    />
                  </div>

                  {/* Bounty */}
                  <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500">
                        <Star className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Attach Bounty</div>
                        <div className="text-xs text-slate-500">Incentivize priority search.</div>
                      </div>
                    </div>
                    <Switch
                      checked={isSpecialComplaint}
                      onCheckedChange={setIsSpecialComplaint}
                      className="data-[state=checked]:bg-amber-500"
                    />
                  </div>

                  {isSpecialComplaint && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                      <Label htmlFor="reward" className="text-amber-500 mb-2 block">Amount (₹)</Label>
                      <Input
                        id="reward"
                        type="number"
                        placeholder="500"
                        value={formData.reward}
                        onChange={(e) => setFormData({ ...formData, reward: e.target.value })}
                        className="bg-[#13141F] border-amber-500/30 text-amber-500 text-xl font-bold h-14"
                      />
                    </div>
                  )}

                </div>

                <div className="pt-8">
                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-black tracking-widest text-lg shadow-lg hover:shadow-orange-500/25 transition-all rounded-xl"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        SUBMITTING REPORT...
                      </>
                    ) : "ACTIVATE SEARCH PROTOCOL"}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
