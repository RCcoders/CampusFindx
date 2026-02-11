import z from "zod";
import type { MochaUser } from "@getmocha/users-service/shared";

/**
 * Types shared between the client and server go here.
 */

export type UserRole = "normal" | "assisted" | "authority";

export interface ExtendedUser extends MochaUser {
  role: UserRole;
  reputation_points: number;
  strike_count: number;
  is_banned: number;
  local_user_id: number;
}

export const ItemSchema = z.object({
  id: z.number(),
  type: z.enum(["found", "lost"]),
  user_id: z.number(),
  title: z.string(),
  category: z.string(),
  description: z.string(),
  location: z.string(),
  date_found_or_lost: z.string(),
  image_url: z.string().optional(),
  status: z.enum(["pending", "claimed", "verified", "returned"]),
  reward_amount: z.number().default(0),
  private_proof: z.string().optional(),
  item_condition: z.string().optional(),
  unique_item_id: z.string().optional(),
  is_deposited_with_authority: z.number(),
  claimed_count: z.number().default(0),
});

export type Item = z.infer<typeof ItemSchema>;
