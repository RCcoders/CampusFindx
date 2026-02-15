export type ItemCategory = "electronics" | "documents" | "clothing" | "accessories" | "keys" | "bags" | "other";
export type ItemStatus = "unclaimed" | "claimed" | "under_review" | "handed_over" | "expired";
export type ClaimStatus = "pending" | "approved" | "rejected" | "handover_complete";

export const categoryLabels: Record<string, string> = {
    electronics: "Electronics",
    documents: "Documents & IDs",
    clothing: "Clothing",
    accessories: "Accessories",
    keys: "Keys",
    bags: "Bags & Backpacks",
    other: "Other",
};

export const categoryIcons: Record<string, string> = {
    electronics: "📱",
    documents: "📄",
    clothing: "👕",
    accessories: "⌚",
    keys: "🔑",
    bags: "🎒",
    other: "📦",
};
