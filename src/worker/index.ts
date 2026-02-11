import { Hono } from "hono";
import { Bindings, Variables } from "./utils";
import profile from "./routes/profile";
import items from "./routes/items";
import claims from "./routes/claims";
import notifications from "./routes/notifications";
import gamification from "./routes/gamification";
import storage from "./routes/storage";
import handover from "./routes/handover";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Mount routes
app.route("/api/users", profile);
app.route("/api/items", items);
app.route("/api/claims", claims);
app.route("/api/notifications", notifications);
app.route("/api/handover", handover);

// Mixed bag routes mounted at /api base
app.route("/api", gamification);
app.route("/api", storage);

// Health check
app.get("/", (c) => c.text("Campus Finder Worker is Running!"));

export default app;
