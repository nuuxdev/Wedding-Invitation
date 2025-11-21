import { query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const info = await ctx.db.query("weddingInfo").first();
        return info;
    },
});
