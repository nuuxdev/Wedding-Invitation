import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Infer } from "convex/values";
import { VwillAttend } from "../../convex/attendance";

export function AttendanceTab() {
    const attendanceList = useQuery(api.attendance.findAll);

    if (attendanceList === undefined) return <div className="loading">Loading list...</div>;

    const willAttendColors: Record<Infer<typeof VwillAttend>, string> = {
        yes: "var(--color-crimson)",
        no: "var(--color-stone)",
        maybe: "var(--color-gold)",
    };

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {attendanceList && attendanceList.length > 0 ? (
                    attendanceList.map((attendance) => (
                        <div key={attendance._id} className="guest-card" style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <h3 style={{ margin: "0 0 5px 0", fontSize: "1.3rem", color: "var(--color-charcoal)", fontFamily: "var(--font-serif)" }}>{attendance.fullName}</h3>
                                <div style={{ fontSize: "0.8rem", color: "var(--color-stone)" }}>
                                    {attendance.plus > 0 && (
                                        <span style={{ color: "var(--color-charcoal)", fontWeight: "bold" }}>
                                            Plus: {attendance.plus}
                                        </span>
                                    )}
                                </div>
                                {attendance.checkedIn && (
                                    <div style={{ fontSize: "0.8rem", color: "var(--color-crimson)", marginTop: "5px" }}>✓ Checked In</div>
                                )}
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: "0.8rem", color: "var(--color-stone)" }}>Will Attend</div>
                                <span style={{ color: willAttendColors[attendance.willAttend], fontWeight: "bold" }}>{attendance.willAttend.toUpperCase()}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "var(--color-stone)" }}>No attendance records found.</p>
                )}
            </div>
        </div>
    );
}

