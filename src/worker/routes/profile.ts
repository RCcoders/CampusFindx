import { Hono } from "hono";
import { Bindings, Variables, authMiddleware, getSupabase, syncUser } from "../utils";

const profile = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Get current user
profile.get("/me", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);

    if (!localUser) return c.json({ error: "Failed to sync user" }, 500);

    return c.json({
        id: authUser.id,
        email: authUser.email,
        google_user_data: {
            name: authUser.user_metadata.full_name,
            picture: authUser.user_metadata.avatar_url,
        },
        ...localUser // Mix in the public profile data (role, reputation, etc)
    });
});

// Update user profile
profile.patch("/me", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);

    const {
        collegeId,
        rollNumber,
        department,
        block,
        phoneNumber,
        altEmail,
        altPhone,
        collegeIdImageUrl
    } = await c.req.json<any>();

    // Validation
    if (collegeId && !collegeId.endsWith("@cgc.edu.in")) {
        return c.json({ error: "College ID must end with @cgc.edu.in" }, 400);
    }

    const updates: any = {};
    if (collegeId) updates.college_id = collegeId;
    if (rollNumber) updates.college_roll_number = rollNumber;
    if (department) updates.department = department;
    if (block) updates.block = block;
    if (phoneNumber) updates.phone_number = phoneNumber;
    if (altEmail) updates.alternative_email = altEmail;
    if (altPhone) updates.alternative_phone = altPhone;
    if (collegeIdImageUrl) updates.college_id_image_url = collegeIdImageUrl;

    // Make sure we update updated_at
    updates.updated_at = new Date().toISOString();

    const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", localUser.id);

    if (error) return c.json({ error: error.message }, 500);

    return c.json({ message: "Profile updated successfully" });
});

// Get User Stats (Karma, Rank, etc)
profile.get("/me/stats", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);

    // Calculate Rank (simple count of users with more reputation)
    const { count, error: rankError } = await supabase
        .from("users")
        .select("id", { count: "exact", head: true })
        .gt("reputation_points", localUser.reputation_points);

    const rank = (count || 0) + 1;

    // Get Badges
    const { data: badges } = await supabase
        .from("user_badges")
        .select("*, badges:badge_id(*)")
        .eq("user_id", localUser.id);

    // Format badges flat
    const formattedBadges = badges?.map((ub: any) => ub.badges) || [];

    // Get recent reputation events
    const { data: recentEvents } = await supabase
        .from("reputation_events")
        .select("*")
        .eq("user_id", localUser.id)
        .order("created_at", { ascending: false })
        .limit(10);

    return c.json({
        user: { ...localUser, rank },
        badges: formattedBadges,
        recentEvents: recentEvents || []
    });
});

export default profile;
