import { Hono } from "hono";
import { Bindings, Variables, authMiddleware, getSupabase, syncUser } from "../utils";

const notifications = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Get Notifications
notifications.get("/", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    // syncUser not strictly needed for just fetching notifications by auth id if policies allow, 
    // but good for consistency.
    const localUser = await syncUser(authUser, supabase);

    const { data: notifications, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", localUser.id)
        .order("created_at", { ascending: false })
        .limit(20);

    if (error) return c.json({ error: error.message }, 500);

    return c.json(notifications || []);
});

// Mark Notification Read
notifications.patch("/:id/read", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);
    const id = c.req.param("id");

    const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id)
        .eq("user_id", localUser.id);

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ success: true });
});

// DEBUG ENDPOINT
notifications.get("/debug", async (c) => {
    const supabase = getSupabase(c);
    const { data, error } = await supabase.from("notifications").select("*");
    if (error) return c.json({ error: error.message }, 500);
    return c.json(data);
});

export default notifications;
