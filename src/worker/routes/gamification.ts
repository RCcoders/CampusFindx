import { Hono } from "hono";
import { Bindings, Variables, authMiddleware, getSupabase, syncUser } from "../utils";

const gamification = new Hono<{ Bindings: Bindings; Variables: Variables }>();

gamification.get("/leaderboard", async (c) => {
    const supabase = getSupabase(c);
    const { data: leaders } = await supabase
        .from("users")
        .select("id, name, email, role, reputation_points")
        .eq("is_banned", false)
        .order("reputation_points", { ascending: false })
        .limit(50);

    return c.json(leaders || []);
});

gamification.get("/rewards", async (c) => {
    const supabase = getSupabase(c);
    const { data: rewards } = await supabase
        .from("rewards")
        .select("*")
        .eq("active", true)
        .order("cost", { ascending: true });
    return c.json(rewards || []);
});

gamification.post("/rewards/redeem", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);
    const { rewardId } = await c.req.json<any>();

    const { data: reward } = await supabase.from("rewards").select("*").eq("id", rewardId).single();
    if (!reward) return c.json({ error: "Reward not found" }, 404);
    if (localUser.reputation_points < reward.cost) return c.json({ error: "Insufficient Karma" }, 400);

    // Fallback transaction if RPC not present or just works
    await supabase.rpc('redeem_reward_transaction', {
        p_user_id: localUser.id,
        p_reward_id: reward.id,
        p_cost: reward.cost
    });

    return c.json({ success: true });
});

export default gamification;
