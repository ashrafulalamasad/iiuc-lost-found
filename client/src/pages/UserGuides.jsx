import { BookOpen, CheckCircle2 } from "lucide-react";
import BackButton from "../components/BackButton";
import YoutubePlayer from "../components/YoutubePlayer";

const learningGoals = [
  "How to sign in with your Ugrad Mail",
  "How to search for your lost items",
  "How to report found items",
  "How to claim items and communicate with finders",
  "Understanding the gender policy for safe meetups",
  "Best practices for quick reunions",
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
        <div className="relative bg-linear-to-br from-green-600 via-emerald-700 to-green-800 rounded-2xl shadow-2xl px-6 py-10 sm:px-12 sm:py-14 mb-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-5 bg-white/15 rounded-2xl flex items-center justify-center text-white">
              <BookOpen size={34} />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-5 tracking-tight">
              User Guides
            </h1>
            <p className="text-lg sm:text-xl text-white leading-relaxed max-w-3xl mx-auto">
              Welcome to the IIUC Lost &amp; Found platform! This guide walks
              you through every feature so you can make the most of the service.
            </p>
          </div>
        </div>

        {/* What you'll learn */}
        <div className="bg-green-50 rounded-2xl border-3 border-green-600 px-6 sm:px-10 py-8 mb-10">
          <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
            <BookOpen size={26} className="text-green-700" />
            What You'll Learn
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {learningGoals.map((goal, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-black leading-relaxed"
              >
                <CheckCircle2
                  size={20}
                  className="shrink-0 text-green-600 mt-0.5"
                />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Video walkthrough */}
        <div className="bg-gray-200 rounded-2xl border-3 border-black p-5 sm:p-8">
          <p className="mb-5 font-bold text-lg sm:text-xl text-center bg-amber-500 text-black py-3 px-4 rounded-lg">
            🎥 Watch this complete walkthrough video to get started
          </p>
          <YoutubePlayer
            videoId="xQc6o_q46e4"
            title="IIUC Lost & Found Platform Walkthrough"
          />
        </div>
      </div>
    </div>
  );
}
