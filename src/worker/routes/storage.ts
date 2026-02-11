import { Hono } from "hono";
import { nanoid } from "nanoid";
import { Bindings, Variables, authMiddleware } from "../utils";

const storage = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Upload image to R2
storage.post("/upload/image", authMiddleware, async (c) => {
    // authUser check handled by middleware, not strictly needed for logic here
    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file || !file.type.startsWith("image/")) {
        return c.json({ error: "Invalid file" }, 400);
    }

    const fileExt = file.name.split(".").pop();
    const uniqueId = nanoid();
    const filename = `items/${uniqueId}.${fileExt}`;

    if (!c.env.R2_BUCKET) {
        console.error("R2_BUCKET binding missing");
        return c.json({ error: "Server configuration error: R2_BUCKET missing" }, 500);
    }

    try {
        await c.env.R2_BUCKET.put(filename, file.stream(), {
            httpMetadata: { contentType: file.type },
        });
    } catch (err: any) {
        console.error("R2 Upload Error:", err);
        return c.json({ error: `R2 Upload Failed: ${err.message}` }, 500);
    }

    return c.json({ filename, url: `/api/files/${filename}` });
});

storage.get("/files/:path{.+}", async (c) => {
    const path = c.req.param("path");
    const object = await c.env.R2_BUCKET.get(path);
    if (!object) return c.json({ error: "File not found" }, 404);

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    return c.body(object.body, { headers });
});

export default storage;
