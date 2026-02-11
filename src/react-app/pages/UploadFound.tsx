import { useState } from "react";
import { nanoid } from 'nanoid';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { Upload, TriangleAlert, CircleCheck, Loader2, X, MapPin, ArrowLeft, Shield } from "lucide-react";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { api } from "../lib/api";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { supabase } from "../lib/supabase";

export default function UploadFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, session, redirectToLogin } = useAuth();

  const initialData = location.state?.lostItem ? {
    title: location.state.lostItem.title,
    category: location.state.lostItem.category,
    description: `Found item matching lost report: "${location.state.lostItem.title}"\n\nDescription: ${location.state.lostItem.description}`,
    location: location.state.lostItem.location,
    dateFound: new Date().toISOString().split('T')[0],
    itemCondition: ""
  } : {
    title: "",
    category: "",
    description: "",
    location: "",
    dateFound: "",
    itemCondition: ""
  };

  const [formData, setFormData] = useState(initialData);
  const [, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Electronics", "Accessories", "Documents", "Clothing", "Books", "Keys", "Wallet", "Bag", "Other"];

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${nanoid()}.${fileExt}`;
      const filePath = fileName; // Store relative path

      const { error: uploadError } = await supabase.storage
        .from('item-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      setUploadedImageUrl(filePath); // Store the path, not the URL

    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please try again.");
      setImageFile(null);
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setUploadedImageUrl(null);
    setUploadedImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      redirectToLogin();
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const data = await api.uploadFoundItem({
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        dateFound: formData.dateFound,
        imageUrl: uploadedImageUrl, // This is now the storage path
        itemCondition: formData.itemCondition,
      }, session?.access_token);

      navigate(`/item/${data.itemId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit found item");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#05060A]">
          <Card className="bg-[#13141F] border border-white/10 p-8 text-center max-w-md">
            <Shield className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-white mb-2">Authenticated Access Only</h1>
            <p className="text-slate-400 mb-6">You must be logged in to secure items in the registry.</p>
            <Button onClick={redirectToLogin} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12">
              Secure Login
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#05060A] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-slate-400 hover:text-white pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Cancel Submission
          </Button>

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 text-emerald-500 mb-2">
                <Shield className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Authorized Asset Recovery</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">Register Found Item</h1>
              <p className="text-slate-400 text-lg max-w-2xl mt-2">
                Secure an item you've found. The system will hold it in escrow until verified.
              </p>
            </div>

            <div className="hidden md:block">
              <div className="bg-[#13141F] border border-emerald-500/20 rounded-xl p-4 flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Current Karma Status</div>
                  <div className="text-emerald-400 font-mono font-bold">+50 PTS PENDING</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                  <CircleCheck className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-8">
            <div className="space-y-6">
              <Card className="bg-[#0E0F19] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>

                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                      <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
                        <TriangleAlert className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    {location.state?.lostItem && (
                      <Alert className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 mb-6">
                        <CircleCheck className="h-4 w-4" />
                        <AlertDescription className="font-bold">
                          SYSTEM MATCH: Reporting against Lost Item Report #{location.state.lostItem.id}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <Label className="text-emerald-500 font-bold uppercase text-xs tracking-widest flex items-center mb-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                        Visual Evidence
                      </Label>

                      {!imagePreview ? (
                        <label
                          htmlFor="image"
                          className="border-2 border-dashed border-white/10 rounded-2xl p-10 text-center hover:border-emerald-500/50 hover:bg-emerald-900/5 transition-all cursor-pointer block group bg-[#13141F]"
                        >
                          <div className="w-16 h-16 bg-[#0B0C15] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20 box-content p-1">
                            <Upload className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                          </div>
                          <p className="text-lg text-white font-bold mb-1 group-hover:text-emerald-400">Upload Evidence Photo</p>
                          <p className="text-sm text-slate-500">Please ensure no personal data (IDs, credit cards) is visible.</p>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            onChange={handleImageSelect}
                          />
                        </label>
                      ) : (
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0B0C15] group">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-80 object-cover opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur text-white rounded-full hover:bg-red-500/80 transition-all border border-white/10"
                          >
                            <X className="w-5 h-5" />
                          </button>

                          {isUploading && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
                              <div className="text-center">
                                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
                                <p className="text-sm text-emerald-500 font-mono tracking-widest">UPLOADING SECURELY...</p>
                              </div>
                            </div>
                          )}


                        </div>
                      )}
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
                              <SelectItem key={category} value={category} className="focus:bg-emerald-600 focus:text-white cursor-pointer">
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateFound" className="text-slate-300">Date Found</Label>
                        <Input
                          id="dateFound"
                          type="date"
                          value={formData.dateFound}
                          onChange={(e) => setFormData({ ...formData, dateFound: e.target.value })}
                          required
                          className="bg-[#13141F] border-white/5 text-white h-14 focus:ring-emerald-500/50 [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-slate-300">Item Name</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Black iPhone 13 with clear case"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                        className="bg-[#13141F] border-white/5 text-white h-14 focus:ring-emerald-500/50 text-lg placeholder:text-slate-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-slate-300">Detailed Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Provide details about uniqueness, scratches, stickers etc."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        required
                        className="bg-[#13141F] border-white/5 text-white resize-none focus:ring-emerald-500/50 placeholder:text-slate-600 min-h-[120px]"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-slate-300">Location Found</Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                          <Input
                            id="location"
                            placeholder="e.g., Library 2nd Floor"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            required
                            className="bg-[#13141F] border-white/5 text-white h-14 pl-12 focus:ring-emerald-500/50 placeholder:text-slate-600"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="itemCondition" className="text-slate-300">Condition</Label>
                        <Select value={formData.itemCondition} onValueChange={(value) => setFormData({ ...formData, itemCondition: value })}>
                          <SelectTrigger id="itemCondition" className="bg-[#13141F] border-white/5 text-white h-14">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1B26] border-white/10 text-white">
                            <SelectItem value="New" className="focus:bg-emerald-600 focus:text-white">New</SelectItem>
                            <SelectItem value="Good" className="focus:bg-emerald-600 focus:text-white">Good</SelectItem>
                            <SelectItem value="Fair" className="focus:bg-emerald-600 focus:text-white">Fair</SelectItem>
                            <SelectItem value="Poor" className="focus:bg-emerald-600 focus:text-white">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={isSubmitting || isUploading}
                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-widest text-lg shadow-[0_0_30px_rgba(16,185,129,0.3)] rounded-xl transition-all hover:scale-[1.01]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            SECURING ITEM...
                          </>
                        ) : (
                          "SECURE & REPORT ITEM"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Tips Panel */}
              <div className="bg-[#13141F] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-6 flex items-center tracking-wide">
                  <CircleCheck className="w-5 h-5 text-emerald-500 mr-2" />
                  SUBMISSION PROTOCOL
                </h3>
                <div className="space-y-6 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-white/10"></div>
                  {[
                    { title: "UPLOAD EVIDENCE", desc: "Clear photo required for ID." },
                    { title: "DEPOSIT ITEM", desc: "Handover to nearest Security Point." },
                    { title: "VERIFICATION", desc: "Admin confirms physical custody." },
                    { title: "SYSTEM ENTRY", desc: "Item goes live on Found Grid." }
                  ].map((step, i) => (
                    <div key={i} className="flex relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-[#0B0C15] border-2 border-emerald-500 z-10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white mb-0.5">{step.title}</div>
                        <div className="text-xs text-slate-500 font-mono tracking-tight uppercase">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banner */}
              <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <Shield className="w-32 h-32 text-emerald-500" />
                </div>
                <h3 className="text-white font-bold mb-2 relative z-10">Karma Multiplier</h3>
                <p className="text-xs text-slate-300 mb-4 relative z-10 leading-relaxed">
                  Consistently reporting found items increases your <span className="text-emerald-400 font-bold">Trust Score</span>, unlocking premium campus perks.
                </p>
                <div className="flex items-center space-x-2 text-emerald-400 font-mono text-sm font-bold relative z-10">
                  <span>+50 POTENTIAL KARMA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
