import { createAccount } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const adminCreateUser = internalAction({
    args: {
        email: v.string(),
        password: v.string(),
        role: v.union(v.literal("admin"), v.literal("host")),
    },
    handler: async (ctx, args) => {
        // const authUserId = await getAuthUserId(ctx);
        // if (!authUserId) throw new ConvexError("Not authenticated");

        // const role = await ctx.runQuery(api.roles.getCurrentUserRole);
        // if (role !== "admin") {
        //     throw new ConvexError("Not authorized");
        // }

        const providerId = "password";
        const account = {
            id: args.email,       // account identifier
            secret: args.password // raw secret; Convex Auth will hash it
        };
        const profile = {
            email: args.email,
            role: args.role,
        };

        return await createAccount(ctx, {
            provider: providerId,
            account,
            profile,
            shouldLinkViaEmail: false,
            shouldLinkViaPhone: false,
        });
    },
});
