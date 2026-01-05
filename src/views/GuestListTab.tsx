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

    const generateMessages = (guest: Doc<"guest">) => {
        const link = `${window.location.origin}/${guest._id}`;

        let fullName = `${guest.firstNameAm || guest.firstName} ${guest.lastNameAm || guest.lastName}`.trim();

        // Plus Logic
        let plusText = "";
        if (guest.plus === 1) {
            plusText = " ከነባለቤቶ";
        } else if (guest.plus && guest.plus > 1) {
            plusText = ` +${guest.plus}`;
        }

        const msg1 = `♡☆♡☆♡☆የሰርግ ጥሪ  ለ ${fullName}${plusText}♡☆♡☆♡☆

ልጆቻችን አቢይ ሰብስቤ እና ኤደን አንዱዓለም በዕለተ ቅዳሜ, ጥር 16 2018 ዓ.ም. 10 ሰዓት እንደ አምላክ ፈቃድ ጋብቻቸውን ስለሚፈፅሙ, በዕለቱ ተገኝተው የደስታችን ተካፋይ ይሆኑ ዘንድ በታላቅ አክብሮት ጋብዘንዎታል::`;

        const msg2 = `${link}

ከላይ የተያያዘውን ሊንክ በመንካት የሚመጣልዎ ዌብሳይት(ድህረ ገፅ) ላይ የሚገኘውን ፎርም በመሙላት መምጣትዎትን የሚያረጋግጥ መግቢያ "QR ኮድ" በጊዜ እንዲወስዱ በትህትና እናሳስባለን::`;

        return { msg1, msg2 };
    };

    const handleCopy = (message: string, guestId: string, label: string) => {
        navigator.clipboard.writeText(message).then(() => {
            alert(`${label} copied to clipboard!`);
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

    const invitedCount = guests.filter(g => g.invited).length;
    const notInvitedCount = guests.length - invitedCount;

    return (
        <div>
            <div style={{ display: "flex", gap: "10px" }}>
                <button
                    onClick={() => setFilter("all")}
                    style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: filter === "all" ? "var(--color-gold)" : "var(--color-surface)",
                        color: filter === "all" ? "white" : "var(--color-charcoal)",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    All ({guests.length})
                </button>
                <button
                    onClick={() => setFilter("invited")}
                    style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: filter === "invited" ? "var(--color-gold)" : "var(--color-surface)",
                        color: filter === "invited" ? "white" : "var(--color-charcoal)",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Invited ({invitedCount})
                </button>
                <button
                    onClick={() => setFilter("not_invited")}
                    style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: filter === "not_invited" ? "var(--color-gold)" : "var(--color-surface)",
                        color: filter === "not_invited" ? "white" : "var(--color-charcoal)",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Not Invited ({notInvitedCount})
                </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {filteredGuests.length > 0 ? (
                    filteredGuests.map((guest) => {
                        const { msg1, msg2 } = generateMessages(guest);
                        const smsLink1 = `sms:${guest.phoneNumber}?body=${encodeURIComponent(msg1)}`;
                        const smsLink2 = `sms:${guest.phoneNumber}?body=${encodeURIComponent(msg2)}`;

                        return (
                            <div key={guest._id} className="guest-card">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                    <div>
                                        <h3 style={{ margin: "0 0 5px 0", fontSize: "1.3rem", color: "var(--color-charcoal)", fontFamily: "var(--font-serif)" }}>{guest.firstNameAm || guest.firstName} {guest.lastNameAm || guest.lastName}</h3>
                                        <p style={{ margin: "0 0 10px 0", color: "var(--color-stone)" }}>{guest.phoneNumber}</p>
                                    </div>
                                    {guest.invited && (
                                        <span style={{ backgroundColor: "var(--color-surface)", color: "var(--color-crimson)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.8rem", border: "1px solid var(--color-crimson)" }}>
                                            Invited
                                        </span>
                                    )}
                                </div>

                                {canInvite && (
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                        {/* Row 1: Message 1 */}
                                        <a
                                            href={smsLink1}
                                            onClick={() => handleSmsClick(guest._id)}
                                            style={{
                                                textAlign: "center",
                                                padding: "8px",
                                                backgroundColor: "var(--color-crimson)",
                                                color: "white",
                                                textDecoration: "none",
                                                borderRadius: "5px",
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            SMS 1 (Invite)
                                        </a>
                                        <button
                                            onClick={() => handleCopy(msg1, guest._id, "Message 1")}
                                            style={{
                                                padding: "8px",
                                                backgroundColor: "var(--color-gold)",
                                                color: "var(--color-champagne)",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            Copy Msg 1
                                        </button>

                                        {/* Row 2: Message 2 */}
                                        <a
                                            href={smsLink2}
                                            onClick={() => handleSmsClick(guest._id)}
                                            style={{
                                                textAlign: "center",
                                                padding: "8px",
                                                backgroundColor: "var(--color-crimson-dark)",
                                                color: "white",
                                                textDecoration: "none",
                                                borderRadius: "5px",
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            SMS 2 (Link)
                                        </a>
                                        <button
                                            onClick={() => handleCopy(msg2, guest._id, "Message 2")}
                                            style={{
                                                padding: "8px",
                                                backgroundColor: "var(--color-gold-dim)",
                                                color: "var(--color-champagne)",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                                fontSize: "0.8rem"
                                            }}
                                        >
                                            Copy Msg 2
                                        </button>

                                        {interactingGuestId === guest._id && !guest.invited && (
                                            <button
                                                onClick={() => handleConfirmInvited(guest._id)}
                                                style={{
                                                    gridColumn: "1 / -1",
                                                    padding: "8px",
                                                    backgroundColor: "var(--color-surface)",
                                                    color: "var(--color-crimson)",
                                                    border: "1px solid var(--color-crimson)",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    fontSize: "0.9rem",
                                                    marginTop: "5px"
                                                }}
                                            >
                                                Mark as Sent
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

