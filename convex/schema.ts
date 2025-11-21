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
    invited: v.optional(v.boolean()),
    firstNameAm: v.optional(v.string()),
    lastNameAm: v.optional(v.string()),
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
  weddingInfo: defineTable({
    brideFirstName: v.string(),
    brideLastName: v.string(),
    groomFirstName: v.string(),
    groomLastName: v.string(),
    weddingDate: v.string(),
    weddingPlace: v.string(),
    weddingLocationLink: v.string(),
    brideInstagram: v.string(),
    groomInstagram: v.string(),
    // Amharic Fields
    brideFirstNameAm: v.optional(v.string()),
    brideLastNameAm: v.optional(v.string()),
    groomFirstNameAm: v.optional(v.string()),
    groomLastNameAm: v.optional(v.string()),
    weddingPlaceAm: v.optional(v.string()),
  }),
});
