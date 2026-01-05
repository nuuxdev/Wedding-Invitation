import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function HomeTab() {
    const guestStats = useQuery(api.stats.guestStats);

    if (guestStats === undefined) return <div className="loading">Loading stats...</div>;

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "20px" }}>
                <StatCard
                    label="Total Guests"
                    value={
                        <span>
                            {guestStats?.guestCount ?? 0}
                            {(guestStats?.guestPlusCount ?? 0) > 0 && (
                                <sup style={{ fontSize: "0.5em", marginLeft: "4px", color: "var(--color-gold)" }}>
                                    +{guestStats?.guestPlusCount}
                                </sup>
                            )}
                        </span>
                    }
                />
                <StatCard
                    label="Invited Guests"
                    value={
                        <span style={{ color: "var(--color-white)" }}>
                            {guestStats?.invitedGuestCount ?? 0}
                            {(guestStats?.invitedGuestPlusCount ?? 0) > 0 && (
                                <sup style={{ fontSize: "0.5em", marginLeft: "4px", color: "var(--color-gold)" }}>
                                    +{guestStats?.invitedGuestPlusCount}
                                </sup>
                            )}
                        </span>
                    }
                    color="var(--color-crimson)"
                />
                <StatCard
                    label="Total Responses"
                    value={
                        <span>
                            {guestStats?.attendanceCounts.total ?? 0}
                            {(guestStats?.attendancePlusCounts.total ?? 0) > 0 && (
                                <sup style={{ fontSize: "0.5em", marginLeft: "4px", color: "var(--color-gold)" }}>
                                    +{guestStats?.attendancePlusCounts.total}
                                </sup>
                            )}
                        </span>
                    }
                />
                <StatCard
                    label="Attending"
                    value={
                        <span>
                            {guestStats?.attendanceCounts.yes ?? 0}
                            {(guestStats?.attendancePlusCounts.yes ?? 0) > 0 && (
                                <sup style={{ fontSize: "0.5em", marginLeft: "4px", color: "var(--color-gold)" }}>
                                    +{guestStats?.attendancePlusCounts.yes}
                                </sup>
                            )}
                        </span>
                    }
                    color="var(--color-crimson)"
                />
                <StatCard
                    label="Not Attending"
                    value={
                        <span>
                            {guestStats?.attendanceCounts.no ?? 0}
                            {(guestStats?.attendancePlusCounts.no ?? 0) > 0 && (
                                <sup style={{ fontSize: "0.5em", marginLeft: "4px", color: "var(--color-gold)" }}>
                                    +{guestStats?.attendancePlusCounts.no}
                                </sup>
                            )}
                        </span>
                    }
                    color="var(--color-stone)"
                />
                <StatCard
                    label="Tentative"
                    value={
                        <span>
                            {guestStats?.attendanceCounts.maybe ?? 0}
                            {(guestStats?.attendancePlusCounts.maybe ?? 0) > 0 && (
                                <sup style={{ fontSize: "0.5em", marginLeft: "4px", color: "var(--color-gold)" }}>
                                    +{guestStats?.attendancePlusCounts.maybe}
                                </sup>
                            )}
                        </span>
                    }
                    color="var(--color-gold)"
                />
            </div>
        </div>
    );
}

function StatCard({ label, value, color = "var(--color-charcoal)" }: { label: string; value: number | React.ReactNode; color?: string }) {
    return (
        <div className="stat-card">
            <div className="stat-card-value" style={{ color }}>{value}</div>
            <div className="stat-card-label">{label}</div>
        </div>
    );
}

