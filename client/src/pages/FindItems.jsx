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
    <div className="pt-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar (Desktop) */}
          <aside className="hidden md:block sticky top-24 h-fit max-h-[calc(100vh-96px)] w-64 bg-white border border-slate-200 rounded-2xl p-6 overflow-y-auto shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Filter size={20} className="text-blue-600" />
              <h2 className="font-bold text-slate-900">Filters</h2>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</h3>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    setSelectedCategory(cat.value);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Feed */}
          <div className="flex-1">
            <div className="mb-6 flex items-start justify-between relative">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Lost Items</h1>
                <p className="text-slate-500">Browse items found by others.</p>
              </div>
              
              <div className="relative md:hidden">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className={`p-2 border rounded-xl shadow-sm transition-colors ${
                    isSidebarOpen 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  aria-label="Filters"
                >
                  <Filter size={20} />
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
                <div className="relative z-40 bg-white rounded-xl shadow-xl border border-slate-100 p-2 w-full animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
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
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === cat.value
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-slate-600 hover:bg-slate-50'
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
                <Loader2 size={32} className="animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Loading items...</span>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  <div className="text-center py-20">
                    <p className="text-slate-500">No items found in this category.</p>
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
