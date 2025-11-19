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
import { Html5Qrcode } from "html5-qrcode";

export default function Admin() {
  return (
    <>
      <header>
        Admin
        <SignOutButton />
      </header>
      <main>
        <h1>Wedding Invitation</h1>
        <Authenticated>
          <Content />
        </Authenticated>
        <Unauthenticated>
          <SignInForm />
        </Unauthenticated>
      </main>
    </>
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
        {/* <div className="flex flex-row gap-2">
          <span>
            {flow === "signIn"
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>
          <span
            className="text-dark dark:text-light underline hover:no-underline cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </span>
        </div> */}
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

function Content() {

  //calls

  const guestStats = useQuery(api.stats.guestStats);
  const attendanceList = useQuery(api.attendance.findAll);

  //vars

  const attendanceColors: Record<Infer<typeof VwillAttend>, string> = {
    yes: "green",
    no: "red",
    maybe: "yellow",
  };

  //render

  if (attendanceList === undefined || guestStats === undefined)
    return <div>loading...</div>;

  return (
    <div>
      <p>Welcome {"Admin"}!</p>
      <ScannerSection />
      <div>
        <h2>Guest Stats</h2>
        <div>
          {<h4>total guests:{guestStats?.guestCount ?? 0}</h4>}
          {<h4>total attendees:{guestStats?.attendanceCounts.total ?? 0}</h4>}
          {<h4>coming:{guestStats?.attendanceCounts.yes ?? 0}</h4>}
          {<h4>not coming:{guestStats?.attendanceCounts.no ?? 0}</h4>}
          {<h4>may be coming:{guestStats?.attendanceCounts.maybe ?? 0}</h4>}
        </div>
        <h2>Attendance List</h2>
        <div>
          {attendanceList ? (
            attendanceList.map((attendance) => (
              <div key={attendance._id}>
                <h3>{attendance.fullName}</h3>
                <h6>{attendance._id}</h6>
                <div
                  style={{
                    backgroundColor: attendanceColors[attendance.willAttend],
                  }}
                >
                  {attendance.willAttend}
                </div>
              </div>
            ))
          ) : (
            <p>No guest found in the attendance list</p>
          )}
        </div>
      </div>
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
