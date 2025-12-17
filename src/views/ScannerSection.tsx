import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useCallback, useRef, useEffect } from "react";
import { TverifyGuestResponse } from "../../convex/attendance";
import { Html5Qrcode } from "html5-qrcode";

export function ScannerSection() {
    //calls
    const verifyGuest = useMutation(api.attendance.verifyGuest);

    //states
    const [scanResult, setScanResult] = useState<TverifyGuestResponse | null>(null);

    //hooks

    const handleScan = useCallback(async (decodedText: string) => {
        try {
            let token = decodedText;
            if (decodedText.includes("verify?token=")) {
                token = decodedText.split("verify?token=")[1];
            }

            const result = await verifyGuest({ token });
            setScanResult(result);
        } catch (error) {
            console.error("Verification failed:", error);
            setScanResult({ success: false, message: "Verification failed" });
        }
    }, [verifyGuest]);

    return (
        <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)', color: 'var(--color-gold)' }}>Scan QR Code</h2>
            {!scanResult ? (
                <QRScanner onScan={handleScan} />
            ) : (
                <div
                    className="guest-card"
                    style={{
                        marginTop: "20px",
                        padding: "30px",
                        borderRadius: "16px",
                        textAlign: "center",
                    }}
                >
                    {scanResult.success ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                            <div style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "var(--color-crimson)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "10px"
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>

                            <h3 style={{
                                color: "var(--color-crimson)",
                                fontSize: "2rem",
                                margin: 0,
                                fontFamily: "var(--font-serif)"
                            }}>Valid Guest!</h3>

                            <div style={{ margin: "10px 0" }}>
                                <h3 style={{
                                    color: "var(--color-charcoal)",
                                    fontSize: "2rem",
                                }}>
                                    {scanResult.guest?.firstName} {scanResult.guest?.lastName}
                                </h3>
                                <p style={{ color: "var(--color-stone)", margin: 0 }}>
                                    {scanResult.guest?.phoneNumber}
                                </p>
                            </div>

                            <div style={{
                                display: "flex",
                                gap: "10px",
                                justifyContent: "center",
                                flexWrap: "wrap"
                            }}>
                                <div style={{
                                    padding: "8px 16px",
                                    backgroundColor: "var(--color-surface)",
                                    borderRadius: "20px",
                                    border: "1px solid var(--color-gold)",
                                    color: "var(--color-charcoal)"
                                }}>
                                    RSVP: <strong>{scanResult.attendance?.willAttend.toUpperCase()}</strong>
                                </div>
                                {(scanResult.guest?.plus ?? 0) > 0 && (
                                    <div style={{
                                        padding: "8px 16px",
                                        backgroundColor: "var(--color-gold)",
                                        borderRadius: "20px",
                                        color: "white",
                                        fontWeight: "bold"
                                    }}>
                                        Plus: +{scanResult.guest?.plus}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setScanResult(null)}
                                style={{
                                    padding: "0.5rem 1rem",
                                    marginTop: "1.5rem"
                                }}
                            >
                                Scan Another
                            </button>
                        </div>
                    ) : scanResult.guest ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                            <div style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "var(--color-gold)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "10px"
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            </div>

                            <h3 style={{ color: "var(--color-gold)", fontSize: "1.5rem", margin: 0 }}>Already Checked In</h3>

                            <div style={{ margin: "10px 0" }}>
                                <h3 style={{
                                    color: "var(--color-charcoal)",
                                    fontSize: "2rem",
                                }}>{scanResult.guest?.firstName} {scanResult.guest?.lastName}</h3>
                                <p style={{ color: "var(--color-stone)", margin: 0 }}>
                                    {scanResult.guest?.phoneNumber}
                                </p>
                            </div>

                            <p style={{ color: "var(--color-stone)" }}>{scanResult.message}</p>

                            <button
                                onClick={() => setScanResult(null)}
                            >
                                Scan Another
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "15px" }}>
                            <div style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "50%",
                                backgroundColor: "var(--color-stone)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "10px"
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                            </div>

                            <h3 style={{ color: "var(--color-stone)", fontSize: "1.5rem", margin: 0 }}>Invalid Guest</h3>
                            <p style={{ color: "var(--color-charcoal)" }}>{scanResult.message}</p>

                            <button
                                onClick={() => setScanResult(null)}
                                style={{
                                    marginTop: "20px",
                                    padding: "12px 30px",
                                    backgroundColor: "var(--color-charcoal)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "25px",
                                    fontSize: "1rem",
                                    cursor: "pointer",
                                    width: "100%"
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function QRScanner({ onScan }: { onScan: (text: string) => void }) {
    const [scannerId] = useState(
        `reader-${Math.random().toString(36).substring(2, 9)}`
    );
    const [isScanning, setIsScanning] = useState(false);
    const scannerRef = useRef<Html5Qrcode | null>(null);

    useEffect(() => {
        // Cleanup function to stop scanning when component unmounts
        return () => {
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current
                    .stop()
                    .then(() => {
                        scannerRef.current?.clear();
                    })
                    .catch((err: any) => console.error("Failed to stop scanner", err));
            }
        };
    }, []);

    const startScanning = async () => {
        if (scannerRef.current?.isScanning) return;

        const html5QrCode = new Html5Qrcode(scannerId);
        scannerRef.current = html5QrCode;

        try {
            await html5QrCode.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    onScan(decodedText);
                    // Stop scanning after successful scan
                    html5QrCode
                        .stop()
                        .then(() => {
                            html5QrCode.clear();
                            setIsScanning(false);
                        })
                        .catch((err: any) => console.error("Failed to stop scanner", err));
                },
                (_errorMessage) => {
                    // parse error, ignore it.
                }
            );
            setIsScanning(true);
        } catch (err) {
            console.error("Error starting scanner", err);
            setIsScanning(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const imageFile = e.target.files[0];
            const html5QrCode = new Html5Qrcode(scannerId);
            html5QrCode
                .scanFile(imageFile, true)
                .then((decodedText) => {
                    onScan(decodedText);
                })
                .catch((err) => {
                    console.error("Error scanning file", err);
                    alert("Failed to scan file. Please try again.");
                });
        }
    };

    return (
        <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
            <div id={scannerId}></div>
            {!isScanning && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
                    <button onClick={startScanning} style={{ padding: "10px" }}>
                        Start Camera Scan
                    </button>
                    <div style={{ textAlign: "center" }}>OR</div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ padding: "10px" }}
                    />
                </div>
            )}
            {isScanning && (
                <button
                    onClick={() => {
                        scannerRef.current
                            ?.stop()
                            .then(() => {
                                scannerRef.current?.clear();
                                setIsScanning(false);
                            })
                            .catch(console.error);
                    }}
                    style={{ marginTop: "10px", padding: "10px", width: "100%" }}
                >
                    Stop Scanning
                </button>
            )}
        </div>
    );
}
