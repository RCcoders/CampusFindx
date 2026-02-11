import { supabase } from "./supabase";

export interface Item {
    id: number;
    type: "found" | "lost";
    user_id: number;
    title: string;
    category: string;
    description: string;
    location: string;
    date_found_or_lost: string;
    image_url: string | null;
    status: "pending" | "reported" | "claimed" | "returned";
    item_condition: string | null;
    unique_item_id: string;
    is_deposited_with_authority: number;
    created_at: string;
    updated_at: string;
    reporter_name?: string;
    reporter_email?: string;
    private_proof?: string;
}

export interface Claim {
    id: number;
    item_id: number;
    claimant_id: number;
    proof_description: string;
    proof_image_url: string | null;
    status: "pending" | "approved" | "rejected";
    admin_notes: string | null;
    created_at: string;
    updated_at: string;
    item_title?: string;
    unique_item_id?: string;
    claimant_name?: string;
    claimant_email?: string;
}

const getHeaders = async (includeContentType = true, token?: string) => {
    let accessToken = token;

    if (!accessToken) {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) console.error("API: getHeaders - Session error:", error);
        accessToken = session?.access_token;
    }

    const headers: any = {};
    if (includeContentType) {
        headers["Content-Type"] = "application/json";
    }
    if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
        console.warn("API: getHeaders - No access token available.");
    }
    return headers;
};

export const api = {
    reportLostItem: async (data: {
        title: string;
        category: string;
        description: string;
        location: string;
        dateLost: string;
        privateProof: string;
        reward?: string;
        imageUrl?: string;
        itemCondition?: string;
    }, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch("/api/items/lost", {
            method: "POST",
            headers,
            body: JSON.stringify({
                ...data,
                rewardAmount: data.reward ? parseInt(data.reward) : 0
            }),
        });
        if (!response.ok) throw new Error("Failed to report lost item");
        return response.json();
    },

    getMyLostItems: async (token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch("/api/items/lost/mine", { headers });
        if (!response.ok) throw new Error("Failed to fetch lost items");
        return response.json() as Promise<Item[]>;
    },

    uploadFoundItem: async (data: any, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch("/api/items/found", {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Failed to upload found item");
        return response.json();
    },

    getItem: async (id: string, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch(`/api/items/${id}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch item");
        return response.json() as Promise<Item>;
    },

    // Claims
    submitClaim: async (itemId: number, data: { proofDescription: string; proofImageUrl?: string }, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch(`/api/items/${itemId}/claim`, {
            method: "POST",
            headers,
            body: JSON.stringify(data),
        });

        const text = await response.text();
        console.log("SubmitClaim Response:", response.status, text);

        try {
            const json = JSON.parse(text);
            if (!response.ok) {
                throw new Error(json.error || "Failed to submit claim");
            }
            return json;
        } catch (e) {
            console.error("JSON Parse Error:", e, "Raw Text:", text);
            throw new Error(`Server returned invalid response: ${text.substring(0, 100)}...`);
        }
    },

    getClaims: async (token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch("/api/claims", { headers });
        if (!response.ok) throw new Error("Failed to fetch claims");
        return response.json() as Promise<Claim[]>;
    },

    getMyClaim: async (itemId: number, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch(`/api/items/${itemId}/my-claim`, { headers });
        if (!response.ok) return null; // Or throw, but null is fine for "no claim"
        return response.json();
    },

    confirmClaimReceipt: async (claimId: number, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch(`/api/claims/${claimId}/confirm`, {
            method: "POST",
            headers
        });
        if (!response.ok) throw new Error("Failed to confirm receipt");
        return response.json();
    },

    getItemClaims: async (itemId: number, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch(`/api/items/${itemId}/claims`, { headers });
        if (!response.ok) throw new Error("Failed to fetch item claims");
        return response.json();
    },

    updateClaimStatus: async (id: number, status: "approved" | "rejected", adminNotes: string, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch(`/api/claims/${id}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ status, adminNotes }),
        });
        if (!response.ok) throw new Error("Failed to update claim status");
        return response.json();
    },

    // Handover
    getHandoverDetails: async (claimId: string, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch(`/api/handover/${claimId}`, { headers });
        if (!response.ok) throw new Error("Failed to fetch handover details");
        return response.json();
    },

    confirmHandover: async (claimId: number, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch("/api/handover", {
            method: "POST",
            headers,
            body: JSON.stringify({ claimId }),
        });
        if (!response.ok) throw new Error("Failed to confirm handover");
        return response.json();
    },

    // Notifications
    getNotifications: async (token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch("/api/notifications", { headers });
        if (!response.ok) throw new Error("Failed to fetch notifications");
        return response.json();
    },

    markNotificationAsRead: async (id: number, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch(`/api/notifications/${id}/read`, {
            method: "PATCH",
            headers,
        });
        if (!response.ok) throw new Error("Failed to mark notification as read");
        return response.json();
    },

    // Gamification
    getUserStats: async (token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch("/api/users/me/stats", { headers });
        if (!response.ok) throw new Error("Failed to fetch user stats");
        return response.json();
    },

    updateProfile: async (data: any, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch("/api/users/me", {
            method: "PATCH",
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to update profile");
        }
        return response.json();
    },

    uploadImage: async (file: File, token?: string) => {
        const headers = await getHeaders(false, token); // don't set Content-Type for FormData
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch("/api/upload/image", {
            method: "POST",
            headers,
            body: formData,
        });
        if (!response.ok) {
            let errorMsg = "Failed to upload image";
            try {
                const errorData = await response.json();
                errorMsg = errorData.error || errorMsg;
            } catch (e) {
                // ignore
            }
            throw new Error(errorMsg);
        }
        return response.json();
    },

    getLeaderboard: async (period: "month" | "all" = "all") => {
        const response = await fetch(`/api/leaderboard?period=${period}`);
        if (!response.ok) throw new Error("Failed to fetch leaderboard");
        return response.json();
    },

    getRewards: async () => {
        const response = await fetch("/api/rewards");
        if (!response.ok) throw new Error("Failed to fetch rewards");
        return response.json();
    },

    redeemReward: async (rewardId: number, token?: string) => {
        const headers = await getHeaders(true, token);
        const response = await fetch("/api/rewards/redeem", {
            method: "POST",
            headers,
            body: JSON.stringify({ rewardId }),
        });
        if (!response.ok) throw new Error("Failed to redeem reward");
        return response.json();
    },
};
