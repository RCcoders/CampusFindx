import { Hono } from "hono";
import { nanoid } from "nanoid";
import { Bindings, Variables, authMiddleware, getSupabase, syncUser } from "../utils";

const items = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Create found item
items.post("/found", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);

    if (localUser.is_banned) return c.json({ error: "Account restricted" }, 403);

    const { title, category, description, location, dateFound, imageUrl, itemCondition } = await c.req.json<any>();
    if (!title || !category || !description || !location || !dateFound) {
        return c.json({ error: "Missing fields" }, 400);
    }

    const uniqueItemId = `FOUND-${nanoid(10).toUpperCase()}`;

    const { data, error } = await supabase.from("items").insert({
        type: "found",
        user_id: localUser.id,
        title, category, description, location,
        date_found_or_lost: dateFound,
        image_url: imageUrl || null,
        status: "pending",
        item_condition: itemCondition || null,
        unique_item_id: uniqueItemId,
        is_deposited_with_authority: false
    }).select().single();

    if (error) return c.json({ error: error.message }, 500);

    return c.json({ success: true, itemId: data.id, uniqueItemId });
});

// Get all found items
items.get("/found", async (c) => {
    const supabase = getSupabase(c);
    const { data, error } = await supabase
        .from("items")
        .select("*, users:users!user_id(name, email)")
        .eq("type", "found")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching found items:", error);
        return c.json({ error: error.message }, 500);
    }

    const items = data.map((item: any) => ({
        ...item,
        reporter_name: item.users?.name,
        reporter_email: item.users?.email
    }));

    return c.json(items);
});

// Report lost item
items.post("/lost", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);

    if (localUser.is_banned) return c.json({ error: "Account restricted" }, 403);

    const { title, category, description, location, dateLost, privateProof, imageUrl, itemCondition, rewardAmount } = await c.req.json<any>();
    const uniqueItemId = `LOST-${nanoid(10).toUpperCase()}`;

    const { error } = await supabase.from("items").insert({
        type: "lost",
        user_id: localUser.id,
        title, category, description, location,
        date_found_or_lost: dateLost,
        status: "reported",
        unique_item_id: uniqueItemId,
        private_proof: privateProof,
        image_url: imageUrl || null,
        item_condition: itemCondition || null,
        reward_amount: rewardAmount || 0
    }).select().single();

    if (error) return c.json({ error: error.message }, 500);

    return c.json({ success: true, uniqueItemId });
});

// Get My Lost Items
items.get("/lost/mine", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);

    const { data } = await supabase
        .from("items")
        .select("*")
        .eq("user_id", localUser.id)
        .eq("type", "lost")
        .order("created_at", { ascending: false });

    return c.json(data || []);
});

// Get all lost items (Public)
items.get("/lost", async (c) => {
    const supabase = getSupabase(c);
    const { data } = await supabase
        .from("items")
        .select("id, type, title, category, description, location, date_found_or_lost, image_url, status, item_condition, unique_item_id, created_at")
        .eq("type", "lost")
        .order("created_at", { ascending: false });

    return c.json(data || []);
});

