import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";
import { VwillAttend } from "./attendance";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  guest: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    phoneNumber: v.string(),
  }),
  wish: defineTable({
    message: v.string(),
    fullName: v.string(),
    guestId: v.id("guest"),
  }),
  attendance: defineTable({
    fullName: v.string(),
    guestId: v.id("guest"),
    willAttend: VwillAttend,
    checkedIn: v.optional(v.boolean()),
  })
    .index("by_guestId", ["guestId"])
    .index("by_willAttend", ["willAttend"]),
});
