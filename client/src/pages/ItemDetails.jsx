import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Tag, Calendar, User, Mail, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { reportsAPI, claimsAPI, transformReport, getCategoryLabel } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ClaimActions from '../components/ClaimActions';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, currentUser } = useAuth();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch item from backend
  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await reportsAPI.getReportById(id);
        
        // Backend returns { data: { report: {...} } }
        if (response.data?.report) {
          const transformedItem = transformReport(response.data.report);
          setItem(transformedItem);
        }
      } catch (err) {
        console.error('Failed to fetch item:', err);
        setError('Failed to load item details.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 size={32} className="animate-spin text-blue-600" />
          <span className="text-slate-600">Loading item details...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !item) {
    return (
      <div className="pt-24 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Item Not Found</h1>
          <p className="text-slate-600 mb-8">{error || "The item you're looking for doesn't exist."}</p>
          <Link 
            to="/find"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  // Report object for ClaimActions component
  const report = {
    ...item,
    finderId: item.finderId
  };

  // Current claim status from item
  const claim = item.claim;

  // Claim action handlers - Real API calls
  const handleClaimItem = async () => {
    if (!userId) {
      alert('Please login to claim this item.');
      navigate('/login');
      return;
    }
    
    setActionLoading(true);
    try {
      await claimsAPI.createClaim(item.id, userId);
      // Refetch item to get updated claim status
      const response = await reportsAPI.getReportById(id);
      if (response.data?.report) {
        setItem(transformReport(response.data.report));
      }
    } catch (err) {
      console.error('Failed to claim item:', err);
      alert(err.message || 'Failed to claim item. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelClaim = async () => {
    setActionLoading(true);
    try {
      await claimsAPI.cancelClaim(item.claim.id, userId);
      const response = await reportsAPI.getReportById(id);
      if (response.data?.report) {
        setItem(transformReport(response.data.report));
      }
    } catch (err) {
      console.error('Failed to cancel claim:', err);
      alert(err.message || 'Failed to cancel claim. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkSolved = async () => {
    setActionLoading(true);
    try {
      console.log('Mark as solved - claim:', item.claim);
      console.log('Mark as solved - claimId:', item.claim?.id);
      await claimsAPI.confirmFinder(item.claim.id);
      const response = await reportsAPI.getReportById(id);
      if (response.data?.report) {
        setItem(transformReport(response.data.report));
      }
    } catch (err) {
      console.error('Failed to confirm handover:', err);
      console.error('Error response:', err.response);
      alert(err.message || 'Failed to confirm. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOwnerConfirm = async () => {
    setActionLoading(true);
    try {
      await claimsAPI.confirmOwner(item.claim.id);
      const response = await reportsAPI.getReportById(id);
      if (response.data?.report) {
        setItem(transformReport(response.data.report));
      }
    } catch (err) {
      console.error('Failed to confirm receipt:', err);
      alert(err.message || 'Failed to confirm. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClaim = async () => {
    setActionLoading(true);
    try {
      await claimsAPI.rejectClaim(item.claim.id, userId);
      const response = await reportsAPI.getReportById(id);
      if (response.data?.report) {
        setItem(transformReport(response.data.report));
      }
    } catch (err) {
      console.error('Failed to reject claim:', err);
      alert(err.message || 'Failed to reject. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-2xl font-bold text-black hover:text-blue-700 mb-6 transition-colors group"
        >
          <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-96 lg:h-[500px] flex items-center">
              {item.images && item.images.length > 0 ? (
                <>
                  <img
                    src={item.images[currentImageIndex]}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Image Navigation */}
                  {item.images.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-4">
                      <button
                        onClick={prevImage}
                        className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-slate-700 transition-all hover:scale-110"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-slate-700 transition-all hover:scale-110"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  )}

                  {/* Image Counter */}
                  {item.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                      {currentImageIndex + 1} / {item.images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                  <Tag size={48} className="mb-3 opacity-50" />
                  <span className="text-lg">No Image Available</span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <div className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md shadow-lg ${
                  item.status === 'solved' 
                    ? 'bg-green-500/95 text-white' 
                    : 'bg-amber-500/95 text-white'
                }`}>
                  {item.status === 'solved' ? 'Solved' : 'Unsolved'}
                </div>
              </div>
            </div>

            {/* Thumbnail Strip (if multiple images) */}
            {item.images && item.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex 
                        ? 'border-blue-600 ring-2 ring-blue-200' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Item Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg mb-3">
                  <Tag size={14} />
                  {getCategoryLabel(item.category)}
                </span>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{item.name}</h1>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar size={16} />
                  <span>Found {item.date}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-slate-700 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Location</div>
                      <div className="text-slate-900 font-semibold">{item.destination}</div>
                    </div>
                  </div>

                  {item.additionalInfo && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                      <p className="text-sm text-blue-900">{item.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Finder Contact Card */}
            <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-full">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Finder Contact Information</h2>
                  <p className="text-blue-100 text-sm">Reach out to claim this item</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <User size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-blue-100 mb-0.5">Name</div>
                      <div className="font-semibold">{item.finder.name}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Mail size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-blue-100 mb-0.5">Email</div>
                      <a 
                        href={`mailto:${item.finder.email}`}
                        className="font-semibold hover:underline block truncate"
                      >
                        {item.finder.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-blue-100 mb-0.5">Phone</div>
                      <a 
                        href={`tel:${item.finder.phone}`}
                        className="font-semibold hover:underline"
                      >
                        {item.finder.phone || 'Not Provided'}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Claim Actions Component */}
            <ClaimActions
              report={report}
              claim={claim}
              currentUserId={userId}
              onClaimItem={handleClaimItem}
              onCancelClaim={handleCancelClaim}
              onMarkSolved={handleMarkSolved}
              onRejectClaim={handleRejectClaim}
              onOwnerConfirm={handleOwnerConfirm}
              loading={actionLoading}
            />

            {/* Login prompt if not logged in */}
            {!currentUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-800 mb-3">Login to claim this item or report found items.</p>
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Login with University Email
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
