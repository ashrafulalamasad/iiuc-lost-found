import { useState, useEffect } from 'react';
import { Filter, Loader2 } from 'lucide-react';
import Card from '../components/Card';
import { reportsAPI, transformReports, FILTER_CATEGORIES } from '../services/api';
import BackButton from '../components/BackButton';

export default function FindItems() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;

  // Categories for filter (includes "All Categories" option)
  const categories = FILTER_CATEGORIES;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedStatus]);

  // Fetch reports from backend
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await reportsAPI.getReports(
          selectedCategory === 'ALL' ? null : selectedCategory,
          currentPage,
          itemsPerPage,
          selectedStatus === 'ALL' ? null : selectedStatus
        );
        
        // Backend returns { data: { reports: [...], pagination: {...} } }
        if (response.data?.reports) {
          const transformedPosts = transformReports(response.data.reports);
          setPosts(transformedPosts);
          
          // Update pagination metadata
          if (response.data?.pagination) {
            setTotalPages(response.data.pagination.totalPages);
            setTotalCount(response.data.pagination.totalCount);
          }
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('Failed to load items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [selectedCategory, selectedStatus, currentPage]);

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
                    setCurrentPage(1);
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
                <p className="text-gray-800 text-lg font-medium mb-4">Browse items found by others.</p>
                
                {/* Status Filter Buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => {
                      setSelectedStatus('ALL');
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 max-[400px]:px-2.5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer border-2 text-sm sm:text-base ${
                      selectedStatus === 'ALL'
                        ? 'bg-green-600 text-white border-black scale-105'
                        : 'bg-white text-black hover:bg-gray-100 border-gray-400 hover:border-green-600'
                    }`}
                  >
                    All Items
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus('SOLVED');
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 max-[400px]:px-2.5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer border-2 text-sm sm:text-base ${
                      selectedStatus === 'SOLVED'
                        ? 'bg-green-600 text-white border-black scale-105'
                        : 'bg-white text-black hover:bg-gray-100 border-gray-400 hover:border-green-600'
                    }`}
                  >
                    Solved
                  </button>
                  <button
                    onClick={() => {
                      setSelectedStatus('UNSOLVED');
                      setCurrentPage(1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`px-4 max-[400px]:px-2.5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer border-2 text-sm sm:text-base ${
                      selectedStatus === 'UNSOLVED'
                        ? 'bg-amber-500 text-black border-black scale-105'
                        : 'bg-white text-black hover:bg-gray-100 border-gray-400 hover:border-amber-500'
                    }`}
                  >
                    Unsolved
                  </button>
                </div>
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
                          setCurrentPage(1);
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
                  <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {posts.map((post) => (
                        <Card key={post.id} post={post} />
                      ))}
                    </div>
                    
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="mt-12 mb-8">
                        <div className="flex flex-col items-center gap-4">
                          {/* Page info */}
                          <div className="text-center">
                            <p className="text-sm sm:text-base font-semibold text-gray-600">
                              Page <span className="text-green-600 font-bold">{currentPage}</span> of{' '}
                              <span className="text-green-600 font-bold">{totalPages}</span>
                              <span className="mx-2">•</span>
                              <span className="text-gray-700">{totalCount} total items</span>
                            </p>
                          </div>
                          
                          {/* Pagination buttons */}
                          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                            {/* Previous button */}
                            <button
                              onClick={() => {
                                setCurrentPage(prev => Math.max(1, prev - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              disabled={currentPage === 1}
                              className={`px-3 max-[400px]:px-2 sm:px-4 py-2 max-[400px]:py-1.5 sm:py-2.5 rounded-lg font-bold transition-all duration-200 border-2 text-xs sm:text-sm ${
                                currentPage === 1
                                  ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                  : 'bg-white text-black border-gray-400 hover:bg-green-600 hover:text-white hover:border-black hover:scale-105 hover:shadow-lg cursor-pointer'
                              }`}
                            >
                              Previous
                            </button>
                            
                            {/* Page numbers */}
                            {(() => {
                              const pages = [];
                              const maxVisible = 5; // Show max 5 page numbers at once
                              
                              if (totalPages <= maxVisible) {
                                // Show all pages if total is less than max
                                for (let i = 1; i <= totalPages; i++) {
                                  pages.push(i);
                                }
                              } else {
                                // Show first, last, current, and nearby pages with ellipsis
                                if (currentPage <= 3) {
                                  // Near start
                                  for (let i = 1; i <= 4; i++) pages.push(i);
                                  pages.push('...');
                                  pages.push(totalPages);
                                } else if (currentPage >= totalPages - 2) {
                                  // Near end
                                  pages.push(1);
                                  pages.push('...');
                                  for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
                                } else {
                                  // Middle
                                  pages.push(1);
                                  pages.push('...');
                                  pages.push(currentPage - 1);
                                  pages.push(currentPage);
                                  pages.push(currentPage + 1);
                                  pages.push('...');
                                  pages.push(totalPages);
                                }
                              }
                              
                              return pages.map((page, idx) => {
                                if (page === '...') {
                                  return (
                                    <span 
                                      key={`ellipsis-${idx}`} 
                                      className="px-2 max-[400px]:px-1 text-gray-500 font-bold"
                                    >
                                      ...
                                    </span>
                                  );
                                }
                                
                                return (
                                  <button
                                    key={page}
                                    onClick={() => {
                                      setCurrentPage(page);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`min-w-9 max-[400px]:min-w-7 sm:min-w-10 px-3 max-[400px]:px-2 sm:px-4 py-2 max-[400px]:py-1.5 sm:py-2.5 rounded-lg font-bold transition-all duration-200 border-2 text-xs sm:text-sm ${
                                      currentPage === page
                                        ? 'bg-green-600 text-white border-black scale-110 shadow-xl'
                                        : 'bg-white text-black border-gray-400 hover:bg-gray-100 hover:border-green-600 hover:scale-105 hover:shadow-lg cursor-pointer'
                                    }`}
                                  >
                                    {page}
                                  </button>
                                );
                              });
                            })()}
                            
                            {/* Next button */}
                            <button
                              onClick={() => {
                                setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              disabled={currentPage === totalPages}
                              className={`px-3 max-[400px]:px-2 sm:px-4 py-2 max-[400px]:py-1.5 sm:py-2.5 rounded-lg font-bold transition-all duration-200 border-2 text-xs sm:text-sm ${
                                currentPage === totalPages
                                  ? 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                  : 'bg-white text-black border-gray-400 hover:bg-green-600 hover:text-white hover:border-black hover:scale-105 hover:shadow-lg cursor-pointer'
                              }`}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
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
