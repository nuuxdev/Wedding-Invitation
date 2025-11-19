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
        <div
            style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}
        >
            <h2>Scan QR Code</h2>
            {!scanResult ? (
                <QRScanner onScan={handleScan} />
            ) : (
                <div
                    style={{
                        marginTop: "10px",
                        padding: "10px",
                        border: "1px solid",
                        borderColor: scanResult.success ? "green" : "red",
                    }}
                >
                    {scanResult.success ? (
                        <>
                            <h3 style={{ color: "green" }}>Valid Guest!</h3>
                            <p>
                                <strong>Name:</strong> {scanResult.guest?.firstName}{" "}
                                {scanResult.guest?.lastName}
                            </p>
                            <p>
                                <strong>Phone:</strong> {scanResult.guest?.phoneNumber}
                            </p>
                            <p>
                                <strong>RSVP:</strong> {scanResult.attendance?.willAttend}
                            </p>
                            <button onClick={() => setScanResult(null)}>Scan Another</button>
                        </>
                    ) : scanResult.guest ? (
                        <>
                            <h3 style={{ color: "orange" }}>Guest Already Checked In!</h3>
                            <p>
                                <strong>Name:</strong> {scanResult.guest?.firstName}{" "}
                                {scanResult.guest?.lastName}
                            </p>
                            <p>
                                <strong>Phone:</strong> {scanResult.guest?.phoneNumber}
                            </p>
                            <p>
                                <strong>RSVP:</strong> {scanResult.attendance?.willAttend}
                            </p>
                            <p style={{ color: "red" }}>{scanResult.message}</p>
                            <button onClick={() => setScanResult(null)}>Scan Another</button>
                        </>
                    ) : (
                        <>
                            <h3 style={{ color: "red" }}>Invalid Guest!</h3>
                            <p>{scanResult.message}</p>
                            <button onClick={() => setScanResult(null)}>Try Again</button>
                        </>
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
