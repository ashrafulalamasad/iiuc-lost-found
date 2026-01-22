import { useState, useEffect } from 'react';
import { Search, PlusCircle, ArrowRight, ShieldCheck, Users, CheckCircle, TrendingUp, Package, AlertCircle, Loader2, Hand, MessageCircleMore } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import Card from '../components/Card';
import { reportsAPI, authAPI, transformReports } from '../services/api';

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
        const response = await reportsAPI.getReports();
        // Backend returns { data: { reports: [...] } }
        if (response.data?.reports) {
          const transformedPosts = transformReports(response.data.reports);
          setPosts(transformedPosts);
          
          // Calculate stats from real data
          const total = transformedPosts.length;
          const solved = transformedPosts.filter(p => p.status === 'solved').length;
          setStats(prev => ({
            ...prev,
            total,
            solved,
            pending: total - solved,
          }));
        }

        // Fetch user count
        const userCountResponse = await authAPI.getUserCount();
        if (userCountResponse.data?.count !== undefined) {
          setStats(prev => ({
            ...prev,
            activeUsers: userCountResponse.data.count,
          }));
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        // Keep empty posts array on error
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

// export default function Home() {
  return (
    <div style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black min-h-[70vh] sm:min-h-[90vh] flex items-center justify-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="/iiuc-drone-bg.png" alt="IIUC Campus" className="w-full h-full object-cover saturate-150" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <h1 className="text-5xl sm:text-7xl font-extrabold italic text-outline-black text-green-600 mb-24 tracking-tight">
            Find What's Lost,<br />
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
              hoverBgColor="bg-green-600"
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">Recently Reported</h2>
          <div className="w-sm ml-12 flex items-center justify-end gap-2">
            <Button to="/find" icon={ArrowRight} bgColor="bg-green-600" textColor="text-black" hoverBgColor="bg-black" hoverTextColor="group-hover/btn:text-white">
              View All
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-green-600" strokeWidth={2.5} />
            <span className="ml-3 text-black font-bold">Loading recent items...</span>
          </div>
        ) : posts.length > 0 ? (
          <div className="flex overflow-hidden">
            <motion.div 
              className="flex gap-6 px-4"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                repeat: Infinity, 
                ease: "linear", 
                duration: posts.length * 4
              }}
            >
              {[...posts, ...posts].map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="w-[400px] shrink-0">
                  <Card post={item} />
                </div>
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 font-medium">No items reported yet. Be the first to help!</p>
          </div>
        )}
      </section>

      {/* Dashboard Statistics */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">Community Impact</h2>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-medium">See how our platform is making a difference</p>
          </div>

          <div className="grid grid-cols-2 min-[500px]:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
            {/* Total Items */}
            <div className="bg-white rounded-xl p-4 shadow-lg aspect-square flex flex-col justify-center items-center border-2 border-gray-400 hover:shadow-xl hover:scale-105 hover:border-green-600 transition-all duration-300 w-40 sm:w-45 lg:w-60 h-40 sm:h-45 lg:h-60">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 border-2 border-gray-400 rounded-xl flex items-center justify-center mb-3">
                <Package className="text-black w-6 h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
              </div>
              <p className="text-gray-600 text-sm lg:text-base font-bold mb-2">Total Reported</p>
              <h3 className="text-3xl lg:text-4xl font-bold text-black">{stats.total}</h3>
            </div>

            {/* Items Solved */}
            <div className="bg-white rounded-xl p-4 shadow-lg aspect-square flex flex-col justify-center items-center border-2 border-gray-400 hover:shadow-xl hover:scale-105 hover:border-green-600 transition-all duration-300 w-40 sm:w-45 lg:w-60 h-40 sm:h-45 lg:h-60">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-green-100 border-2 border-green-600 rounded-xl flex items-center justify-center mb-3">
                <CheckCircle className="text-green-700 w-6 h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
              </div>
              <p className="text-gray-600 text-sm lg:text-base font-bold mb-2">Items Returned</p>
              <h3 className="text-3xl lg:text-4xl font-bold text-black">{stats.solved}</h3>
            </div>

            {/* Pending Items */}
            <div className="bg-white rounded-xl p-4 shadow-lg aspect-square flex flex-col justify-center items-center border-2 border-gray-400 hover:shadow-xl hover:scale-105 hover:border-green-600 transition-all duration-300 w-40 sm:w-45 lg:w-60 h-40 sm:h-45 lg:h-60">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-amber-100 border-2 border-amber-500 rounded-xl flex items-center justify-center mb-3">
                <AlertCircle className="text-amber-700 w-6 h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
              </div>
              <p className="text-gray-600 text-sm lg:text-base font-bold mb-2">Pending Items</p>
              <h3 className="text-3xl lg:text-4xl font-bold text-black">{stats.pending}</h3>
            </div>

            {/* Success Rate */}
            <div className="bg-white rounded-xl p-4 shadow-lg aspect-square flex flex-col justify-center items-center border-2 border-gray-400 hover:shadow-xl hover:scale-105 hover:border-green-600 transition-all duration-300 w-40 sm:w-45 lg:w-60 h-40 sm:h-45 lg:h-60">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 border-2 border-gray-400 rounded-xl flex items-center justify-center mb-3">
                <TrendingUp className="text-black w-6 h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
              </div>
              <p className="text-gray-600 text-sm lg:text-base font-bold mb-2">Success Rate</p>
              <h3 className="text-3xl lg:text-4xl font-bold text-black">
                {stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0}%
              </h3>
            </div>

            {/* Active Users */}
            <div className="bg-white rounded-xl p-4 shadow-lg aspect-square flex flex-col justify-center items-center border-2 border-gray-400 hover:shadow-xl hover:scale-105 hover:border-green-600 transition-all duration-300 w-40 sm:w-45 lg:w-60 h-40 sm:h-45 lg:h-60">
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-100 border-2 border-gray-400 rounded-xl flex items-center justify-center mb-3">
                <Users className="text-black w-6 h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
              </div>
              <p className="text-gray-600 text-sm lg:text-base font-bold mb-2">Active Users</p>
              <h3 className="text-3xl lg:text-4xl font-bold text-black">
                {stats.activeUsers}
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-gray-600 text-md sm:text-base lg:text-lg font-medium">Simple steps to help the community.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { icon: Users, title: 'Login', desc: 'Sign in with your university email.' },
              { icon: PlusCircle, title: 'Report', desc: 'Post details about the item you found.' },
              { icon: Hand, title: 'Claim', desc: 'Claim an item you believe is yours.' },
              { icon: MessageCircleMore, title: 'Communicate', desc: 'Chat securely within the platform.' },
              { icon: ShieldCheck, title: 'Connect', desc: 'Owner verifies and contacts you.' },
              { icon: CheckCircle, title: 'Solve', desc: 'Return the item and mark as solved.' },
            ].map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className="w-16 h-16 bg-gray-100 text-black border-2 border-gray-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-green-600 group-hover:bg-green-600 group-hover:text-black transition-all duration-300 shadow-lg">
                  <step.icon size={36} strokeWidth={2.5} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-2">{step.title}</h3>
                <p className="text-md md:text-lg text-gray-700 font-medium">{step.desc}</p>
                
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-slate-100 -z-10">
                    <div className="absolute right-0 -top-1.5 text-slate-200">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
