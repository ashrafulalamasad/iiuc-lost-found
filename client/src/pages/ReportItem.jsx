import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, PlusCircle } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { reportsAPI, CATEGORIES } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import BackButton from '../components/BackButton';

export default function ReportItem() {
  const navigate = useNavigate();
  const { userId, currentUser, backendUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    locationOther: '',
    contactInfo: '',
  });

  // Categories from backend enum (CATEGORIES already excludes ALL)
  const categories = CATEGORIES;
  
  // Predefined locations
  const predefinedLocations = [
    { value: 'With Me (Self)', label: 'With Me (Self)' },
    { value: 'C Building Office', label: 'C Building Office' },
    { value: 'CX Building Office', label: 'CX Building Office' },
    { value: 'Male Campus Security Box', label: 'Male Campus Security Box' },
    { value: 'Library Desk', label: 'Library Desk' },
    { value: 'Transport Office', label: 'Transport Office' },
    { value: 'Other', label: 'Other (Specify)' },
  ];
  
  // Check if phone is required
  const isPhoneRequired = formData.location === 'With Me (Self)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validation - check currentUser exists
    if (!currentUser) {
      setError('Please login to report an item.');
      return;
    }
    
    // Check if backend user is synced (userId comes from backendUser.id)
    if (!userId) {
      setError('Syncing with server... Please wait a moment and try again. If this persists, check if the backend server is running.');
      return;
    }
    
    // Validate phone number if required
    if (isPhoneRequired && !formData.contactInfo) {
      setError('Phone number is required when keeping the item with you.');
      return;
    }
    
    if (images.length > 4) {
      setError('Maximum 4 images allowed.');
      return;
    }
    
    // Determine final location value
    const finalLocation = formData.location === 'Other' 
      ? formData.locationOther 
      : formData.location;
    
    if (formData.location === 'Other' && !formData.locationOther) {
      setError('Please specify the location.');
      return;
    }

    setLoading(true);
    
    try {
      // Upload images to Cloudinary first
      const uploadedUrls = [];
      if (images.length > 0) {
        setError('Uploading images...');
        for (const img of images) {
          const url = await reportsAPI.uploadImage(img.base64);
          uploadedUrls.push(url);
        }
        setError(null);
      }
      
      await reportsAPI.createReport({
        finderId: userId,
        category: formData.category,
        title: formData.title || `${formData.category} Item`,
        description: formData.description,
        location: finalLocation,
        contactInfo: formData.contactInfo || null,
        images: uploadedUrls,
      });
      
      alert('Report submitted successfully!');
      navigate('/find');
    } catch (err) {
      console.error('Failed to submit report:', err);
      setError(err.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Redirect to login if not authenticated
  if (!currentUser) {
    return (
      <div className="pt-30 pb-12 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-400 p-8 text-center">
            <h1 className="text-2xl font-bold text-black mb-4">Login Required</h1>
            <p className="text-gray-600 mb-6 font-medium">You need to login with your university email to report a found item.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-green-600 text-black rounded-xl font-bold hover:bg-black hover:text-white transition-all border-2 border-gray-400 shadow-lg hover:shadow-xl"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-30 pb-12 min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 max-[400px]:px-2 sm:px-6 lg:px-8">
        <BackButton />
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-400 p-6 max-[400px]:p-4 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-black">Report Found Item</h1>
            <p className="text-gray-700 font-medium">Help return a lost item to its owner.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 text-red-700 font-bold shadow-lg">
                {error}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-md font-bold text-black mb-2">
                Item Images
              </label>
              <ImageUpload images={images} setImages={setImages} />
              <p className="text-sm text-gray-700 mt-1 font-medium">Upload clear photos of the found item</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-md font-bold text-black mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all font-medium bg-white shadow-sm hover:border-green-600 text-black"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="" disabled hidden>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Item Title/Name */}
              <div>
                <label className="block text-md font-bold text-black mb-2">
                  Item Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  placeholder="e.g. Blue Casio Calculator"
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all font-medium shadow-sm hover:border-green-600"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-md font-bold text-black mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                minLength={5}
                rows={4}
                placeholder="Describe the item (color, condition, unique marks, where you found it)..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all resize-none font-medium shadow-sm hover:border-green-600"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-md font-bold text-black mb-2">
                Where did you leave the item? <span className="text-red-500">*</span>
              </label>
              
              {/* Warning for opposite gender */}
              {backendUser?.gender && (
                <div className="mb-4 bg-amber-50 border-2 border-amber-400 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">⚠️</span>
                    <h4 className="text-md font-semibold text-amber-900">
                      Important Notice
                    </h4>
                  </div>
                  <p className="text-sm max-[400px]:text-xs text-amber-800 leading-relaxed">
                    If you found an item belonging to the <strong>opposite gender</strong>, please choose a <strong>designated location</strong> instead of keeping it with you. Any violation of university policy will result in <strong>strict disciplinary action</strong>.
                  </p>
                </div>
              )}
              
              {/* Radio button group */}
              <div className="space-y-2">
                {predefinedLocations.map((loc) => (
                  <label
                    key={loc.value}
                    className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all shadow-sm ${
                      formData.location === loc.value
                        ? 'border-green-600 bg-green-50 shadow-lg'
                        : 'border-gray-400 bg-white hover:border-green-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="location"
                      value={loc.value}
                      checked={formData.location === loc.value}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value, locationOther: '' })}
                      className="mr-3 w-4 h-4 accent-green-600"
                      required
                    />
                    <span className="text-sm font-bold text-black">{loc.label}</span>
                  </label>
                ))}
              </div>
              
              {/* Other location text input */}
              {formData.location === 'Other' && (
                <input
                  type="text"
                  required
                  minLength={2}
                  placeholder="Please specify the location"
                  className="mt-3 w-full px-4 py-2.5 rounded-xl border-2 border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all font-medium shadow-sm hover:border-green-600"
                  value={formData.locationOther}
                  onChange={(e) => setFormData({ ...formData, locationOther: e.target.value })}
                />
              )}
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-md font-bold text-black mb-2">
                Contact Information {isPhoneRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                required={isPhoneRequired}
                minLength={11}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none transition-all font-medium shadow-sm hover:border-green-600"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              />
              <p className="text-xs md:text-sm text-gray-700 mt-2 font-medium">
                {isPhoneRequired 
                  ? 'Phone number is required when keeping the item with you. It will be hidden from opposite gender users.' 
                  : 'Phone number is optional for designated locations. It will be hidden from opposite gender users if provided.'}
              </p>
            </div>

            <div className="text-center">
              <Button
                icon={PlusCircle}
                type="submit"
                disabled={loading}
                bgColor="bg-green-600"
                textColor="text-black"
                hoverBgColor="bg-black"
                hoverTextColor="group-hover/btn:text-white"
                className="cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={20} className="animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
