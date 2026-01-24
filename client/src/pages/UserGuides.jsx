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
      className="min-h-screen bg-gray-50 pb-16 pt-28"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />

        {/* Hero */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border-2 border-black bg-green-600 px-6 py-10 text-center shadow-[8px_8px_0_#111827] sm:px-12 sm:py-14">
          <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border-[18px] border-white/15"></div>
          <div className="absolute -bottom-24 -left-8 h-56 w-56 rounded-full border-[24px] border-black/10"></div>
          <div className="relative z-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black bg-white text-black shadow-lg">
              <BookOpen size={34} />
            </div>
            <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
              User Guides
            </h1>
            <p className="mx-auto max-w-3xl text-lg font-medium leading-relaxed text-black sm:text-xl">
              Everything you need to find what you lost, report what you found,
              and get items home safely.
            </p>
          </div>
        </div>

        {/* Video walkthrough */}
        <div className="mb-10 rounded-2xl border-2 border-gray-300 bg-white p-5 shadow-sm sm:p-8">
          <p className="mb-5 rounded-xl border-2 border-black bg-amber-500 px-4 py-3 text-center text-lg font-extrabold text-black sm:text-xl">
            🎥 Watch this complete walkthrough video to get started
          </p>
          <YoutubePlayer
            videoId="xQc6o_q46e4"
            title="IIUC Lost & Found Platform Walkthrough"
          />
        </div>

        {/* Step-by-step */}
        <h2 className="mb-6 text-center text-3xl font-extrabold text-black sm:text-4xl">
          Step by Step
        </h2>
        <div className="space-y-5 mb-12">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border-2 border-gray-300 bg-white px-5 pb-6 pt-12 shadow-sm transition-all hover:-translate-y-1 hover:border-green-600 hover:shadow-lg sm:px-8 sm:pt-12"
            >
              <h3 className="mb-3 flex items-center gap-3 text-xl font-extrabold text-black sm:text-2xl">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-green-500 text-black">
                  <s.icon size={20} />
                </span>
                <span className="min-w-0 break-words">{s.title}</span>
              </h3>
              <span className="absolute left-5 top-4 rounded-full border border-green-300 bg-green-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-green-700 sm:left-8">
                {s.step}
              </span>
              <p className="text-black leading-relaxed sm:pl-13">{s.body}</p>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="rounded-2xl border-2 border-green-600 bg-green-50 px-6 py-8 shadow-sm sm:px-10">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-extrabold text-black">
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
