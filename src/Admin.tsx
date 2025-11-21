import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { HomeTab } from "./views/HomeTab";
import { GuestListTab } from "./views/GuestListTab";
import { AttendanceTab } from "./views/AttendanceTab";
import { WishesTab } from "./views/WishesTab";
import { ScannerSection } from "./views/ScannerSection";
import LanguageToggle from "./components/LanguageToggle";

export default function Admin() {
  return (
    <>
      <LanguageToggle />
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

function SignOutButton() {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  return (
    <>
      {isAuthenticated && (
        <button
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
    <div>
      <p>Log in to your account</p>
      <form
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
          type="email"
          name="email"
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
        />
        <button
          type="submit"
        >
          {flow === "signIn" ? "Sign in" : "Sign up"}
        </button>
        {error && (
          <div>
            <p>
              Error signing in: {error}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
