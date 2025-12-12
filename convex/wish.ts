import { v } from "convex/values";
import { mutation, MutationCtx, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const findAll = query({
  args: {
    count: v.optional(v.number()),
    seed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const wishList = await ctx.db.query("wish").collect();

    if (args.count) {
      // Seeded shuffle
      const seed = args.seed || Date.now();
      const random = (seed: number) => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };

      let currentSeed = seed;
      // Shuffle array
      for (let i = wishList.length - 1; i > 0; i--) {
        const j = Math.floor(random(currentSeed) * (i + 1));
        currentSeed++; // Increment seed for next random number
        [wishList[i], wishList[j]] = [wishList[j], wishList[i]];
      }
      return wishList.slice(0, args.count);
    }

    return wishList;
  },
});

export async function insertWish(
  ctx: MutationCtx,
  args: { message: string; guestId: Id<"guest">; fullName: string },
) {
  await ctx.db.insert("wish", {
    message: args.message,
    fullName: args.fullName,
    guestId: args.guestId,
  });
}

export const addWish = mutation({
  args: {
    message: v.string(),
    guestId: v.id("guest"),
    fullName: v.string(),
  },
  handler: async (ctx, args) => {
    const wishId = await insertWish(ctx, args);
    return wishId;
  },
});
