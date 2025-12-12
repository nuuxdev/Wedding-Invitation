import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const info = await ctx.db.query("weddingInfo").first();
        return info;
    },
});

export const update = mutation({
    args: {
        weddingDate: v.string(),
    },
    handler: async (ctx, args) => {
        const info = await ctx.db.query("weddingInfo").first();
        if (info) {
            await ctx.db.patch(info._id, { weddingDate: args.weddingDate });
        }
    },
});
