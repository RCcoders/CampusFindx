import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  Shield,
  TriangleAlert,
  Loader2,
  Package,
  Share2,
  Flag,
  CheckCircle
} from "lucide-react";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { SecureImage } from "../components/SecureImage";
import { ClaimModal } from "../components/ClaimModal";


import { api } from "../lib/api";

export default function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, session } = useAuth();


  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claims, setClaims] = useState<any[]>([]);

  const isOwner = user && item && user.id === item.user_id;

  const [myClaim, setMyClaim] = useState<any>(null);

  useEffect(() => {
    // If owner, fetch all claims
    if (id && isOwner && session?.access_token) {
      api.getItemClaims(Number(id), session.access_token)
        .then(setClaims)
        .catch(err => console.error("Failed to load claims", err));
    }
    // If NOT owner (potential claimant), fetch MY claim
    if (id && !isOwner && session?.access_token) {
      api.getMyClaim(Number(id), session.access_token)
        .then(setMyClaim)
        .catch(err => console.error("Failed to load my claim", err));
    }
  }, [id, isOwner, session]);

  const handleClaimAction = async (claimId: number, status: "approved" | "rejected") => {
    if (!session?.access_token) return;
    if (!confirm(`Are you sure you want to ${status} this claim?`)) return;

    try {
      await api.updateClaimStatus(claimId, status, `Owner ${status}`, session.access_token);
      // Refresh item and claims
      const updatedItem = await api.getItem(id!);
      setItem(updatedItem);
      const updatedClaims = await api.getItemClaims(Number(id), session.access_token);
      setClaims(updatedClaims);
      alert(`Claim ${status} successfully`);
    } catch (err) {
      alert(`Failed to ${status} claim`);
      console.error(err);
    }
  };

  const handleConfirmReceipt = async () => {
    if (!session?.access_token || !myClaim) return;
    if (!confirm("Have you received this item? This will mark the transaction as complete and award karma to the finder.")) return;

    try {
      await api.confirmClaimReceipt(myClaim.id, session.access_token);
      alert("Receipt confirmed! Karma awarded to finder.");
      // Refresh
      const updatedItem = await api.getItem(id!);
      setItem(updatedItem);
      const updatedClaim = await api.getMyClaim(Number(id), session.access_token);
      setMyClaim(updatedClaim);
    } catch (err) {
      alert("Failed to confirm receipt");
      console.error(err);
    }
  };

  useEffect(() => {
    async function loadItem() {
      if (!id) return;
      try {
        const data = await api.getItem(id);
        if (data) {
          setItem(data);
        } else {
          setError("Item not found");
        }
      } catch (err) {
        setError("Failed to load item details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#05060A] flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#05060A] flex items-center justify-center text-center p-4">
          <div>
            <TriangleAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Error Loading Item</h1>
            <p className="text-slate-400 mb-6">{error || "Item does not exist"}</p>
            <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const isFoundItem = item.type === "found";

  console.log("ItemDetail: Rendering with item:", item, "isOwner:", isOwner, "Claims:", claims);

  return (
    <Layout>
      <div className="min-h-screen bg-[#05060A] text-foreground py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-8 text-slate-400 hover:text-white pl-0 hover:bg-transparent"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Registry
          </Button>

          {/* Owner Dashboard for Found Items */}
          {isOwner && isFoundItem && (
            <div className="mb-8 bg-[#13141F] border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    Manage Claims
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Review validation attempts for this item.</p>
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  {claims.filter(c => c.status === 'pending').length} Pending
                </Badge>
              </div>

              <div className="space-y-4 relative z-10">
                {claims.filter(c => c.status !== 'completed').length === 0 ? (
                  <div className="text-center py-8 text-slate-500 border border-white/5 rounded-xl bg-black/20">
                    No active claims.
                  </div>
                ) : (
                  claims.filter(c => c.status !== 'completed').map((claim) => (
                    <div key={claim.id} className="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="font-bold text-white">{claim.claimant_name || "Unknown User"}</div>
                          <Badge variant="outline" className={`text-[10px] uppercase ${claim.status === 'approved' ? 'border-green-500/50 text-green-400' :
                            claim.status === 'rejected' ? 'border-red-500/50 text-red-400' :
                              'border-amber-500/50 text-amber-400'
                            }`}>
                            {claim.status}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(claim.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm text-slate-300 bg-white/5 p-3 rounded-lg border border-white/5">
                          <span className="text-slate-500 text-xs block mb-1 uppercase font-bold tracking-wider">Proof Description:</span>
                          {claim.proof_description}
                        </div>
                      </div>

                      {claim.status === 'pending' && (
                        <div className="flex gap-2 shrink-0 w-full md:w-auto">
                          <Button
                            size="sm"
                            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 flex-1 md:flex-none"
                            onClick={() => handleClaimAction(claim.id, 'rejected')}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white flex-1 md:flex-none"
                            onClick={() => handleClaimAction(claim.id, 'approved')}
                          >
                            Approve Claim
                          </Button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Left Column: Image/Visuals */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-[#0E0F19] rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-[4/5]">
                {item.image_url ? (
                  <SecureImage
                    storagePath={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#13141F]">
                    <Package className="w-24 h-24 text-slate-700" />
                  </div>
                )}

                {/* Overlay Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <Badge className={`${item.status === 'returned' ? 'bg-emerald-500 text-black' :
                      isFoundItem ? 'bg-secondary text-black' :
                        'bg-amber-500 text-black'
                    } font-bold px-3 py-1 shadow-lg`}>
                    {item.status === 'returned' ? "RETURNED" :
                      isFoundItem ? "SECURED IN LOCKER" : "REPORTED MISSING"}
                  </Badge>
                  {isFoundItem && (
                    <Badge className="bg-black/80 backdrop-blur border border-white/20 text-white font-mono">
                      ID: {item.unique_item_id || `F-${item.id}99`}
                    </Badge>
                  )}
                </div>

                {/* Privacy Overlay if needed */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0E0F19] to-transparent p-8">
                  <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono mb-2">
                    <Shield className="w-3 h-3" />
                    <span>IMAGE AUTHENTICATED BY GHOST GRID</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="space-y-8 pt-4">

              <div>
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">{item.category}</h2>
                  <div className="flex items-center space-x-2">
                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-slate-400">
                      <Share2 className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/10 text-slate-400">
                      <Flag className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">{item.title}</h1>

                <div className="flex flex-wrap gap-4 text-sm text-slate-300 mb-8 border-y border-white/5 py-6">
                  <div className="flex items-center px-4 py-2 bg-[#13141F] rounded-full border border-white/5">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    {item.location}
                  </div>
                  <div className="flex items-center px-4 py-2 bg-[#13141F] rounded-full border border-white/5">
                    <Calendar className="w-4 h-4 mr-2 text-primary" />
                    {new Date(item.date_found_or_lost).toLocaleDateString(undefined, { dateStyle: "long" })}
                  </div>
                </div>

                <div className="prose prose-invert max-w-none mb-12">
                  <h3 className="text-lg font-bold text-white mb-2">Description</h3>
                  <p className="text-slate-400 leading-relaxed text-lg">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Zone */}
              <div className="bg-[#13141F]/50 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
                {isFoundItem ? (
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Is this your item?</h3>

                    {myClaim ? (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <span className="text-slate-400">Your Claim Status:</span>
                          <Badge className={`${myClaim.status === 'approved' ? 'bg-green-500 text-black' :
                            myClaim.status === 'rejected' ? 'bg-red-500 text-white' :
                              'bg-amber-500 text-black'
                            }`}>{myClaim.status.toUpperCase()}</Badge>
                        </div>

                        {myClaim.status === 'approved' && (
                          <div className="mt-4">
                            <p className="text-sm text-slate-300 mb-3">
                              Please collect your item from the finder. Once you have it, verify receipt below to award them Karma!
                            </p>
                            <Button
                              onClick={handleConfirmReceipt}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              I Have Received This Item
                            </Button>
                          </div>
                        )}

                        {myClaim.status === 'completed' && (
                          <div className="mt-2 text-emerald-400 flex items-center justify-center gap-2 font-bold">
                            <CheckCircle className="w-5 h-5" />
                            Transaction Complete
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-400 mb-6">
                          To claim this item, you'll need to answer a security challenge verifying unique details not shown in the image.
                        </p>
                        <Button
                          className="w-full bg-secondary hover:bg-secondary/90 text-black font-black text-lg h-14 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                          onClick={() => setIsClaimModalOpen(true)}
                        >
                          START CLAIM CHALLENGE
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Did you find this?</h3>
                    <p className="text-slate-400 mb-6">
                      Help return this item to its owner. Report it as found and we'll match you securely.
                    </p>
                    <Button
                      className="w-full bg-white hover:bg-slate-200 text-black font-black text-lg h-14 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      onClick={() => navigate("/upload-found", { state: { lostItem: item } })}
                    >
                      I FOUND THIS ITEM
                    </Button>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
      <ClaimModal
        itemId={item ? item.id : 0}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        token={session?.access_token}
      />
    </Layout>
  );
}