// Claim Item
items.post("/:id/claim", authMiddleware, async (c) => {
    const itemId = c.req.param("id");
    const user = c.get("user");
    const { proofDescription } = await c.req.json<any>();
    const authHeader = c.req.header("Authorization");

    if (!proofDescription) {
        return c.json({ error: "Proof description is required" }, 400);
    }

    // Create authenticated client for RLS
    // Note: we can reuse getSupabase(c) since it handles auth header if present
    // But original code manually created it. Let's use getSupabase(c) for consistency unless specific reason.
    // Original: const supabase = createClient(..., { global: { headers: { Authorization: authHeader! } } });
    // getSupabase(c) does exactly this.
    const supabase = getSupabase(c);

    try {
        // Check if item exists
        const { data: item, error: itemError } = await supabase
            .from("items")
            .select("*")
            .eq("id", itemId)
            .single();

        if (itemError || !item) {
            return c.json({ error: "Item not found" }, 404);
        }

        console.log("Worker: submitClaim - Found item:", item);


        if (item.status === "claimed" || item.status === "returned") {
            return c.json({ error: "Item is already claimed or returned" }, 400);
        }

        if (item.user_id === user.id) {
            return c.json({ error: "You cannot claim your own found item report" }, 400);
        }

        // Insert claim
        const { data: claim, error: claimError } = await supabase
            .from("claims")
            .insert({
                item_id: itemId,
                claimant_id: user.id,
                proof_description: proofDescription,
                status: "pending"
            })
            .select()
            .single();

        if (claimError) {
            console.error("Claim insert error:", claimError);
            return c.json({ error: "Failed to submit claim: " + claimError.message }, 500);
        }

        // Create notification
        console.log(`Worker: Creating notification for user ${item.user_id} about claim ${claim.id}`);
        const { error: notifyError } = await supabase
            .from("notifications")
            .insert({
                user_id: item.user_id,
                title: "New Claim Received",
                message: `Someone has claimed the item "${item.title}". Review their proof now.`,
                type: "claim_received",
                item_id: itemId,
                claim_id: claim.id
            });

        if (notifyError) {
            console.error("Worker: Notification insert error:", notifyError);
        } else {
            console.log("Worker: Notification created successfully");
        }

        return c.json({ success: true, claim });
    } catch (err) {
        console.error("Worker: submitClaim error:", err);
        return c.json({ error: "Internal server error" }, 500);
    }
});

// Check my claim status for an item
items.get("/:id/my-claim", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    // syncUser not needed for simple ID check

    const itemId = c.req.param("id");

    const { data: claim } = await supabase
        .from("claims")
        .select("*")
        .eq("item_id", itemId)
        .eq("claimant_id", authUser.id)
        .single();

    return c.json(claim || null);
});

// Get Claims for a specific item (Owner only)
items.get("/:id/claims", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);

    const itemId = c.req.param("id");

    // Check if item belongs to user
    const { data: item } = await supabase
        .from("items")
        .select("user_id")
        .eq("id", itemId)
        .single();

    if (!item) return c.json({ error: "Item not found" }, 404);
    if (item.user_id !== authUser.id) return c.json({ error: "Unauthorized" }, 403);

    const { data: claims } = await supabase
        .from("claims")
        .select("*, users:users!claimant_id(name, email, picture)")
        .eq("item_id", itemId)
        .order("created_at", { ascending: false });

    const formattedClaims = claims?.map((c: any) => ({
        ...c,
        claimant_name: c.users?.name,
        claimant_picture: c.users?.picture
    }));

    return c.json(formattedClaims || []);
});

// Get single item (Public with Auth check)
items.get("/:id", async (c) => {
    const id = c.req.param("id");
    const supabase = getSupabase(c);

    // Validate ID is numeric
    if (isNaN(Number(id))) {
        return c.json({ error: "Invalid ID format" }, 400);
    }

    const { data: item, error } = await supabase
        .from("items")
        .select("*, users:users!user_id(name, email)")
        .eq("id", id)
        .single();

    if (error || !item) return c.json({ error: "Item not found" }, 404);

    // Privacy Logic
    const authHeader = c.req.header("Authorization");
    let isAuthority = false;
    let isOwner = false;

    if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        const { data: { user } } = await supabase.auth.getUser(token);

        if (user) {
            const localUser = await syncUser(user, supabase);
            if (localUser) {
                if (localUser.role === "authority") isAuthority = true;
                if (localUser.id === item.user_id) isOwner = true;
            }
        }
    }

    if (!isAuthority && !isOwner) {
        delete item.private_proof;
    }

    return c.json({
        ...item,
        reporter_name: item.users?.name,
        reporter_email: item.users?.email
    });
});

export default items;
