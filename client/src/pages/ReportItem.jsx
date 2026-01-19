import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, PlusCircle } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { reportsAPI, CATEGORIES } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function ReportItem() {
  const navigate = useNavigate();
  const { userId, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: '',
    contactInfo: '',
  });

  // Categories from backend enum (CATEGORIES already excludes ALL)
  const categories = CATEGORIES;

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
    
    if (images.length > 4) {
      setError('Maximum 4 images allowed.');
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
        location: formData.location,
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
      <div className="pt-30 pb-12 min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-4">Login Required</h1>
            <p className="text-slate-600 mb-6">You need to login with your university email to report a found item.</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-30 pb-12 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-2xl font-bold text-black hover:text-blue-700 mb-6 transition-colors group"
        >
          <ArrowLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Report Found Item</h1>
            <p className="text-slate-500">Help return a lost item to its owner.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
                {error}
              </div>
            )}

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Item Images
              </label>
              <ImageUpload images={images} setImages={setImages} />
              <p className="text-xs text-slate-500 mt-1">Upload clear photos of the found item</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Item Title/Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Item Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  placeholder="e.g. Blue Casio Calculator"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                minLength={5}
                rows={4}
                placeholder="Describe the item (color, condition, unique marks, where you found it)..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Where did you leave it? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                minLength={2}
                placeholder="e.g. Library Desk, C building office, or 'With Me'"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Contact Information
              </label>
              <input
                type="text"
                minLength={11}
                placeholder="A valid phone number"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              />
              <p className="text-xs md:text-sm text-slate-500 mt-2">This will be visible to users who want to claim the item. Leave it blank if item is not with you.</p>
            </div>

            {/* <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 mx-auto flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold hover:bg-green-600 hover:text-black transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </button> */}
            <div className="text-center">
              <Button
                icon={PlusCircle}
                type="submit"
                disabled={loading}
                bgColor="bg-blue-600"
                textColor="text-white"
                hoverBgColor="bg-green-600"
                hoverTextColor="group-hover/btn:text-black"
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
