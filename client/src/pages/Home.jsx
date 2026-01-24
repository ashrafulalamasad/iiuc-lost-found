import { useState, useEffect } from "react";
import {
  Search,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Users,
  CheckCircle,
  TrendingUp,
  Package,
  AlertCircle,
  Loader2,
  Hand,
  MessageCircleMore,
} from "lucide-react";
import { motion } from "framer-motion";
import Button from "../components/Button";
import Card from "../components/Card";
import { reportsAPI, authAPI, transformReports } from "../services/api";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    pending: 0,
    activeUsers: 0,
  });

  // Fetch recent reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Fetch all reports for stats calculation (use large limit)
        const response = await reportsAPI.getReports(null, 1, 1000);
        // Backend returns { data: { reports: [...] } }
        if (response.data?.reports) {
          const transformedPosts = transformReports(response.data.reports);
          setPosts(transformedPosts);

          // Calculate stats from real data
          const total = transformedPosts.length;
          const solved = transformedPosts.filter(
            (p) => p.status === "solved",
          ).length;
          setStats((prev) => ({
            ...prev,
            total,
            solved,
            pending: total - solved,
          }));
        }

        // Fetch user count
        const userCountResponse = await authAPI.getUserCount();
        if (userCountResponse.data?.count !== undefined) {
          setStats((prev) => ({
            ...prev,
            activeUsers: userCountResponse.data.count,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
        // Keep empty posts array on error
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Recently Reported strip: prefer the latest UNSOLVED items (max 10).
  // If fewer than 10 unsolved exist, top up with the newest solved ones.
  // posts are already sorted newest-first from the backend.
  const recentPosts = (() => {
    const unsolved = posts.filter((p) => p.status !== "solved");
    const solved = posts.filter((p) => p.status === "solved");
    return [...unsolved, ...solved].slice(0, 10);
  })();

  // export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black min-h-[70vh] sm:min-h-[90vh] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/iiuc-drone-bg.png"
            alt="IIUC Campus"
            className="w-full h-full object-cover saturate-150"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <h1 className="text-4xl max-[400px]:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold italic text-outline-black text-amber-700 mb-24 tracking-tight">
            Find What's Lost,
            <br />
            Return What's Found.
          </h1>

          <div className="flex max-[450px]:flex-col items-center justify-center gap-3 sm:gap-6">
            <Button
              to="/find"
              icon={Search}
              bgColor="bg-green-600"
              textColor="text-black"
              hoverBgColor="bg-white"
              hoverTextColor="group-hover/btn:text-black"
              className="w-auto"
            >
              Find Lost Items
            </Button>
            <Button
              to="/report"
              icon={PlusCircle}
              bgColor="bg-black"
              textColor="text-white"
              hoverBgColor="bg-amber-600"
              hoverTextColor="group-hover/btn:text-black"
              className="w-auto"
            >
              Report Found Item
            </Button>
          </div>
        </div>
      </section>

      {/* Infinite Slideshow */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10 mb-10 flex items-center justify-between">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            Recently Reported
          </h2>
          <div className="w-sm ml-12 flex items-center justify-end gap-2">
            <Button
              to="/find"
              icon={ArrowRight}
              bgColor="bg-green-600"
              textColor="text-black"
              hoverBgColor="bg-black"
              hoverTextColor="group-hover/btn:text-white"
            >
              View All
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2
              size={32}
              className="animate-spin text-green-600"
              strokeWidth={2.5}
            />
            <span className="ml-3 text-black font-bold">
              Loading recent items...
            </span>
          </div>
        ) : recentPosts.length > 0 ? (
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-6 px-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: recentPosts.length * 4,
              }}
            >
              {[...recentPosts, ...recentPosts].map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="w-100 shrink-0">
                  <Card post={item} />
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 font-medium">
              No items reported yet. Be the first to help!
            </p>
          </div>
        )}
      </section>

      {/* Dashboard Statistics */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative mb-12 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Community in action
            </span>
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Community Impact
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base lg:text-lg">
              See how our platform is making a difference
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-3 min-[500px]:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 sm:gap-5">
            {/* Total Items */}
            <div className="group flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-slate-300 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-emerald-700 lg:h-14 lg:w-14">
                <Package
                  className="h-6 w-6 lg:h-7 lg:w-7"
                  strokeWidth={2.5}
                />
              </div>
              <p className="mb-2 text-xs font-bold text-slate-500 sm:text-sm lg:text-base">
                Total Reported
              </p>
              <h3 className="text-3xl font-bold text-slate-950 lg:text-4xl">
                {stats.total}
              </h3>
            </div>

            {/* Items Solved */}
            <div className="group flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-slate-300 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-emerald-700 lg:h-14 lg:w-14">
                <CheckCircle
                  className="h-6 w-6 lg:h-7 lg:w-7"
                  strokeWidth={2.5}
                />
              </div>
              <p className="mb-2 text-xs font-bold text-slate-500 sm:text-sm lg:text-base">
                Items Returned
              </p>
              <h3 className="text-3xl font-bold text-slate-950 lg:text-4xl">
                {stats.solved}
              </h3>
            </div>

            {/* Pending Items */}
            <div className="group flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-slate-300 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-emerald-700 lg:h-14 lg:w-14">
                <AlertCircle
                  className="h-6 w-6 lg:h-7 lg:w-7"
                  strokeWidth={2.5}
                />
              </div>
              <p className="mb-2 text-xs font-bold text-slate-500 sm:text-sm lg:text-base">
                Pending Items
              </p>
              <h3 className="text-3xl font-bold text-slate-950 lg:text-4xl">
                {stats.pending}
              </h3>
            </div>

            {/* Success Rate */}
            <div className="group flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-slate-300 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-emerald-700 lg:h-14 lg:w-14">
                <TrendingUp
                  className="h-6 w-6 lg:h-7 lg:w-7"
                  strokeWidth={2.5}
                />
              </div>
              <p className="mb-2 text-xs font-bold text-slate-500 sm:text-sm lg:text-base">
                Success Rate
              </p>
              <h3 className="text-3xl font-bold text-slate-950 lg:text-4xl">
                {stats.total > 0
                  ? Math.round((stats.solved / stats.total) * 100)
                  : 0}
                %
              </h3>
            </div>

            {/* Active Users */}
            <div className="group flex aspect-square flex-col items-center justify-center rounded-2xl border-2 border-slate-300 bg-white p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:shadow-lg hover:shadow-slate-200/70 sm:p-5">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 ring-1 ring-slate-200 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-50 group-hover:text-emerald-700 lg:h-14 lg:w-14">
                <Users
                  className="h-6 w-6 lg:h-7 lg:w-7"
                  strokeWidth={2.5}
                />
              </div>
              <p className="mb-2 text-xs font-bold text-slate-500 sm:text-sm lg:text-base">
                Active Users
              </p>
              <h3 className="text-3xl font-bold text-slate-950 lg:text-4xl">
                {stats.activeUsers}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 max-[400px]:px-2 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-16">
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-green-700">
              A simple path to making a difference
            </span>
            <h2 className="mb-4 text-3xl font-bold text-slate-950 sm:text-4xl lg:text-5xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-xl text-sm font-medium leading-relaxed text-slate-500 sm:text-base lg:text-lg">
              Simple steps to help the community.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {[
              {
                icon: Users,
                title: "Login",
                desc: "Sign in with your university email.",
              },
              {
                icon: PlusCircle,
                title: "Report",
                desc: "Post details about the item you found.",
              },
              {
                icon: Hand,
                title: "Claim",
                desc: "Claim an item you believe is yours.",
              },
              {
                icon: MessageCircleMore,
                title: "Communicate",
                desc: "Chat securely within the platform.",
              },
              {
                icon: ShieldCheck,
                title: "Connect",
                desc: "Owner verifies and contacts you.",
              },
              {
                icon: CheckCircle,
                title: "Solve",
                desc: "Return the item and mark as solved.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className="group relative flex min-h-[190px] flex-col items-center rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-400 hover:bg-white hover:shadow-xl hover:shadow-green-900/10 sm:min-h-64 sm:p-6"
              >
                <span className="absolute right-5 top-4 text-sm font-bold text-slate-500 transition-colors group-hover:text-green-600">
                  0{idx + 1}
                </span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-md ring-1 ring-slate-200 transition-all duration-300 group-hover:bg-green-600 group-hover:text-white group-hover:ring-green-600 sm:mb-6 sm:h-16 sm:w-16">
                  <step.icon size={28} className="sm:h-9 sm:w-9" strokeWidth={2.5} />
                </div>
                <h3 className="mb-2 text-base font-bold text-slate-950 sm:text-2xl">
                  {step.title}
                </h3>
                <p className="text-xs font-medium leading-relaxed text-slate-500 sm:text-base">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
