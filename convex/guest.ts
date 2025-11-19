import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const findOne = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("guest", args.id);
    if (normalizedId === null) {
      return null;
    }
    const guest = await ctx.db.get(normalizedId);
    return guest;
  },
});

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("guest").collect();
  },
});

export const markInvited = mutation({
  args: {
    id: v.id("guest"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { invited: true });
  },
});
