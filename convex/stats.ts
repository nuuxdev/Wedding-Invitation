import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { Infer } from "convex/values";
import { VwillAttend } from "./attendance";

//types

export type TstatsResponse = {
  guestCount: number;
  guestPlusCount: number;
  invitedGuestCount: number;
  invitedGuestPlusCount: number;
  attendanceCounts: Record<Infer<typeof VwillAttend>, number> & {
    total: number;
  };
  attendancePlusCounts: Record<Infer<typeof VwillAttend>, number> & {
    total: number;
  };
};

//guest stats

export const guestStats = query({
  args: {},
  handler: async (ctx): Promise<TstatsResponse | undefined> => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return;

    const guestMap = new Map<string, number>();
    let guestPlusCount = 0;
    const guests = await ctx.db.query("guest").collect();
    let invitedGuestCount = 0;
    let invitedGuestPlusCount = 0;

    guests.forEach((g) => {
      const plus = g.plus || 0;
      guestMap.set(g._id, plus);
      guestPlusCount += plus;
      if (g.invited) {
        invitedGuestCount++;
        invitedGuestPlusCount += plus;
      }
    });

    const guestCount = guests.length;
    const attendanceList = await ctx.db.query("attendance").collect();
    const attendanceCount = attendanceList.length;

    const initialVal: Record<Infer<typeof VwillAttend>, number> = {
      yes: 0,
      no: 0,
      maybe: 0,
    };

    const initialPlusVal: Record<Infer<typeof VwillAttend>, number> = {
      yes: 0,
      no: 0,
      maybe: 0,
    };

    let totalAttendancePluses = 0;

    const willAttendCounts = attendanceList.reduce((acc, attendance) => {
      acc[attendance.willAttend]++;
      return acc;
    }, { ...initialVal });

    const attendancePlusCounts = attendanceList.reduce((acc, attendance) => {
      const plus = guestMap.get(attendance.guestId) || 0;
      acc[attendance.willAttend] += plus;
      totalAttendancePluses += plus;
      return acc;
    }, { ...initialPlusVal });

    return {
      guestCount,
      guestPlusCount,
      invitedGuestCount,
      invitedGuestPlusCount,
      attendanceCounts: { ...willAttendCounts, total: attendanceCount },
      attendancePlusCounts: { ...attendancePlusCounts, total: totalAttendancePluses },
    };
  },
});
