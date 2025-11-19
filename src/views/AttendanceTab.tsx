import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Infer } from "convex/values";
import { VwillAttend } from "../../convex/attendance";

export function AttendanceTab() {
    const attendanceList = useQuery(api.attendance.findAll);

    if (attendanceList === undefined) return <div>Loading list...</div>;

    const attendanceColors: Record<Infer<typeof VwillAttend>, string> = {
        yes: "#e6fffa", // light green bg
        no: "#fff5f5", // light red bg
        maybe: "#fffaf0", // light orange bg
    };

    const willAttendColors: Record<Infer<typeof VwillAttend>, string> = {
        yes: "green",
        no: "red",
        maybe: "orange",
    };

    return (
        <div>
            <h2>Attendance List</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {attendanceList && attendanceList.length > 0 ? (
                    attendanceList.map((attendance) => (
                        <div key={attendance._id} style={{
                            padding: "15px",
                            borderRadius: "8px",
                            border: "1px solid #eee",
                            backgroundColor: attendanceColors[attendance.willAttend],
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div>
                                <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{attendance.fullName}</h3>
                                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                                    Will Attend: <span style={{ color: willAttendColors[attendance.willAttend], fontWeight: "bold" }}>{attendance.willAttend.toUpperCase()}</span>
                                </div>
                                {attendance.checkedIn && (
                                    <div style={{ fontSize: "0.8rem", color: "green", marginTop: "5px" }}>✓ Checked In</div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No attendance records found.</p>
                )}
            </div>
        </div>
    );
}
