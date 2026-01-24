import {
  BookOpen,
  CheckCircle2,
  LogIn,
  Search,
  PlusCircle,
  HandHeart,
  MessageCircleMore,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";
import BackButton from "../components/BackButton";
import YoutubePlayer from "../components/YoutubePlayer";

const steps = [
  {
    icon: LogIn,
    step: "Step 1",
    title: "Sign In",
    body: "Tap “Continue with Google” on the login page. Any Google account works — your IIUC G-Suite mail (such as @ugrad.iiuc.ac.bd) is recommended so we can confirm you are part of the university, but a personal Gmail works too. On your first visit we will ask for your gender, which is used only to apply the handover policy.",
  },
  {
    icon: Search,
    step: "Step 2",
    title: "Search for a Lost Item",
    body: "Open Find Lost Items and browse the most recent reports, or filter by category. If you have lost something, search here first — someone may have already found it. Never create a new post for an item you lost; this platform is for reporting Found items only.",
  },
  {
    icon: PlusCircle,
    step: "Step 3",
    title: "Report a Found Item",
    body: "Tap Report Found Item, then add a clear title, category, the location where you found it, a short description, and at least one photograph. The better your description and photo, the faster the owner will recognise it. Post it as soon as you can — the feed is most useful when it is fresh.",
  },
  {
    icon: HandHeart,
    step: "Step 4",
    title: "Claim an Item",
    body: "If something on the feed is yours, open it and press Claim. Be ready to prove it — describe a unique detail, or show a receipt or photograph. The finder reviews your claim and either accepts or declines it. You can open a claim on several items if you are not sure which one is yours.",
  },
  {
    icon: MessageCircleMore,
    step: "Step 5",
    title: "Chat & Arrange the Handover",
    body: "Once a claim is accepted, a private chat opens between you and the other person. Use it to agree a time and place. Meet somewhere public and busy on campus. Direct face-to-face meetups are same-gender only — if you are of different genders, deposit the item at a university office or a designated location instead.",
  },
  {
    icon: ShieldCheck,
    step: "Step 6",
    title: "Mark It Solved",
    body: "When the item has been handed over, mark the case as solved. This removes it from the active feed, updates the community statistics on the home page, and lets the next person searching know that this one is already home.",
  },
];

const tips = [
  "Photograph the item from more than one angle, and capture anything that makes it identifiable.",
  "Blur ID numbers, card digits, and personal details before uploading documents.",
  "Report items as soon as you find them — a fresh feed reunites items faster.",
  "Check the feed before you post, to avoid reporting something that is already listed.",
  "Keep handovers on campus, in public, during daylight where possible.",
  "If a claim feels suspicious, do not hand anything over — report it to the team instead.",
];

export default function UserGuides() {
  return (
    <div
      className="pt-28 pb-12 min-h-screen"
      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />

        {/* Hero */}
        <div className="relative bg-linear-to-br from-green-600 via-emerald-700 to-green-800 rounded-2xl shadow-2xl px-6 py-10 sm:px-12 sm:py-14 mb-10 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-5 bg-white/15 rounded-2xl flex items-center justify-center text-white">
              <BookOpen size={34} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
              User Guides
            </h1>
            <p className="text-lg sm:text-xl text-white leading-relaxed max-w-3xl mx-auto">
              Everything you need to find what you lost, report what you found,
              and get items home safely.
            </p>
          </div>
        </div>

        {/* Video walkthrough */}
        <div className="bg-gray-200 rounded-2xl border-3 border-black p-5 sm:p-8 mb-10">
          <p className="mb-5 font-bold text-lg sm:text-xl text-center bg-amber-500 text-black py-3 px-4 rounded-lg">
            🎥 Watch this complete walkthrough video to get started
          </p>
          <YoutubePlayer
            videoId="xQc6o_q46e4"
            title="IIUC Lost & Found Platform Walkthrough"
          />
        </div>

        {/* Step-by-step */}
        <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6 text-center">
          Step by Step
        </h2>
        <div className="space-y-5 mb-12">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="bg-gray-200 rounded-xl border-3 border-black px-5 sm:px-8 py-6 hover:border-green-600 hover:bg-gray-300 transition-all"
            >
              <h3 className="font-bold text-black text-xl sm:text-2xl mb-3 flex items-center gap-3">
                <span className="w-10 h-10 shrink-0 bg-linear-to-br from-green-500 to-emerald-600 text-white rounded-lg flex items-center justify-center">
                  <s.icon size={20} />
                </span>
                <span className="text-green-700 text-base font-bold">
                  {s.step}
                </span>
                <span className="sr-only">:</span>
                {s.title}
              </h3>
              <p className="text-black leading-relaxed sm:pl-13">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="bg-green-50 rounded-2xl border-3 border-green-600 px-6 sm:px-10 py-8">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <Lightbulb size={26} className="text-green-700" />
            Tips for a Faster Reunion
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tips.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-black leading-relaxed"
              >
                <CheckCircle2
                  size={20}
                  className="shrink-0 text-green-600 mt-0.5"
                />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
