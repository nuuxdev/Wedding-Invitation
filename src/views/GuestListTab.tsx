import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";

export function GuestListTab({ canInvite }: { canInvite: boolean }) {
    const guests = useQuery(api.guest.findAll);
    const markInvited = useMutation(api.guest.markInvited);
    const [interactingGuestId, setInteractingGuestId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "invited" | "not_invited">("all");

    if (guests === undefined) return <div className="loading">Loading guests...</div>;

    const filteredGuests = guests.filter((guest) => {
        if (filter === "invited") return guest.invited;
        if (filter === "not_invited") return !guest.invited;
        return true;
    });

    const generateMessage = (guest: Doc<"guest">) => {
        const link = `${window.location.origin}/${guest._id}`;
        return `Hello ${guest.firstName}, you are invited to our wedding! Please RSVP using this link: ${link}\n\nInstructions: Fill out the form and save the QR code displayed. You will need to show this QR code at the entrance.`;
    };

    const handleCopy = (message: string, guestId: string) => {
        navigator.clipboard.writeText(message).then(() => {
            alert("Message copied to clipboard!");
            setInteractingGuestId(guestId);
        });
    };

    const handleSmsClick = (guestId: string) => {
        setInteractingGuestId(guestId);
    };

    const handleConfirmInvited = async (guestId: string) => {
        // @ts-ignore
        await markInvited({ id: guestId });
        setInteractingGuestId(null);
    };

    return (
        <div>
            <div style={{ display: "flex", gap: "10px" }}>
                <button
                    onClick={() => setFilter("all")}
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: filter === "all" ? "var(--color-gold)" : "var(--color-surface)",
                        color: filter === "all" ? "white" : "var(--color-charcoal)",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("invited")}
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: filter === "invited" ? "var(--color-gold)" : "var(--color-surface)",
                        color: filter === "invited" ? "white" : "var(--color-charcoal)",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Invited
                </button>
                <button
                    onClick={() => setFilter("not_invited")}
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: filter === "not_invited" ? "var(--color-gold)" : "var(--color-surface)",
                        color: filter === "not_invited" ? "white" : "var(--color-charcoal)",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Not Invited
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredGuests.length > 0 ? (
                    filteredGuests.map((guest) => {
                        const message = generateMessage(guest);
                        const smsLink = `sms:${guest.phoneNumber}?body=${encodeURIComponent(message)}`;

                        return (
                            <div key={guest._id} className="guest-card">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h3 style={{ margin: "0 0 5px 0", fontSize: "1.3rem", color: "var(--color-charcoal)", fontFamily: "var(--font-serif)" }}>{guest.firstName} {guest.lastName}</h3>
                                        <p style={{ margin: "0 0 10px 0", color: "var(--color-stone)" }}>{guest.phoneNumber}</p>
                                    </div>
                                    {guest.invited && (
                                        <span style={{ backgroundColor: "var(--color-surface)", color: "var(--color-crimson)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem", border: "1px solid var(--color-crimson)" }}>
                                            Invited
                                        </span>
                                    )}
                                </div>

                                {canInvite && (
                                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                        <a
                                            href={smsLink}
                                            onClick={() => handleSmsClick(guest._id)}
                                            style={{
                                                flex: 1,
                                                textAlign: "center",
                                                padding: "8px",
                                                backgroundColor: "var(--color-crimson)",
                                                color: "white",
                                                textDecoration: "none",
                                                borderRadius: "5px",
                                                fontSize: "0.9rem",
                                                minWidth: "80px"
                                            }}
                                        >
                                            Send SMS
                                        </a>
                                        <button
                                            onClick={() => handleCopy(message, guest._id)}
                                            style={{
                                                flex: 1,
                                                padding: "8px",
                                                backgroundColor: "var(--color-gold)",
                                                color: "var(--color-champagne)",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                fontSize: "0.9rem",
                                                minWidth: "80px"
                                            }}
                                        >
                                            Copy Message
                                        </button>

                                        {interactingGuestId === guest._id && !guest.invited && (
                                            <button
                                                onClick={() => handleConfirmInvited(guest._id)}
                                                style={{
                                                    flex: "1 1 100%",
                                                    padding: "8px",
                                                    backgroundColor: "var(--color-gold-dim)",
                                                    color: "var(--color-champagne)",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    fontSize: "0.9rem",
                                                    marginTop: "5px"
                                                }}
                                            >
                                                Confirm Invitation Sent
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <p style={{ color: "var(--color-stone)" }}>No guests found.</p>
                )}
            </div>
        </div>
    );
}

