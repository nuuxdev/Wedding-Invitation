import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function WishesTab() {
    const wishList = useQuery(api.wish.findAll);

    if (wishList === undefined) return <div className="loading">Loading wishes...</div>;

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {wishList && wishList.length > 0 ? (
                    wishList.map((wish) => (
                        <div key={wish._id} className="guest-card">
                            <p style={{ margin: "0 0 10px 0", fontStyle: "italic", color: "var(--color-charcoal)" }}>"{wish.message}"</p>
                            <div style={{ fontSize: "0.9rem", color: "var(--color-stone)", textAlign: "right" }}>- {wish.fullName}</div>
                        </div>
                    ))
                ) : (
                    <p style={{ color: "var(--color-stone)" }}>No wishes received yet.</p>
                )}
            </div>
        </div>
    );
}

