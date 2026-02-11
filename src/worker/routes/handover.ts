import { Hono } from "hono";
import { Bindings, Variables, authMiddleware, getSupabase, syncUser } from "../utils";

const handover = new Hono<{ Bindings: Bindings; Variables: Variables }>();

handover.get("/:claimId", authMiddleware, async (c) => {
    const authUser = c.get("user");
    const supabase = getSupabase(c);
    const localUser = await syncUser(authUser, supabase);
    const claimId = c.req.param("claimId");

    const { data: claim } = await supabase
        .from("claims")
        .select("*, items(title, unique_item_id, image_url), users!claimant_id(name, email, id)")
        .eq("id", claimId)
        .single();

    if (!claim) return c.json({ error: "Claim not found" }, 404);

    if (localUser.role !== 'authority' && localUser.id !== claim.users.id) {
        return c.json({ error: "Unauthorized" }, 403);
    }

    return c.json({
        ...claim,
        item_title: claim.items.title,
        unique_item_id: claim.items.unique_item_id,
        item_image: claim.items.image_url,
        claimant_name: claim.users.name,
        claimant_email: claim.users.email,
        claimant_user_id: claim.users.id
    });
});

export default handover;
