import { Infer, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { insertWish } from "./wish";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc } from "./_generated/dataModel";


//Types


export const VwillAttend = v.union(
  v.literal("yes"),
  v.literal("no"),
  v.literal("maybe"),
);

export type TwillAttend = Infer<typeof VwillAttend>;


export type TaddNewResponse = {
  success: boolean;
  message: string;
  verifyUrl: string;
};

export type TverifyGuestResponse = {
  success: boolean;
  message?: string;
  guest?: Doc<"guest">;
  attendance?: Doc<"attendance">;
};

//Find All

export const findAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;
    const attendanceList = await ctx.db.query("attendance").collect();

    const attendanceWithPlus = await Promise.all(
      attendanceList.map(async (attendance) => {
        const guest = await ctx.db.get(attendance.guestId);
        return {
          ...attendance,
          plus: guest?.plus || 0,
        };
      })
    );

    return attendanceWithPlus;
  },
});

//Add New

export const addNew = mutation({
  args: {
    guestId: v.id("guest"),
    fullName: v.string(),
    willAttend: VwillAttend,
    message: v.string(),
  },
  handler: async (ctx, args): Promise<TaddNewResponse> => {
    const attendanceExists = await ctx.db
      .query("attendance")
      .withIndex("by_guestId", (q) => q.eq("guestId", args.guestId))
      .unique();
    if (attendanceExists) {
      return {
        success: false,
        message: "attendance already filled",
        verifyUrl: "",
      };
    }

    await ctx.db.insert("attendance", {
      fullName: args.fullName,
      willAttend: args.willAttend,
      guestId: args.guestId,
      checkedIn: false,
    });
    await insertWish(ctx, {
      message: args.message,
      guestId: args.guestId,
      fullName: args.fullName,
    });

    const token = await generateSignedToken(args.guestId);

    const verifyUrl = `https://wedding-invitation-nine-sage.vercel.app/verify?token=${token}`;


    return {
      success: true,
      message: "attendance recorded successfully",
      verifyUrl,
    };
  },
});

//verify guest

export const verifyGuest = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args): Promise<TverifyGuestResponse> => {
    const { guestId, signature } = parseToken(args.token);
    const secret = process.env.QR_SECRET || "default_secret_key";
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const expectedSignature = await crypto.subtle.sign(
      "HMAC",
      key,
      enc.encode(guestId)
    );
    const expectedSignatureHex = Array.from(new Uint8Array(expectedSignature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (signature !== expectedSignatureHex) {
      return { success: false, message: "Invalid token signature" };
    }

    const normalizedGuestId = ctx.db.normalizeId("guest", guestId);
    if (!normalizedGuestId) {
      return { success: false, message: "Invalid guest ID" };
    }
    const guest = await ctx.db.get(normalizedGuestId);
    if (!guest) {
      return { success: false, message: "Guest not found" };
    }

    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_guestId", (q) => q.eq("guestId", guest._id))
      .unique();

    if (!attendance) {
      return { success: false, message: "No attendance record found" };
    }

    if (attendance.checkedIn) {
      return {
        success: false,
        message: "Guest already checked in!",
        guest,
        attendance,
      };
    }

    // Mark as checked in
    await ctx.db.patch(attendance._id, { checkedIn: true });
    const updatedAttendance = await ctx.db.get(attendance._id);

    return {
      success: true,
      guest,
      attendance: updatedAttendance ?? undefined,
    };
  },
});

// helper functions

//parse token

function parseToken(token: string) {
  const decoded = atob(token);
  const [guestId, signature] = decoded.split(".");
  return { guestId, signature };
}

// Get by Guest ID
export const getByGuestId = query({
  args: { guestId: v.id("guest") },
  handler: async (ctx, args) => {
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_guestId", (q) => q.eq("guestId", args.guestId))
      .unique();

    if (!attendance) return null;

    let qrCodeUrl = null;
    if (attendance.qrCodeStorageId) {
      qrCodeUrl = await ctx.storage.getUrl(attendance.qrCodeStorageId);
    }

    return { ...attendance, qrCodeUrl };
  },
});

// Generate Upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// Save QR Code
export const saveQrCode = mutation({
  args: {
    guestId: v.id("guest"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const attendance = await ctx.db
      .query("attendance")
      .withIndex("by_guestId", (q) => q.eq("guestId", args.guestId))
      .unique();

    if (!attendance) {
      throw new Error("Attendance record not found");
    }

    await ctx.db.patch(attendance._id, {
      qrCodeStorageId: args.storageId,
    });
  },
});

//qrcode

async function generateSignedToken(guestId: string) {
  const secret = process.env.QR_SECRET || "default_secret_key";
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    enc.encode(guestId)
  );
  const signatureHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return btoa(`${guestId}.${signatureHex}`);
}
