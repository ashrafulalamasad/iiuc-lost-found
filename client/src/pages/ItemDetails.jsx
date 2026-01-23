import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Tag, Calendar, User, Mail, ChevronLeft, ChevronRight, Loader2, Mars, Venus } from 'lucide-react';
import { reportsAPI, claimsAPI, transformReport, getCategoryLabel } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ClaimActions from '../components/ClaimActions';
import BackButton from '../components/BackButton';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, currentUser, backendUser } = useAuth();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Determine who the "other person" is in the conversation
  const isFinder = userId === item?.finderId;
  const isClaimer = item?.claim && userId === item.claim?.claimerId;
  
  // Check if current user is opposite gender from the finder
  // Hide phone number from anyone of opposite gender (except the finder themselves)
  const isOppositeGender = !isFinder && backendUser?.gender && item?.finder?.gender && 
    backendUser.gender !== item.finder.gender;
  
  // Check if location requires meeting with finder
  const requiresMeeting = item?.destination === 'With Me (Self)';

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true, state: { from: `/item/${id}` } });
    }
  }, [currentUser, navigate, id]);

  // Fetch item from backend
  useEffect(() => {
    // Don't fetch if user is not logged in
    if (!currentUser) return;
    
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
  }, [id, currentUser]);

  // Loading state
  if (loading) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <div className="flex items-center gap-3">
          <Loader2 size={40} className="animate-spin text-green-600" strokeWidth={3} />
          <span className="text-xl font-semibold text-black">Loading item details...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !item) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex items-center justify-center" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-4">Item Not Found</h1>
          <p className="text-gray-700 mb-8 text-lg font-medium">{error || "The item you're looking for doesn't exist."}</p>
          <Link 
            to="/find"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-green-600 hover:text-black transition-all border-2 border-gray-300 shadow-lg hover:scale-105"
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
    <div className="pt-24 min-h-screen bg-gray-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-400 h-96 lg:h-125 flex items-center">
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
                        className="p-3 bg-white border-2 border-gray-400 rounded-full shadow-lg hover:bg-gray-100 hover:border-green-600 text-black transition-all hover:scale-110"
                      >
                        <ChevronLeft size={24} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="p-3 bg-white border-2 border-gray-400 rounded-full shadow-lg hover:bg-gray-100 hover:border-green-600 text-black transition-all hover:scale-110"
                      >
                        <ChevronRight size={24} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}

                  {/* Image Counter */}
                  {item.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black border-2 border-green-600 rounded-full text-white text-sm font-bold shadow-lg">
                      {currentImageIndex + 1} / {item.images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
                  <Tag size={48} className="mb-3" strokeWidth={2.5} />
                  <span className="text-xl font-semibold">No Image Available</span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <div className={`px-2 py-0.5 rounded-full text-sm font-bold border-2 shadow-lg ${
                  item.status === 'solved' 
                    ? 'bg-green-500 text-black border-black' 
                    : 'bg-amber-500 text-black border-black'
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
                        ? 'border-green-600 ring-2 ring-green-200' 
                        : 'border-gray-300 hover:border-green-600'
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
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border-2 border-gray-400">
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-2.5 py-1 rounded-full mb-3 w-fit">
                  <Tag size={14} strokeWidth={2.5} />
                  {getCategoryLabel(item.category)}
                </span>
                <h1 className="text-3xl font-bold text-black mb-2">{item.name}</h1>
                <div className="flex items-center gap-2 text-gray-800 text-md font-medium">
                  <Calendar size={16} strokeWidth={2.5} />
                  <span>Found {item.date}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-bold text-amber-600 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-gray-800 leading-relaxed font-medium">{item.description}</p>
                </div>

                <div className="pt-4 border-t-2 border-gray-400 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-600 rounded-lg text-black border-2 border-black mt-0.5">
                      <MapPin size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-md font-bold text-amber-600 uppercase tracking-wider mb-1">Current Location</div>
                      <div className="text-black font-semibold">{item.destination}</div>
                    </div>
                  </div>

                  {item.additionalInfo && (
                    <div className="bg-green-50 border-2 border-green-600 rounded-xl p-4">
                      <p className="text-sm text-black font-medium">{item.additionalInfo}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Finder Contact Card */}
            <div className="bg-white rounded-xl p-4 max-[400px]:p-2 sm:p-6 shadow-lg border-2 border-gray-400">
              {/* Gender Badge */}
              {item.finder.gender && (
                <div className="flex justify-end mb-2">
                  <div className="flex items-center gap-2 px-3 py-1 bg-black rounded-full text-sm text-white font-bold">
                    {item.finder.gender === 'MALE' ? <><Mars size={14} strokeWidth={2.5} /> Male</> : <><Venus size={14} strokeWidth={2.5} /> Female</>}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-gray-400">
                <div className="p-2.5 bg-green-600 border-2 border-black rounded-lg">
                  <User size={20} strokeWidth={2.5} className="text-black" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-black">Finder Information</h2>
                  <p className="text-sm font-medium text-gray-700">Reach out to claim this item</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-600 border-2 border-black rounded-lg">
                      <User size={18} strokeWidth={2.5} className="text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-lg text-black">{item.finder.name}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-600 border-2 border-black rounded-lg">
                      <Mail size={18} strokeWidth={2.5} className="text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a 
                        href={`mailto:${item.finder.email}`}
                        className="font-bold hover:underline block truncate text-md text-black hover:text-green-600"
                      >
                        {item.finder.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-600 border-2 border-black rounded-lg">
                      <Phone size={18} strokeWidth={2.5} className="text-black" />
                    </div>
                    <div>
                      {isOppositeGender ? (
                        <div className="font-bold text-black text-md">
                          🔒 Hidden (Opposite Gender)
                        </div>
                      ) : (
                        <a 
                          href={item.finder.phone ? `tel:${item.finder.phone}` : undefined}
                          className={item.finder.phone ? "font-bold hover:underline text-md text-black hover:text-green-600" : "font-bold text-md text-black"}
                        >
                          {item.finder.phone || 'Not Provided'}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Warning for opposite gender + meeting required */}
            {isOppositeGender && requiresMeeting && currentUser && (
              <div className="bg-white border-2 border-amber-500 rounded-xl p-5 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-100 rounded-full border-2 border-amber-500">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-black mb-2">
                      Important Notice
                    </h4>
                    <p className="text-md text-gray-800 leading-relaxed font-medium">
                      Please follow university guidelines regarding male–female interaction. 
                      Any violation of the policy may result in disciplinary action.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
              loading={actionLoading}              isOppositeGender={isOppositeGender}            />

            {/* Login prompt if not logged in */}
            {!currentUser && (
              <div className="bg-green-50 border-2 border-green-600 rounded-xl p-4 text-center">
                <p className="text-black font-semibold mb-3">Login to claim this item or report found items.</p>
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-green-600 hover:text-black transition-all border-2 border-gray-300 shadow-lg hover:scale-105"
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
