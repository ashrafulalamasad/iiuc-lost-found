import { useAuth } from "../context/AuthContext";
import { LogOut, User, Mail, Shield, Package, ClipboardList, Loader2, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { reportsAPI, claimsAPI, transformReports, transformReport } from "../services/api";
import Card from "../components/Card";
import BackButton from '../components/BackButton';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [activeTab, setActiveTab] = useState('reports');
  const [userReports, setUserReports] = useState([]);
  const [userClaims, setUserClaims] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [unsolvedClaims, setUnsolvedClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the photo URL - try photoURL first, then fallback to providerData
  
  const getPhotoURL = () => {
    let url = null;
    
    if (currentUser?.photoURL) {
      url = currentUser.photoURL;
    } else if (currentUser?.providerData?.[0]?.photoURL) {
      url = currentUser.providerData[0].photoURL;
    }
    
    // If it's a Google profile picture, request higher resolution
    if (url && url.includes('googleusercontent.com')) {
      url = url.replace(/=s\d+-c/, '=s1024-c'); // Change any size to 1024px
    }
    
    return url;
  };

  const photoURL = getPhotoURL();

  // Add this helper function after getPhotoURL()
  const getJoinedDate = () => {
    if (currentUser?.metadata?.creationTime) {
      const date = new Date(currentUser.metadata.creationTime);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric' 
      });
    }
    return 'N/A';
  };

  // Fetch user's reports and claims
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        setLoading(true);
        try {
          // Fetch reports
          const reportsResponse = await reportsAPI.getUserReports(currentUser.uid);
          if (reportsResponse.data?.reports) {
            const allReports = transformReports(reportsResponse.data.reports);
            setUserReports(allReports);
            // Filter pending reports (status is 'UNSOLVED' in uppercase from backend)
            setPendingReports(allReports.filter(r => r.status?.toLowerCase() === 'unsolved'));
          }
          
          // Fetch claims
          const claimsResponse = await claimsAPI.getUserClaims(currentUser.uid);
          if (claimsResponse.data?.claims) {
            setUserClaims(claimsResponse.data.claims);
            // Filter unsolved claims (claim status is NOT 'SOLVED' - can be PENDING, REJECTED, or CANCELLED)
            setUnsolvedClaims(claimsResponse.data.claims.filter(c => c.status?.toUpperCase() !== 'SOLVED'));
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchUserData();
  }, [currentUser]);

  return (
    <div className="pt-28 pb-12 min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <BackButton />
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
          {/* Header */}
          <div className="bg-linear-to-r from-sky-400 to-sky-700 h-36 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute -bottom-30 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="w-60 h-60 rounded-full border-4 border-white bg-white shadow-2xl overflow-hidden ring-6 ring-green-600">
                  {photoURL && !imageError ? (
                    <img
                      src={photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600">
                      <User size={56} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-40 pb-8 px-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">
              {currentUser?.displayName || "Student"}
            </h1>

            <div className="flex flex-col gap-3 max-w-lg mx-auto mb-8">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 p-4 sm:p-5 md:p-6 bg-linear-to-r from-amber-50 to-amber-50/50 rounded-4xl border border-slate-200 hover:shadow-md transition-all duration-200">
                <div className="p-1.5 sm:p-2 md:p-2.5 bg-white rounded-xl shadow-sm">
                  <Mail className="text-amber-600 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs sm:text-sm md:text-base text-amber-500 font-semibold uppercase tracking-wider mb-0.5">
                    Email Address
                  </p>
                  <p className="text-slate-800 font-semibold text-sm sm:text-base md:text-lg truncate">
                    {currentUser?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 p-4 sm:p-5 md:p-6 bg-linear-to-r from-emerald-50 to-green-50/50 rounded-4xl border border-emerald-200 hover:shadow-md transition-all duration-200">
                <div className="p-1.5 sm:p-2 md:p-2.5 bg-white rounded-xl shadow-sm">
                  <Shield className="text-emerald-600 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs sm:text-sm md:text-base text-emerald-700 font-semibold uppercase tracking-wider mb-0.5">
                    Account Status
                  </p>
                  <p className="text-emerald-900 font-semibold text-sm sm:text-base md:text-lg">Verified Student</p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 p-4 sm:p-5 md:p-6 bg-linear-to-r from-blue-50 to-indigo-50/50 rounded-4xl border border-blue-200 hover:shadow-md transition-all duration-200">
                <div className="p-1.5 sm:p-2 md:p-2.5 bg-white rounded-xl shadow-sm">
                  <Calendar className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs sm:text-sm md:text-base text-blue-700 font-semibold uppercase tracking-wider mb-0.5">
                    Member Since
                  </p>
                  <p className="text-blue-900 font-semibold text-sm sm:text-base md:text-lg">{getJoinedDate()}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                navigate('/');
                logout();
              }}
              className="inline-flex items-center gap-2 sm:gap-2.5 md:gap-3 px-6 sm:px-8 md:px-10 py-3 sm:py-3.5 md:py-4 bg-linear-to-r from-red-50 to-red-100 text-red-600 rounded-full font-semibold hover:from-red-100 hover:to-red-200 transition-transform duration-200 shadow-sm hover:shadow-md border border-red-200 hover:scale-105 cursor-pointer text-sm sm:text-base md:text-lg"
            >
              <LogOut className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs Section */}

        {/* flex flex-row max-[360px]:flex-col items-start gap-3 mb-8 */}
        <div className="mt-10">
          <div className="flex flex-wrap items-start gap-x-3 gap-y-2 mb-8 w-full">
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex items-center gap-2.5 px-4 py-4 rounded-full font-bold transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer ${
                activeTab === 'reports'
                  ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Package size={20} strokeWidth={2.5} />
              <span className="text-base">My Reports</span>
              <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'reports' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {userReports.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('claims')}
              className={`flex items-center gap-2.5 px-4 py-4 rounded-full font-bold transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer ${
                activeTab === 'claims'
                  ? 'bg-linear-to-r from-blue-600 to-blue-700 text-white scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <ClipboardList size={20} strokeWidth={2.5} />
              <span className="text-base">My Claims</span>
              <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'claims' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {userClaims.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('pendingReports')}
              className={`flex items-center gap-2.5 px-4 py-4 rounded-full font-bold transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer ${
                activeTab === 'pendingReports'
                  ? 'bg-linear-to-r from-amber-500 to-amber-600 text-white scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <Package size={20} strokeWidth={2.5} />
              <span className="text-base">Pending Reports</span>
              <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'pendingReports'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {pendingReports.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('unsolvedClaims')}
              className={`flex items-center gap-2.5 px-4 py-4 rounded-full font-bold transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer ${
                activeTab === 'unsolvedClaims'
                  ? 'bg-linear-to-r from-purple-500 to-purple-600 text-white scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              <ClipboardList size={20} strokeWidth={2.5} />
              <span className="text-base">Unsolved Claims</span>
              <span className={`ml-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'unsolvedClaims'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {unsolvedClaims.length}
              </span>
            </button>
          </div>

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                  <Loader2 size={40} className="animate-spin text-blue-600 mb-4" strokeWidth={2.5} />
                  <span className="text-slate-600 font-medium text-lg">Loading your reports...</span>
                </div>
              ) : userReports.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userReports.map(post => (
                    <Card key={post.id} post={post} isOwner={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-linear-to-br from-white to-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="p-4 bg-blue-50 rounded-full w-fit mx-auto mb-5">
                    <Package size={56} className="text-blue-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-slate-600 text-lg font-medium">You haven't reported any items yet.</p>
                  <p className="text-slate-400 text-sm mt-2">Start by reporting a lost item you found!</p>
                </div>
              )}
            </div>
          )}

          {/* Claims Tab */}
          {activeTab === 'claims' && (
            <div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                  <Loader2 size={40} className="animate-spin text-blue-600 mb-4" strokeWidth={2.5} />
                  <span className="text-slate-600 font-medium text-lg">Loading your claims...</span>
                </div>
              ) : userClaims.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {userClaims.map(claim => (
                    <Card key={claim.id} post={transformReport(claim.report)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-linear-to-br from-white to-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="p-4 bg-purple-50 rounded-full w-fit mx-auto mb-5">
                    <ClipboardList size={56} className="text-purple-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-slate-600 text-lg font-medium">You haven't made any claims yet.</p>
                  <p className="text-slate-400 text-sm mt-2">Browse items and claim what's yours!</p>
                </div>
              )}
            </div>
          )}

          {/* Pending Reports Tab */}
          {activeTab === 'pendingReports' && (
            <div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                  <Loader2 size={40} className="animate-spin text-amber-600 mb-4" strokeWidth={2.5} />
                  <span className="text-slate-600 font-medium text-lg">Loading pending reports...</span>
                </div>
              ) : pendingReports.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {pendingReports.map(post => (
                    <Card key={post.id} post={post} isOwner={true} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-linear-to-br from-white to-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="p-4 bg-amber-50 rounded-full w-fit mx-auto mb-5">
                    <Package size={56} className="text-amber-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-slate-600 text-lg font-medium">No pending reports.</p>
                  <p className="text-slate-400 text-sm mt-2">All your reports have been resolved!</p>
                </div>
              )}
            </div>
          )}

          {/* Unsolved Claims Tab */}
          {activeTab === 'unsolvedClaims' && (
            <div>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                  <Loader2 size={40} className="animate-spin text-purple-600 mb-4" strokeWidth={2.5} />
                  <span className="text-slate-600 font-medium text-lg">Loading unsolved claims...</span>
                </div>
              ) : unsolvedClaims.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {unsolvedClaims.map(claim => (
                    <Card key={claim.id} post={transformReport(claim.report)} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-linear-to-br from-white to-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-slate-300 transition-colors">
                  <div className="p-4 bg-purple-50 rounded-full w-fit mx-auto mb-5">
                    <ClipboardList size={56} className="text-purple-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-slate-600 text-lg font-medium">No unsolved claims.</p>
                  <p className="text-slate-400 text-sm mt-2">All your claims have been resolved!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
