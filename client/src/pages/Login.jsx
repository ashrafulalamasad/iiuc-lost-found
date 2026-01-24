import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

export default function Login() {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // If user is already authenticated (e.g. after mobile redirect sign-in),
  // navigate away from the login page
  useEffect(() => {
    if (currentUser) {
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location.state]);

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);

    try {
      const result = await login();
      // On production mobile, login() may return null (redirect flow).
      // The page will reload and onAuthStateChanged + useEffect handles navigation.
      if (!result) return;
      const from = location.state?.from || "/";
      navigate(from);
    } catch (error) {
      console.error("Failed to login", error);
      alert(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-24 px-4 overflow-hidden"
      style={{
        background:
          "radial-gradient(1100px 680px at 50% -10%, #22c55e 0%, transparent 62%), radial-gradient(820px 600px at 112% 108%, #10b981 0%, transparent 56%), linear-gradient(165deg, #14301f 0%, #173a26 52%, #123020 100%)",
      }}
    >
      {/* Floating ambient orbs */}
      <span className="pointer-events-none absolute w-72 h-72 -top-20 -left-16 rounded-full bg-emerald-500/12 blur-3xl animate-pulse" />
      <span className="pointer-events-none absolute w-96 h-96 -bottom-28 -right-20 rounded-full bg-teal-500/10 blur-3xl animate-pulse [animation-delay:-1.5s]" />
      <span className="pointer-events-none absolute w-56 h-56 top-1/2 left-[60%] rounded-full bg-lime-500/8 blur-3xl animate-pulse [animation-delay:-3s]" />

      <section className="relative z-10 w-full max-w-md md:max-w-xl">
        <div className="relative bg-green-900 backdrop-blur-xl border border-emerald-300/25 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.65)] rounded-3xl p-8 sm:p-10 md:p-12 text-center overflow-hidden">
          {/* Top accent line */}
          <span className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-400 via-lime-300 to-teal-400" />

          <div className="flex justify-center mb-6">
            <img
              src="/iiuc-logo.png"
              alt="IIUC"
              className="h-20 w-20 object-contain drop-shadow-[0_8px_24px_rgba(16,185,129,0.35)]"
            />
          </div>

          <h1
            className="text-3xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Welcome Back
          </h1>
          <p className="mb-10 text-white/60 text-sm sm:text-base">
            Sign in to report, claim and reunite lost items
          </p>

          <Button
            onClick={handleLogin}
            disabled={isLoggingIn}
            bgColor="bg-blue-800"
            hoverBgColor="bg-green-600"
            textColor="text-white"
            hoverTextColor="group-hover/btn:text-black"
            className="mx-auto w-full border-2 border-emerald-300/40 hover:border-emerald-200 cursor-pointer"
          >
            <span className="flex items-center justify-center gap-3 sm:gap-4 w-full">
              {isLoggingIn ? (
                <svg
                  className="animate-spin h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : (
                <img src="/google.png" alt="Google" className="w-6 h-6" />
              )}
              <span className="text-base sm:text-lg font-bold">
                {isLoggingIn ? "Signing in..." : "Continue with Google"}
              </span>
              {!isLoggingIn && <span className="text-xl">→</span>}
            </span>
          </Button>

          <div className="mt-10 mb-10 text-white/75 text-sm sm:text-base font-medium">
            Any Google account can be used to sign in — we recommend using your
            IIUC G-Suite mail (
            <span className="font-mono text-lime-300">@ugrad.iiuc.ac.bd</span>).
          </div>

          <div className="border-t border-white/10 pt-5 text-xs sm:text-sm text-white">
            By continuing, you agree to our
            <Link
              to="/terms"
              className="text-lime-300 hover:text-lime-200 underline-offset-2 hover:underline mx-1"
            >
              Terms of Service
            </Link>
            and
            <Link
              to="/privacy"
              className="text-lime-300 hover:text-lime-200 underline-offset-2 hover:underline mx-1"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </section>
    </main>
  );
}
