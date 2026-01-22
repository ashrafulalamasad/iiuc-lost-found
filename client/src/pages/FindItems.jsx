import { useState, useEffect } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import { reportsAPI, transformReports, FILTER_CATEGORIES } from '../services/api';
import BackButton from '../components/BackButton';

export default function FindItems() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Categories for filter (includes "All Categories" option)
  const categories = FILTER_CATEGORIES;

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await reportsAPI.getReports(selectedCategory === 'ALL' ? null : selectedCategory);
        
        // Backend returns { data: { reports: [...] } }
        if (response.data?.reports) {
          const transformedPosts = transformReports(response.data.reports);
          setPosts(transformedPosts);
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedCategory]);

  return (
    <div className="pt-24 min-h-screen bg-gray-50" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block sticky top-24 h-fit max-h-[calc(100vh-96px)] w-64 bg-white border-2 border-gray-400 rounded-xl p-5 overflow-y-auto shadow-lg">
            <div className="flex items-center gap-3 mb-5 pb-3 border-b-2 border-gray-400">
              <Filter size={24} className="text-green-600" strokeWidth={2.5} />
              <h2 className="font-bold text-2xl text-black tracking-tight">Filters</h2>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Categories</h3>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-md font-semibold transition-all duration-200 border-2 ${
                    selectedCategory === cat.value
                      ? 'bg-green-600 text-white border-2 border-black shadow-lg hover:scale-105 transform'
                      : 'text-black bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-green-600'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Feed */}
          <div className="flex-1">
            <div className="mb-8 flex items-start justify-between relative">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-3 tracking-tight">Lost Items</h1>
                <p className="text-gray-800 text-lg font-medium">Browse items found by others.</p>
              </div>
              
              <div className="relative md:hidden">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`p-3 border-2 rounded-xl shadow-lg transition-all duration-200 ${
                    isSidebarOpen 
                      ? 'bg-green-600 border-green-700 text-white scale-110 transform' 
                      : 'bg-white border-gray-300 text-black hover:bg-gray-100 hover:scale-105'
                  }`}
                  aria-label="Filters"
                >
                  <Filter size={24} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Mobile Dropdown (Full Width) */}
            {isSidebarOpen && (
              <div className="md:hidden relative mb-6 z-30">
                 <div 
                    className="fixed inset-0 z-30" 
                    onClick={() => setIsSidebarOpen(false)} 
                  />
                <div className="relative z-40 bg-white rounded-xl shadow-2xl border-2 border-gray-300 p-3 w-full animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-sm font-bold text-gray-700 uppercase tracking-wider px-2 py-2 border-b-2 border-gray-200 mb-2">
                    Filter by
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          setSelectedCategory(cat.value);
                          setIsSidebarOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 border-2 ${
                          selectedCategory === cat.value
                            ? 'bg-green-600 text-white border-green-700 shadow-lg'
                            : 'text-black bg-gray-100 border-gray-300 hover:bg-gray-200 hover:border-green-600'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={40} className="animate-spin text-green-600" strokeWidth={3} />
                <span className="ml-4 text-xl font-semibold text-black">Loading items...</span>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-20 bg-white rounded-xl border-2 border-red-400 p-8 shadow-xl">
                <p className="text-red-600 mb-6 text-xl font-semibold">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-green-600 hover:text-black transition-all duration-200 shadow-lg hover:scale-105 transform border-2 border-gray-300"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Posts Display */}
            {!loading && !error && (
              <>
                {posts.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {posts.map((post) => (
                      <Card key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white rounded-xl border-2 border-gray-300 p-12 shadow-lg">
                    <p className="text-gray-700 text-xl font-semibold">No items found in this category.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
