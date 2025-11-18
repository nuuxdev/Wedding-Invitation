import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { insertWish } from "./wish";

export const VwillAttend = v.union(
  v.literal("yes"),
  v.literal("no"),
  v.literal("maybe"),
);

export const addNew = mutation({
  args: {
    guestId: v.id("guest"),
    fullName: v.string(),
    willAttend: VwillAttend,
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const attendanceId = await ctx.db.insert("attendance", {
      fullName: args.fullName,
      willAttend: args.willAttend,
      guestId: args.guestId,
    });
    await insertWish(ctx, {
      message: args.message,
      guestId: args.guestId,
      fullName: args.fullName,
    });

    return attendanceId;
  },
});
