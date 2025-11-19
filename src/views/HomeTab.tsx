import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function HomeTab() {
    const guestStats = useQuery(api.stats.guestStats);

    if (guestStats === undefined) return <div>Loading stats...</div>;

    return (
        <div>
            <h2>Guest Statistics</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
                <StatCard label="Total Guests" value={guestStats?.guestCount ?? 0} />
                <StatCard label="Total Responses" value={guestStats?.attendanceCounts.total ?? 0} />
                <StatCard label="Attending" value={guestStats?.attendanceCounts.yes ?? 0} color="green" />
                <StatCard label="Not Attending" value={guestStats?.attendanceCounts.no ?? 0} color="red" />
                <StatCard label="Tentative" value={guestStats?.attendanceCounts.maybe ?? 0} color="orange" />
            </div>
        </div>
    );
}

function StatCard({ label, value, color = "#333" }: { label: string; value: number; color?: string }) {
    return (
        <div style={{ padding: "15px", borderRadius: "8px", border: "1px solid #eee", textAlign: "center", backgroundColor: "#f9f9f9" }}>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color }}>{value}</div>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>{label}</div>
        </div>
    );
}
