import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Infer } from "convex/values";
import { VwillAttend } from "../../convex/attendance";
import { useState } from "react";

export function AttendanceTab() {
    const attendanceList = useQuery(api.attendance.findAll);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<"all" | "checked_in" | "not_checked_in">("all");

    if (attendanceList === undefined) return <div className="loading">Loading list...</div>;

    const list = attendanceList ?? [];
    const checkedInCount = list.filter(a => a.checkedIn).length;
    const notCheckedInCount = list.length - checkedInCount;

    const filteredList = list.filter((attendance) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = attendance.fullName.toLowerCase().includes(query) ||
            attendance.guestId.toLowerCase().includes(query);

        const matchesFilter = filter === "all" ||
            (filter === "checked_in" && attendance.checkedIn) ||
            (filter === "not_checked_in" && !attendance.checkedIn);

        return matchesSearch && matchesFilter;
    });

    const willAttendColors: Record<Infer<typeof VwillAttend>, string> = {
        yes: "var(--color-crimson)",
        no: "var(--color-stone)",
        maybe: "var(--color-gold)",
    };

    return (
        <div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <button
                    onClick={() => setFilter("all")}
                    style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: filter === "all" ? "var(--color-gold)" : "var(--color-surface)",
                        color: filter === "all" ? "white" : "var(--color-charcoal)",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.9rem"
                    }}
                >
                    All ({list.length})
                </button>
                <button
                    onClick={() => setFilter("checked_in")}
                    style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: filter === "checked_in" ? "var(--color-gold)" : "var(--color-surface)",
                        color: filter === "checked_in" ? "white" : "var(--color-charcoal)",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.9rem"
                    }}
                >
                    Checked In ({checkedInCount})
                </button>
                <button
                    onClick={() => setFilter("not_checked_in")}
                    style={{
                        flex: 1,
                        padding: "8px 10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: filter === "not_checked_in" ? "var(--color-gold)" : "var(--color-surface)",
                        color: filter === "not_checked_in" ? "white" : "var(--color-charcoal)",
                        cursor: "pointer",
                        fontWeight: "bold",
                        fontSize: "0.9rem"
                    }}
                >
                    Remaining ({notCheckedInCount})
                </button>
            </div>

            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "1px solid var(--color-stone)",
                        fontSize: "1rem",
                    }}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredList.length > 0 ? (
                    filteredList.map((attendance) => (
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

