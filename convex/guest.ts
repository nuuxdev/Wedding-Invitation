import { v } from "convex/values";
import { query } from "./_generated/server";

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
