import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useQuery,
} from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { HomeTab } from "./views/HomeTab";
import { GuestListTab } from "./views/GuestListTab";
import { AttendanceTab } from "./views/AttendanceTab";
import { WishesTab } from "./views/WishesTab";
import { ScannerSection } from "./views/ScannerSection";
import { api } from "../convex/_generated/api";

export default function Admin() {
  return (
    <>
      <Authenticated>
        <AdminApp />
      </Authenticated>
      <Unauthenticated>
        <div className="admin-login">
          <header className="admin-login-header">
            <h1>Wedding Invitation</h1>
            <h2>Admin</h2>
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
  const userRole = useQuery(api.roles.getCurrentUserRole);

  // Loading state for role
  if (userRole === undefined) {
    return <div className="loading">Loading...</div>;
  }

  const isAdmin = userRole === "admin";

  const getTitle = () => {
    switch (activeTab) {
      case "home": return "Guest Statistics";
      case "guests": return "Guest List";
      case "attendance": return "Attendance List";
      case "wishes": return "Guest Wishes";
      default: return "Admin Dashboard";
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title" style={{ fontSize: '1.5rem' }}>{getTitle()}</h1>
        <SignOutButton />
      </header>

      <main className="admin-main">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "guests" && <GuestListTab canInvite={isAdmin} />}
        {activeTab === "attendance" && <AttendanceTab />}
        {activeTab === "wishes" && <WishesTab />}
      </main>

      {/* Floating Action Button for Scanner - Admin only */}
      {isAdmin && (
        <button
          onClick={() => setShowScanner(true)}
          className="scanner-fab"
        >
          <ScanIcon />
        </button>
      )}

      {/* Scanner Modal */}
      {showScanner && (
        <div className="scanner-modal-overlay">
          <div className="scanner-modal">
            <button
              onClick={() => setShowScanner(false)}
              className="scanner-modal-close"
            >
              ×
            </button>
            <ScannerSection />
          </div>
        </div>
      )}

      <nav className="admin-nav">
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
      className={`admin-nav-button ${active ? "active" : ""}`}
    >
      <div className="admin-nav-icon">{icon}</div>
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
          className="button-outline"
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
    <form
      className="admin-login-form"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        formData.set("flow", flow);
        void signIn("password", formData).catch((error) => {
          setError(error.message);
        });
      }}
    >
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
        />
      </div>
      <button type="submit">
        {flow === "signIn" ? "Sign in" : "Sign up"}
      </button>
      {error && (
        <div className="error-message">
          <p>Error signing in: {error}</p>
        </div>
      )}
    </form>
  );
}

