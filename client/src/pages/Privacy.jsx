import {
  ShieldCheck,
  UserCircle,
  Eye,
  Lock,
  Image,
  Clock,
  Trash2,
  KeyRound,
  Bell,
  Users2,
} from "lucide-react";
import { Link } from "react-router-dom";
import BackButton from "../components/BackButton";

const sections = [
  {
    icon: UserCircle,
    title: "1. Information We Collect",
    body: "When you sign in, Google shares your name, profile picture, and email address with us. When you post a found item, we store the details you provide — the item title, category, location, description, and photographs. If you add one, your phone number is stored so the finder or claimer can reach you to arrange a handover.",
  },
  {
    icon: KeyRound,
    title: "2. How You Sign In",
    body: "We use Google Sign-In, so your password is never typed into our site and is never stored on our servers. Authentication is handled entirely by Google, and we only receive the profile details Google chooses to share. Any Google account works — your IIUC G-Suite mail (such as @ugrad.iiuc.ac.bd) is recommended, but not required.",
  },
  {
    icon: Eye,
    title: "3. Who Can See Your Information",
    body: "Your contact details are never public. They are shown only to the specific person you are communicating with about a particular item, and only once a claim has been opened between you. Item photos and descriptions are public on the feed, because that is what makes matching possible.",
  },
  {
    icon: Lock,
    title: "4. How We Store & Protect Data",
    body: "Your data is stored in a secured database with access restricted to the platform administrators. All traffic between your browser and our servers is encrypted. We record timestamps and, where available, IP addresses of posts solely to protect account security, detect spam, and investigate false reports.",
  },
  {
    icon: Image,
    title: "5. Photos & Sensitive Documents",
    body: "Please think before you upload. If a found item is a document — a student ID, bank card, letter, or notebook — blur or cover confidential numbers and personal details before posting the photograph. You are responsible for the images you publish, and we may remove any image that exposes someone's private information.",
  },
  {
    icon: Users2,
    title: "6. Cookies & Local Storage",
    body: "We use essential cookies and browser storage to keep you signed in and remember your preferences. We do not use advertising or cross-site tracking cookies, and we do not sell any data to third parties — not now, not ever.",
  },
  {
    icon: Clock,
    title: "7. How Long We Keep Data",
    body: 'Once a case is marked "Solved", the associated records are archived and automatically deleted after a set period to keep the database efficient and to limit how long your information is held. Reports that are clearly spam, duplicates, or false are removed immediately.',
  },
  {
    icon: Bell,
    title: "8. Notifications & Messages",
    body: "Messages you exchange in a claim chat are visible to you and the other person in that claim. We do not read your chats, and chat content is not used for any purpose other than delivering it. Notifications are sent only about your own posts, claims, and messages.",
  },
  {
    icon: Trash2,
    title: "9. Your Rights & Deleting Your Account",
    body: "You may request a copy of your data, correct anything that is wrong, or ask us to delete your account and everything attached to it at any time. Contact the team through the About page and we will action your request as quickly as we can. Deleting your account removes your posts, claims, and messages.",
  },
];

export default function Privacy() {
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
              <ShieldCheck size={34} />
            </div>
            <h1 className="mb-5 text-4xl font-extrabold tracking-tight text-black sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mx-auto max-w-3xl text-lg font-medium leading-relaxed text-black sm:text-xl">
              Your privacy matters. Here is exactly what we collect, who sees
              it, and how long we keep it.
            </p>
          </div>
        </div>

        {/* In Short */}
        <div className="mb-10 rounded-2xl border-2 border-green-600 bg-green-50 px-6 py-8 shadow-sm sm:px-10">
          <h2 className="mb-4 text-2xl font-extrabold text-black">In Short</h2>
          <ul className="space-y-3 text-black">
            <li className="flex items-start gap-3">
              <span className="text-green-700 font-bold mt-0.5">✓</span>
              <span>
                We only collect what is needed to return an item — name, email,
                phone number, and the item details you post.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-700 font-bold mt-0.5">✓</span>
              <span>
                Your contact details are private — only the person you are
                dealing with about an item can see them.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-700 font-bold mt-0.5">✓</span>
              <span>
                We never sell your data, and we never will. No advertising
                trackers, either.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-700 font-bold mt-0.5">✓</span>
              <span>
                You can ask for a copy of your data, or have your account
                deleted, at any time.
              </span>
            </li>
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="rounded-2xl border-2 border-gray-300 bg-white px-5 py-6 shadow-sm transition-all hover:-translate-y-1 hover:border-green-600 hover:shadow-lg sm:px-8"
            >
              <h3 className="mb-3 flex items-center gap-3 text-xl font-extrabold text-black sm:text-2xl">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-green-500 text-black">
                  <section.icon size={20} />
                </span>
                {section.title}
              </h3>
              <p className="text-black leading-relaxed sm:pl-13">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border-2 border-gray-300 bg-white px-6 py-6 text-center text-sm font-medium text-gray-700 shadow-sm sm:text-base">
          Have a privacy concern? Reach out through the{" "}
          <Link
            to="/about"
            className="text-green-700 hover:underline font-semibold"
          >
            About page
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
