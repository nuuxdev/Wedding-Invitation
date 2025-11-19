import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { Doc } from "../../convex/_generated/dataModel";

export function GuestListTab() {
    const guests = useQuery(api.guest.findAll);
    const markInvited = useMutation(api.guest.markInvited);
    const [interactingGuestId, setInteractingGuestId] = useState<string | null>(null);

    if (guests === undefined) return <div>Loading guests...</div>;

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
            <h2>Guest List</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {guests && guests.length > 0 ? (
                    guests.map((guest) => {
                        const message = generateMessage(guest);
                        const smsLink = `sms:${guest.phoneNumber}?body=${encodeURIComponent(message)}`;

                        return (
                            <div key={guest._id} style={{ padding: "15px", borderRadius: "8px", border: "1px solid #eee", backgroundColor: "#f9f9f9" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{guest.firstName} {guest.lastName}</h3>
                                        <p style={{ margin: "0 0 10px 0", color: "#666" }}>{guest.phoneNumber}</p>
                                    </div>
                                    {guest.invited && (
                                        <span style={{ backgroundColor: "#e6fffa", color: "green", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem", border: "1px solid green" }}>
                                            Invited
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    <a
                                        href={smsLink}
                                        onClick={() => handleSmsClick(guest._id)}
                                        style={{
                                            flex: 1,
                                            textAlign: "center",
                                            padding: "8px",
                                            backgroundColor: "#4CAF50",
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
                                            backgroundColor: "#2196F3",
                                            color: "white",
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
                                                backgroundColor: "#FF9800",
                                                color: "white",
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
                            </div>
                        );
                    })
                ) : (
                    <p>No guests found.</p>
                )}
            </div>
        </div>
    );
}
