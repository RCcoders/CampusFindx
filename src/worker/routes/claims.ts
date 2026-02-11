import { Hono } from "hono";
import { Bindings, Variables, authMiddleware, getSupabase, syncUser } from "../utils";

const claims = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Submit Claim (Generic /api/claims endpoint)
claims.post("/", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);

    const { itemId, proofDescription, proofImageUrl } = await c.req.json<any>();

    const { data: item } = await supabase.from("items").select("*").eq("id", itemId).single();
    if (!item || item.type !== 'found') return c.json({ error: "Invalid item" }, 400);

    const { data: existing } = await supabase.from("claims")
        .select("*")
        .eq("item_id", itemId)
        .eq("claimant_id", localUser.id)
        .eq("status", "pending")
        .single();

    if (existing) return c.json({ error: "Claim pending" }, 400);

    await supabase.from("claims").insert({
        item_id: itemId,
        claimant_id: localUser.id,
        proof_description: proofDescription,
        proof_image_url: proofImageUrl || null
    });

    return c.json({ success: true });
});

// Get Claims (Authority)
claims.get("/", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);

    if (localUser.role !== 'authority' && localUser.role !== 'admin') return c.json({ error: "Unauthorized" }, 403);

    const { data } = await supabase
        .from("claims")
        .select("*, items(title, unique_item_id), users:users!claimant_id(name, email)")
        .eq("status", "pending")
        .order("created_at", { ascending: true });

    const claimsList = data?.map((c: any) => ({
        ...c,
        item_title: c.items?.title,
        unique_item_id: c.items?.unique_item_id,
        claimant_name: c.users?.name,
    }));

    return c.json(claimsList || []);
});

// Update Claim Status (Finder or Authority)
claims.patch("/:id", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);

    const claimId = c.req.param("id");
    const { status, adminNotes } = await c.req.json<any>();

    // Get the claim and the associated item to check ownership
    const { data: claim } = await supabase
        .from("claims")
        .select("*, items(user_id)") // Select item owner
        .eq("id", claimId)
        .single();

    if (!claim) return c.json({ error: "Claim not found" }, 404);

    // Check permission: Must be Admin, Authority, OR the Item Owner (Finder)
    const isOwner = claim.items && claim.items.user_id === localUser.id;
    if (localUser.role !== 'authority' && localUser.role !== 'admin' && !isOwner) {
        return c.json({ error: "Unauthorized to manage this claim" }, 403);
    }

    if (status === 'rejected') {
        await supabase.from("claims").update({
            status: 'rejected',
            admin_notes: adminNotes, // or rejection_reason
            verified_by_user_id: localUser.id,
            verified_at: new Date().toISOString()
        }).eq("id", claimId);

        // Notify claimant
        await supabase.from("notifications").insert({
            user_id: claim.claimant_id,
            title: "Claim Rejected",
            message: `Your claim for item #${claim.item_id} was rejected.`,
            type: "claim_rejected",
            claim_id: claimId,
            item_id: claim.item_id
        });

    } else if (status === 'approved') {
        // Approve this claim
        await supabase.from("claims").update({
            status: 'approved',
            admin_notes: adminNotes,
            verified_by_user_id: localUser.id,
            verified_at: new Date().toISOString()
        }).eq("id", claimId);

        // Update Item Status
        await supabase.from("items").update({ status: 'claimed' }).eq("id", claim.item_id);

        // Notify claimant
        await supabase.from("notifications").insert({
            user_id: claim.claimant_id,
            title: "Claim Approved!",
            message: `Your claim for item #${claim.item_id} has been approved! Connect with the finder.`,
            type: "claim_approved",
            claim_id: claimId,
            item_id: claim.item_id
        });
    }

    return c.json({ success: true });
});

// Confirm Claim Receipt (Claimant Only) - Triggers Karma
claims.post("/:id/confirm", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);

    const claimId = c.req.param("id");

    // 1. Get Claim & Item
    const { data: claim, error: claimError } = await supabase
        .from("claims")
        .select("*, items(user_id, title)")
        .eq("id", claimId)
        .single();

    if (claimError || !claim) return c.json({ error: "Claim not found" }, 404);

    // 2. Auth Check: Must be the claimant
    if (claim.claimant_id !== authUser.id) {
        return c.json({ error: "Unauthorized: only the claimant can confirm receipt API" }, 403);
    }

    // 3. Status Check: Must be approved
    if (claim.status !== 'approved') {
        return c.json({ error: "Claim must be approved by the owner first" }, 400);
    }

    // 4. Update Claim & Item
    await supabase.from("claims").update({ status: 'completed' }).eq("id", claimId);
    await supabase.from("items").update({ status: 'returned' }).eq("id", claim.item_id);

    // 5. Award Karma to Finder (item.user_id)
    const finderId = claim.items.user_id;

    // Fetch current points
    const { data: finder } = await supabase.from("users").select("reputation_points").eq("id", finderId).single();
    const newPoints = (finder?.reputation_points || 0) + 50; // Award 50 points

    await supabase.from("users").update({ reputation_points: newPoints }).eq("id", finderId);

    // 6. Log Reputation Event
    await supabase.from("reputation_events").insert({
        user_id: finderId,
        change_amount: 50,
        reason: `Item "${claim.items.title}" returned to owner`,
        event_type: "item_returned"
    });

    // 7. Notify Finder
    await supabase.from("notifications").insert({
        user_id: finderId,
        title: "Karma Awarded! (+50)",
        message: `The item "${claim.items.title}" was confirmed received by the owner. You earned 50 Karma points!`,
        type: "karma_earned",
        item_id: claim.item_id,
        claim_id: claimId
    });

    return c.json({ success: true, newPoints });
});

export default claims;
