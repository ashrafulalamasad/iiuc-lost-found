import { ScrollText } from "lucide-react";
import BackButton from "../components/BackButton";

const terms = [
  {
    title: "Honesty",
    body: "You must only post genuine claims. False reporting will result in a ban.",
  },
  {
    title: "Ownership",
    body: "You must provide proof (photos, receipts, or unique descriptions) to claim an item.",
  },
  {
    title: "Responsibility",
    body: "The platform connects students; we are not responsible for the items themselves.",
  },
  {
    title: "Student Status",
    body: "You must be a current student or staff member with a valid Ugrad Mail to use this service.",
  },
  {
    title: "Reporting Logic",
    body: "This platform is exclusively for reporting Found items. If you lose an item, please search the feed instead of creating a new post.",
  },
  {
    title: "Gender Policy",
    body: "Direct face-to-face meetups are strictly restricted to the same gender (Male-Male or Female-Female).",
  },
  {
    title: "Cross-Gender Claims",
    body: "If the Finder and Claimer are of opposite genders, the item must be deposited at the University office or any designated location for handover.",
  },
  {
    title: "Account Termination",
    body: "The administration reserves the right to suspend accounts for abusive behavior or violating university conduct rules.",
  },
];

export default function Terms() {
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
              <ScrollText size={34} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
              Terms of Service
            </h1>
            <p className="text-lg sm:text-xl text-white leading-relaxed max-w-3xl mx-auto">
              Welcome to IIUC Lost &amp; Found. By using this platform, you
              agree to the following terms.
            </p>
          </div>
        </div>

        {/* Terms list */}
        <div className="space-y-4">
          {terms.map((term, idx) => (
            <div
              key={idx}
              className="bg-gray-200 rounded-xl border-3 border-black px-5 sm:px-7 py-5 hover:border-green-600 hover:bg-gray-300 transition-all"
            >
              <h3 className="font-bold text-black text-xl mb-2 flex items-center gap-3">
                <span className="w-8 h-8 shrink-0 bg-linear-to-br from-green-500 to-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">
                  {idx + 1}
                </span>
                {term.title}
              </h3>
              <p className="text-black leading-relaxed sm:pl-11">{term.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-gray-700 text-sm">
          These terms may be updated as the platform evolves. Continued use of
          IIUC Lost &amp; Found means you accept the latest version.
        </p>
      </div>
    </div>
  );
}
