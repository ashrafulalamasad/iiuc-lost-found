import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import { CheckCircle2, ShieldCheck } from "lucide-react";

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
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-3 pb-16 pt-28 sm:px-6">
      <span className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-green-100/70 blur-3xl" />
      <span className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-amber-50 blur-3xl" />

      <section className="relative z-10 mx-auto w-full max-w-6xl min-w-0">
        <div className="grid w-full min-w-0 grid-cols-1 overflow-clip rounded-3xl border-2 border-gray-900 bg-white lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative order-1 flex min-w-0 flex-col justify-between overflow-clip bg-green-50 p-6 sm:p-10 lg:order-1">
            <span className="absolute -right-20 -top-20 h-56 w-56 rounded-full border-[24px] border-green-100" />
            <span className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border-[28px] border-green-100/80" />
            <div className="relative z-10">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-green-700 bg-white shadow-sm sm:h-20 sm:w-20">
                <img src="/iiuc-logo.png" alt="IIUC" className="h-14 w-14 object-contain sm:h-16 sm:w-16" />
              </div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-amber-900">
                Welcome to the community
              </p>
              <h1 className="mb-4 break-words text-3xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                Find what&apos;s lost.
                <br />
                Return what&apos;s found.
              </h1>
              <p className="max-w-md text-sm font-medium leading-relaxed text-slate-600 sm:text-lg">
                Sign in to help reunite belongings with the people who are looking for them.
              </p>
            </div>
            <div className="relative z-10 mt-8 space-y-3 text-sm font-semibold text-slate-700 sm:text-base">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} />
                Report found items in seconds
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} />
                Connect through secure claims
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} />
                Help make campus more caring
              </div>
            </div>
          </div>

          <div className="order-2 min-w-0 p-6 text-center sm:p-10 lg:order-2 lg:p-12">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-green-200 bg-green-50 text-green-700">
              <ShieldCheck size={26} strokeWidth={2.5} />
            </div>
            <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Welcome back
            </h2>
            <p className="mx-auto mb-6 max-w-sm text-sm font-medium leading-relaxed text-gray-600 sm:text-base">
              Sign in to report, claim, and reunite lost items.
            </p>

            <Button
              onClick={handleLogin}
              disabled={isLoggingIn}
              bgColor="bg-black"
              hoverBgColor="bg-green-600"
              textColor="text-white"
              hoverTextColor="group-hover/btn:text-black"
              className="mx-auto w-full cursor-pointer rounded-xl border-2 border-gray-900 shadow-md hover:border-gray-900"
            >
              <span className="flex w-full items-center justify-center gap-3 sm:gap-4">
                {isLoggingIn ? (
                  <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <img src="/google.png" alt="Google" className="h-6 w-6" />
                )}
                <span className="min-w-0 text-base font-extrabold sm:text-lg">
                  {isLoggingIn ? "Signing in..." : "Continue with Google"}
                </span>
                {!isLoggingIn && <span className="text-xl">→</span>}
              </span>
            </Button>

            <div className="mx-auto mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-left text-sm font-medium leading-relaxed text-gray-700 sm:text-base">
              Any Google account can be used to sign in. We recommend using your IIUC G-Suite mail (
              <span className="font-mono font-bold text-green-700">@ugrad.iiuc.ac.bd</span>).
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4 text-xs font-medium text-gray-500 sm:text-sm">
              By continuing, you agree to our
              <Link to="/terms" className="mx-1 font-bold text-green-700 underline-offset-2 hover:underline">
                Terms of Service
              </Link>
              and
              <Link to="/privacy" className="mx-1 font-bold text-green-700 underline-offset-2 hover:underline">
                Privacy Policy
              </Link>
              .
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
