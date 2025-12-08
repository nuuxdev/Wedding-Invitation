import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function HomeTab() {
    const guestStats = useQuery(api.stats.guestStats);

    if (guestStats === undefined) return <div className="loading">Loading stats...</div>;

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
                <StatCard label="Total Guests" value={guestStats?.guestCount ?? 0} />
                <StatCard label="Total Responses" value={guestStats?.attendanceCounts.total ?? 0} />
                <StatCard label="Attending" value={guestStats?.attendanceCounts.yes ?? 0} color="var(--color-crimson)" />
                <StatCard label="Not Attending" value={guestStats?.attendanceCounts.no ?? 0} color="var(--color-stone)" />
                <StatCard label="Tentative" value={guestStats?.attendanceCounts.maybe ?? 0} color="var(--color-gold)" />
            </div>
        </div>
    );
}

function StatCard({ label, value, color = "var(--color-charcoal)" }: { label: string; value: number; color?: string }) {
    return (
        <div className="stat-card">
            <div className="stat-card-value" style={{ color }}>{value}</div>
            <div className="stat-card-label">{label}</div>
        </div>
    );
}

