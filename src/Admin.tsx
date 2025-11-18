import {
  Authenticated,
  Unauthenticated,
  useConvexAuth,
  useQuery,
} from "convex/react";

import { api } from "../convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { Infer } from "convex/values";
import { VwillAttend } from "../convex/attendance";

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
  const attendanceList = useQuery(api.attendance.findAll);

  if (attendanceList === undefined) return <div>loading...</div>;

  const attendanceColors: Record<Infer<typeof VwillAttend>, string> = {
    yes: "green",
    no: "red",
    maybe: "yellow",
  };
  return (
    <div>
      <p>Welcome {"Admin"}!</p>
      <div>
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
