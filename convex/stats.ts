import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { Infer } from "convex/values";
import { VwillAttend } from "./attendance";

//types

export type TstatsResponse = {
  guestCount: number;
  attendanceCounts: Record<Infer<typeof VwillAttend>, number> & {
    total: number;
  };
};

//guest stats

export const guestStats = query({
  args: {},
  handler: async (ctx): Promise<TstatsResponse | undefined> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;

    const guestCount = (await ctx.db.query("guest").collect()).length;
    const attendanceList = await ctx.db.query("attendance").collect();
    const attendanceCount = attendanceList.length;
    const initialVal: Record<Infer<typeof VwillAttend>, number> = {
      yes: 0,
      no: 0,
      maybe: 0,
    };
    const willAttendCounts = attendanceList.reduce((acc, attendance) => {
      acc[attendance.willAttend]++;
      return acc;
    }, initialVal);

    return {
      guestCount,
      attendanceCounts: { ...willAttendCounts, total: attendanceCount },
    };
  },
});
