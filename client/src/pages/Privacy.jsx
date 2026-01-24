import { ShieldCheck } from "lucide-react";
import BackButton from "../components/BackButton";

const policies = [
  {
    title: "Data Collection",
    body: "We only collect your Name, Student Email, and Phone Number to facilitate item returns.",
  },
  {
    title: "Visibility",
    body: "Your contact details are only shared with the person you are communicating with regarding an item.",
  },
  {
    title: "No Sharing",
    body: "We do not sell or share your data with any third parties.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies to keep you logged in.",
  },
  {
    title: "Image Privacy",
    body: "When uploading photos of sensitive documents (IDs, Credit Cards), please blur confidential numbers to prevent misuse.",
  },
  {
    title: "Activity Logs",
    body: "We record timestamps and IP addresses of posts to ensure account security and prevent spam.",
  },
  {
    title: "Data Retention",
    body: 'Information regarding "Solved" cases is automatically archived or deleted after a specific period to ensure database efficiency.',
  },
  {
    title: "Google Auth",
    body: "Since we use Google Login (Edu Mail), your password is never stored on our servers; authentication is handled securely by Google.",
  },
];

export default function Privacy() {
  return (
    <div
      className="pt-28 pb-12 min-h-screen"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />

        {/* Hero */}
        <div className="relative bg-linear-to-br from-green-600 via-emerald-700 to-green-800 rounded-2xl shadow-2xl px-6 py-10 sm:px-12 sm:py-14 mb-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-5 bg-white/15 rounded-2xl flex items-center justify-center text-white">
              <ShieldCheck size={34} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-lg sm:text-xl text-white leading-relaxed max-w-3xl mx-auto">
              Your privacy is important to us. Here's exactly what we collect
              and how we handle it.
            </p>
          </div>
        </div>

        {/* Policies list */}
        <div className="space-y-4">
          {policies.map((policy, idx) => (
            <div
              key={idx}
              className="bg-gray-200 rounded-xl border-3 border-black px-5 sm:px-7 py-5 hover:border-green-600 hover:bg-gray-300 transition-all"
            >
              <h3 className="font-bold text-black text-xl mb-2 flex items-center gap-3">
                <span className="w-8 h-8 shrink-0 bg-linear-to-br from-green-500 to-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">
                  {idx + 1}
                </span>
                {policy.title}
              </h3>
              <p className="text-black leading-relaxed sm:pl-11">
                {policy.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-gray-700 text-sm">
          Have a privacy concern? Reach out through the{" "}
          <a
            href="/about"
            className="text-green-700 hover:underline font-semibold"
          >
            About page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
