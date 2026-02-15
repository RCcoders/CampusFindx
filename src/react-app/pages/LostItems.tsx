import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Package, MapPin, Loader2, Shield, ArrowUpRight, Plus, Calendar } from "lucide-react";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";

import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import { SecureImage } from "../components/SecureImage";

interface LostItem {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  date_found_or_lost: string;
  image_url: string | null;
  status: string;
  unique_item_id: string;
  reporter_name: string;
  created_at: string;
}

interface FoundItem {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  date_found_or_lost: string;
  image_url: string | null;
  status: string;
  unique_item_id: string;
  reporter_name: string;
  claimed_count: number;
  created_at: string;
}

export default function LostItemsPage() {
  const [items, setItems] = useState<LostItem[]>([]);
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState([0, 90]);

  const categories = [
    { id: "all", label: "All Items" },
    { id: "Electronics", label: "Electronics" },
    { id: "Apparel", label: "Apparel" },
    { id: "Stationery", label: "Stationery" },
    { id: "Books", label: "Books" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchLostItems(), fetchFoundItems()]);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, selectedCategory, dateRange]);

  const fetchLostItems = async () => {
    try {
      const response = await fetch("/api/items/lost");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Failed to fetch lost items:", error);
    }
  };

  const fetchFoundItems = async () => {
    try {
      const response = await fetch("/api/items/found");
      if (response.ok) {
        const data = await response.json();
        setFoundItems(data.slice(0, 4));
      }
    } catch (error) {
      console.error("Failed to fetch found items:", error);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }

    // Category Filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Date Filter (Days Ago)
    if (dateRange[1] < 90) { // If max is less than max allowed, filter (e.g. 90)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - dateRange[1]);
      filtered = filtered.filter(item => new Date(item.date_found_or_lost) >= cutoffDate);
    }

    setFilteredItems(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#05060A] text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* Hero / Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">Filter Engine</h1>
              <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
                Enter the details of your missing possession. Our <span className="text-primary font-bold">Ghost Grid</span> protects item privacy while helping you identify a match.
              </p>
            </div>
            <Button asChild size="lg" className="bg-primary text-white hover:bg-violet-600 font-bold rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all">
              <Link to="/upload-lost" className="flex items-center">
                <Plus className="mr-2 w-5 h-5" /> Report Lost Item
              </Link>
            </Button>
          </div>

          {/* Filter Bar Container */}
          <div className="bg-[#0B0C15] border border-white/5 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-end mb-8 relative z-10">
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <Search className="w-3 h-3 mr-2" /> Search Keywords
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Blue water bottle, Casio watch, Leather wallet..."
                    className="w-full bg-[#13141F] border border-white/10 rounded-2xl h-16 pl-6 pr-6 text-lg text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Search className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                    <Calendar className="w-3 h-3 mr-2" /> Last Seen Window
                  </label>
                  <Badge variant="outline" className="text-[10px] border-primary/30 text-primary bg-primary/5">
                    {dateRange[1] >= 90 ? "All Time" : `Last ${dateRange[1]} Days`}
                  </Badge>
                </div>
                <div className="h-16 bg-[#13141F] border border-white/10 rounded-2xl px-6 flex items-center">
                  <Slider
                    defaultValue={[90]}
                    max={90}
                    step={1}
                    value={[dateRange[1]]}
                    onValueChange={(val) => setDateRange([0, val[0]])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 relative z-10">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${selectedCategory === cat.id
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] scale-105"
                    : "bg-[#13141F] text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(139,92,246,0.8)] animate-pulse"></span>
              <span className="text-sm font-black text-slate-200 tracking-widest uppercase">
                {filteredItems.length} Potential Matches Found
              </span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] font-mono text-slate-600">
              <Shield className="w-3 h-3" />
              <span>PRIVACY PROTECTION ENABLED</span>
            </div>
          </div>

          {/* Items Grid */}
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-24 bg-[#0B0C15] border border-dashed border-white/10 rounded-3xl">
              <Package className="w-16 h-16 text-slate-700 mx-auto mb-4" />
              <h3 className="text-xl text-slate-300 font-bold mb-2">No matches found</h3>
              <p className="text-slate-500">Try adjusting your filters or keywords.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
              {filteredItems.map((item) => (
                <div key={item.id} className="group relative bg-[#0E0F19] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] flex flex-col">
                  {/* Image Area */}
                  <div className="relative h-64 bg-black/50 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-black/60 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-mono">
                        CASE #{item.unique_item_id || `LOST-${item.id}`}
                      </Badge>
                    </div>

                    {item.image_url ? (
                      <SecureImage
                        storagePath={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center opacity-30">
                        <Package className="w-16 h-16 text-slate-500 mb-2" />
                      </div>
                    )}

                    {/* Privacy Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0F19] via-transparent to-transparent opacity-90"></div>

                    <div className="absolute bottom-4 left-0 right-0 px-6 flex justify-center">
                      <div className="bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center space-x-2">
                        <Shield className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">Identity Obscured</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">{item.category}</div>
                        <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 text-right">
                        <div>LAST SEEN</div>
                        <div className="text-slate-300 font-bold">{formatDate(item.date_found_or_lost)}</div>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-slate-400 mb-6 bg-white/5 py-2 px-3 rounded-lg w-fit">
                      <MapPin className="w-3 h-3 mr-2 text-primary" />
                      <span className="truncate max-w-[200px]">{item.location}</span>
                    </div>

                    <div className="mt-auto">
                      <Button asChild className="w-full bg-white text-black hover:bg-slate-200 font-black h-12 text-sm tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                        <Link to={`/item/${item.id}`}>
                          I FOUND IT
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Cross-Visibility: Found Items */}
          {foundItems.length > 0 && (
            <div className="mt-24 pt-12 border-t border-white/5">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Recently Found</h2>
                  <p className="text-slate-500 text-sm">Items securely deposited by others.</p>
                </div>
                <Button variant="ghost" asChild className="text-slate-400 hover:text-white">
                  <Link to="/found" className="flex items-center">
                    View All <ArrowUpRight className="ml-1 w-4 h-4" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {foundItems.map(item => (
                  <Link key={item.id} to={`/item/${item.id}`} className="block group">
                    <div className="bg-[#13141F] rounded-xl overflow-hidden aspect-square border border-white/5 group-hover:border-primary/50 transition-all relative">
                      {item.image_url ? (
                        <SecureImage storagePath={item.image_url} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5">
                          <Package className="text-slate-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                        <p className="text-xs font-bold text-white truncate w-full">{item.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
}
