import {
  ScrollText,
  FileText,
  Users,
  ShieldAlert,
  Gavel,
  RefreshCw,
} from "lucide-react";
import BackButton from "../components/BackButton";

const sections = [
  {
    icon: FileText,
    title: "1. Acceptance of Terms",
    body: "By creating an account, browsing the feed, posting a found item, or submitting a claim on IIUC Lost & Found, you confirm that you have read, understood, and agreed to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of the platform immediately.",
  },
  {
    icon: Users,
    title: "2. Who May Use This Platform",
    body: "This platform is built for the students and staff of International Islamic University Chittagong. You may sign in with any Google account — your IIUC G-Suite mail (such as @ugrad.iiuc.ac.bd) is recommended so we can confirm your university affiliation, but it is not required. You are responsible for keeping your own account secure and for everything that happens through your account.",
  },
  {
    icon: ShieldAlert,
    title: "3. Honest Reporting & Claims",
    body: "Every post must be genuine. You may only report items you have actually found, and you may only claim items you genuinely own. Submitting false reports, duplicate claims, or claims on items that are not yours is treated as a serious violation and leads to a permanent ban. When claiming an item, be prepared to prove ownership with photographs, receipts, or a description of unique identifying details.",
  },
  {
    icon: RefreshCw,
    title: "4. How the Platform Works",
    body: "IIUC Lost & Found is a reporting platform only. It connects the person who found an item with the person who lost it. We do not take possession of, store, or deliver any item, and we are not responsible for an item once a meeting has been arranged. Always meet in a safe, public location on campus. This platform is for reporting Found items — if you have lost something, search the existing feed rather than creating a new post.",
  },
  {
    icon: Users,
    title: "5. Gender Policy for Handovers",
    body: "To keep every exchange safe and comfortable, direct face-to-face meetups between a finder and a claimer are restricted to the same gender (male–male or female–female). If the finder and the claimer are of different genders, the item must be deposited at a university office or another designated location, and the handover completed there. This policy applies to every claim on the platform and is not optional.",
  },
  {
    icon: Gavel,
    title: "6. Prohibited Conduct",
    list: [
      "Posting abusive, hateful, or misleading content.",
      "Harassing, threatening, or impersonating another member.",
      "Claiming an item you do not own, or demanding payment for returning a found item.",
      "Circumventing the gender policy or arranging off-platform handovers to avoid it.",
      "Scraping, copying, or redistributing another member's personal data.",
    ],
  },
  {
    icon: FileText,
    title: "7. Content & Image Rights",
    body: "When you upload a photograph, you confirm that you own it or have permission to share it, and that it does not depict another person without their consent. By posting, you grant IIUC Lost & Found a non-exclusive licence to display that content on the platform for the purpose of reuniting it with its owner. Please blur sensitive details such as ID numbers or card digits before uploading.",
  },
  {
    icon: ShieldAlert,
    title: "8. Limitation of Liability",
    body: "IIUC Lost & Found is provided on an as-is, as-available basis. We make no guarantee that an item will be found, returned, or matched. We are not liable for any loss, damage, or dispute arising between members during or after a handover. You use the platform and meet other members entirely at your own risk.",
  },
  {
    icon: Gavel,
    title: "9. Account Suspension & Termination",
    body: "The administration reserves the right to warn, suspend, or permanently terminate any account that violates these terms, engages in abusive behaviour, or breaches university conduct rules. Serious violations, including false reporting and impersonation, result in an immediate permanent ban with no prior warning.",
  },
  {
    icon: RefreshCw,
    title: "10. Changes to These Terms",
    body: "These terms may be revised as the platform grows and as university guidelines evolve. When we make material changes, we will update the effective date shown on this page. Continuing to use IIUC Lost & Found after a revision means you accept the updated terms, so please review them occasionally.",
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
              The rules that keep IIUC Lost &amp; Found honest, safe, and useful
              for everyone.
            </p>
            <p className="mt-6 inline-block text-sm sm:text-base bg-white/15 text-white px-5 py-2 rounded-full">
              Last updated: 17 September 2026
            </p>
          </div>
        </div>

        {/* In Short */}
        <div className="bg-green-50 rounded-2xl border-3 border-green-600 px-6 sm:px-10 py-8 mb-10">
          <h2 className="text-2xl font-bold text-black mb-4">In Short</h2>
          <ul className="space-y-3 text-black">
            <li className="flex items-start gap-3">
              <span className="text-green-700 font-bold mt-0.5">✓</span>
              <span>
                Report only items you genuinely found, and claim only what is
                genuinely yours.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-700 font-bold mt-0.5">✓</span>
              <span>
                Same-gender meetups only — otherwise hand over at a university
                office.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-700 font-bold mt-0.5">✓</span>
              <span>
                We connect people; we never hold, store, or deliver items
                ourselves.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-700 font-bold mt-0.5">✓</span>
              <span>
                False reports and impersonation lead to a permanent ban.
              </span>
            </li>
          </ul>
        </div>

        {/* Sections */}
        <div className="space-y-5">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-gray-200 rounded-xl border-3 border-black px-5 sm:px-8 py-6 hover:border-green-600 hover:bg-gray-300 transition-all"
            >
              <h3 className="font-bold text-black text-xl sm:text-2xl mb-3 flex items-center gap-3">
                <span className="w-10 h-10 shrink-0 bg-linear-to-br from-green-500 to-emerald-600 text-white rounded-lg flex items-center justify-center">
                  <section.icon size={20} />
                </span>
                {section.title}
              </h3>
              {section.body && (
                <p className="text-black leading-relaxed sm:pl-13">
                  {section.body}
                </p>
              )}
              {section.list && (
                <ul className="space-y-2 sm:pl-13">
                  {section.list.map((item, li) => (
                    <li
                      key={li}
                      className="flex items-start gap-3 text-black leading-relaxed"
                    >
                      <span className="w-2 h-2 shrink-0 rounded-full bg-green-600 mt-2.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 text-center text-gray-700 text-sm sm:text-base bg-gray-200 rounded-xl border-3 border-black px-6 py-6">
          Questions about these terms? Visit the{" "}
          <a
            href="/about"
            className="text-green-700 hover:underline font-semibold"
          >
            About page
          </a>{" "}
          to reach the team.
        </div>
      </div>
    </div>
  );
}
