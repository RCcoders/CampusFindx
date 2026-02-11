import { Context } from "hono";
import { createClient, User } from "@supabase/supabase-js";

export type Bindings = {
    GEMINI_API_KEY: string;
    R2_BUCKET: R2Bucket;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
};

export type Variables = {
    user: User;
};

export const getSupabase = (c: Context<{ Bindings: Bindings }>, useServiceRole = false) => {
    const key = useServiceRole ? c.env.SUPABASE_SERVICE_ROLE_KEY : c.env.SUPABASE_ANON_KEY;
    const options: any = {
        auth: {
            persistSession: false,
        },
    };

    // If we have an auth header and we are NOT using service role, pass it
    const authHeader = c.req.header("Authorization");
    if (authHeader && !useServiceRole) {
        options.global = {
            headers: { Authorization: authHeader }
        };
    }

    return createClient(c.env.SUPABASE_URL, key, options);
};

// Auth Middleware using Supabase
export const authMiddleware = async (c: Context<{ Bindings: Bindings; Variables: Variables }>, next: any) => {
    const authHeader = c.req.header("Authorization");
    console.log("Worker: authMiddleware - Auth Header:", authHeader ? "Present" : "Missing");

    if (!authHeader) {
        console.warn("Worker: authMiddleware - No Auth Header");
        return c.json({ error: "Unauthorized" }, 401);
    }

    const token = authHeader.replace(/^Bearer\s+/i, "").trim();
    console.log(`Worker: Token Check - Length: ${token.length}, Prefix: ${token.substring(0, 15)}...`);

    const supabase = getSupabase(c);

    if (!c.env.SUPABASE_URL || !c.env.SUPABASE_ANON_KEY) {
        console.error("Worker: authMiddleware - Missing Supabase Env Vars");
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error) {
        console.error("Worker: authMiddleware - getUser error:", error.message);
    }

    if (error || !user) {
        console.error("Worker: authMiddleware - Invalid Token or User:", error);
        return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("user", user);
    await next();
};

// Helper function to sync/get public user profile
export async function syncUser(authUser: User, supabase: any) {
    const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", authUser.email)
        .single();

    if (!existingUser) {
        const { data: newUser, error } = await supabase
            .from("users")
            .insert({
                id: authUser.id,
                email: authUser.email,
                name: authUser.user_metadata.full_name || authUser.email,
                role: "normal",
                reputation_points: 0,
                strike_count: 0,
                is_banned: false,
                picture: authUser.user_metadata.avatar_url
            })
            .select()
            .single();

        if (error) {
            console.error("Sync Error: Failed to create new user", error);
            return null;
        }
        return newUser;
    }
    return existingUser;
}
