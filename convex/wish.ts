import { v } from "convex/values";
import { mutation, MutationCtx, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const findAll = query({
  args: {},
  handler(ctx) {
    const wishList = ctx.db.query("wish").collect();
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
