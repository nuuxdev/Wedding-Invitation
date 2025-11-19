import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useMutation,
  useQuery,
} from "convex/react";

import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useEffect, useState, useCallback, useRef } from "react";
import { Infer } from "convex/values";
import { TverifyGuestResponse, VwillAttend } from "../convex/attendance";
import { Doc } from "../convex/_generated/dataModel";
import { Html5Qrcode } from "html5-qrcode";

export default function Admin() {
  return (
    <>
      <Authenticated>
        <AdminApp />
      </Authenticated>
      <Unauthenticated>
        <div className="p-4">
          <header className="mb-4">
            <h1 className="text-2xl font-bold">Wedding Invitation Admin</h1>
          </header>
          <SignInForm />
        </div>
      </Unauthenticated>
    </>
  );
}

function AdminApp() {
  const [activeTab, setActiveTab] = useState<"home" | "guests" | "attendance" | "wishes">("home");
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
      <header style={{ padding: "15px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ margin: 0, fontSize: "1.2rem" }}>Admin Dashboard</h1>
        <SignOutButton />
      </header>

      <main style={{ flex: 1, overflowY: "auto", padding: "15px", paddingBottom: "80px" }}>
        {activeTab === "home" && <HomeTab />}
        {activeTab === "guests" && <GuestListTab />}
        {activeTab === "attendance" && <AttendanceTab />}
        {activeTab === "wishes" && <WishesTab />}
      </main>

      {/* Floating Action Button for Scanner */}
      <button
        onClick={() => setShowScanner(true)}
        style={{
          position: "fixed",
          bottom: "80px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          zIndex: 1000
        }}
      >
        <ScanIcon />
      </button>

      {/* Scanner Modal */}
      {showScanner && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}>
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "10px", width: "100%", maxWidth: "500px", position: "relative" }}>
            <button
              onClick={() => setShowScanner(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer"
              }}
            >
              ×
            </button>
            <ScannerSection />
          </div>
        </div>
      )}

      <nav style={{
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0",
        borderTop: "1px solid #eee",
        backgroundColor: "#fff",
        position: "sticky",
        bottom: 0,
        zIndex: 900
      }}>
        <NavButton
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
          icon={<HomeIcon />}
          label="Home"
        />
        <NavButton
          active={activeTab === "guests"}
          onClick={() => setActiveTab("guests")}
          icon={<UsersIcon />}
          label="Guests"
        />
        <NavButton
          active={activeTab === "attendance"}
          onClick={() => setActiveTab("attendance")}
          icon={<ListIcon />}
          label="Attendance"
        />
        <NavButton
          active={activeTab === "wishes"}
          onClick={() => setActiveTab("wishes")}
          icon={<HeartIcon />}
          label="Wishes"
        />
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "none",
        border: "none",
        color: active ? "#4CAF50" : "#888",
        cursor: "pointer",
        fontSize: "0.8rem"
      }}
    >
      <div style={{ marginBottom: "4px" }}>{icon}</div>
      {label}
    </button>
  );
}
// Icons
const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const ScanIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><path d="M3 14h7v7H3z"></path></svg>
);
const ListIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
);
const HeartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
);
const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

function HomeTab() {
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

function GuestListTab() {
  const guests = useQuery(api.guest.findAll);

  if (guests === undefined) return <div>Loading guests...</div>;

  const generateMessage = (guest: Doc<"guest">) => {
    const link = `${window.location.origin}/${guest._id}`;
    return `Hello ${guest.firstName}, you are invited to our wedding! Please RSVP using this link: ${link}\n\nInstructions: Fill out the form and save the QR code displayed. You will need to show this QR code at the entrance.`;
  };

  const handleCopy = (message: string) => {
    navigator.clipboard.writeText(message).then(() => {
      alert("Message copied to clipboard!");
    });
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
                <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{guest.firstName} {guest.lastName}</h3>
                <p style={{ margin: "0 0 10px 0", color: "#666" }}>{guest.phoneNumber}</p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <a
                    href={smsLink}
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "8px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "5px",
                      fontSize: "0.9rem"
                    }}
                  >
                    Send SMS
                  </a>
                  <button
                    onClick={() => handleCopy(message)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      backgroundColor: "#2196F3",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "0.9rem"
                    }}
                  >
                    Copy Msg
                  </button>
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

function AttendanceTab() {
  const attendanceList = useQuery(api.attendance.findAll);

  if (attendanceList === undefined) return <div>Loading list...</div>;

  const attendanceColors: Record<Infer<typeof VwillAttend>, string> = {
    yes: "#e6fffa", // light green bg
    no: "#fff5f5", // light red bg
    maybe: "#fffaf0", // light orange bg
  };

  const statusColors: Record<Infer<typeof VwillAttend>, string> = {
    yes: "green",
    no: "red",
    maybe: "orange",
  };

  return (
    <div>
      <h2>Attendance List</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {attendanceList && attendanceList.length > 0 ? (
          attendanceList.map((attendance) => (
            <div key={attendance._id} style={{
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #eee",
              backgroundColor: attendanceColors[attendance.willAttend],
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <h3 style={{ margin: "0 0 5px 0", fontSize: "1.1rem" }}>{attendance.fullName}</h3>
                <div style={{ fontSize: "0.8rem", color: "#666" }}>
                  Status: <span style={{ color: statusColors[attendance.willAttend], fontWeight: "bold" }}>{attendance.willAttend.toUpperCase()}</span>
                </div>
                {attendance.checkedIn && (
                  <div style={{ fontSize: "0.8rem", color: "green", marginTop: "5px" }}>✓ Checked In</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No attendance records found.</p>
        )}
      </div>
    </div>
  );
}

function WishesTab() {
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

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <button
          className="bg-slate-200 dark:bg-slate-800 text-dark dark:text-light rounded-md px-2 py-1"
          onClick={() => void signOut()}
          style={{ fontSize: "0.8rem" }}
        >
          Sign out
        </button>
      )}
    </>
  );
}

function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-8 w-96 mx-auto">
      <p>Log in to your account</p>
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            setError(error.message);
          });
        }}
      >
        <input
          className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
          type="email"
          name="email"
          placeholder="Email"
        />
        <input
          className="bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800"
          type="password"
          name="password"
          placeholder="Password"
        />
        <button
          className="bg-dark dark:bg-light text-light dark:text-dark rounded-md"
          type="submit"
        >
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        {error && (
          <div className="bg-red-500/20 border-2 border-red-500/50 rounded-md p-2">
            <p className="text-dark dark:text-light font-mono text-xs">
              Error signing in: {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

function ScannerSection() {
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
