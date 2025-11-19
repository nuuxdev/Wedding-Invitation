import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function WishesTab() {
    const wishList = useQuery(api.wish.findAll);

    if (wishList === undefined) return <div>Loading wishes...</div>;

    return (
        <div>
            <h2>Guest Wishes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {wishList && wishList.length > 0 ? (
                    wishList.map((wish) => (
                        <div key={wish._id} style={{ padding: "15px", borderRadius: "8px", border: "1px solid #eee", backgroundColor: "#f9f9f9" }}>
                            <p style={{ margin: "0 0 10px 0", fontStyle: "italic" }}>"{wish.message}"</p>
                            <div style={{ fontSize: "0.9rem", color: "#666", textAlign: "right" }}>- {wish.fullName}</div>
                        </div>
                    ))
                ) : (
                    <p>No wishes received yet.</p>
                )}
            </div>
        </div>
    );
}
