import { MapPin, Phone, Tag, Clock, Eye } from 'lucide-react';
import Button from './Button';
import { getCategoryLabel } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Card({ post }) {
  const { currentUser } = useAuth();
  
  // Get display label for category (handles both backend enum and display values)
  const categoryDisplay = getCategoryLabel(post.category) || post.category;
  
  return (
    <div className="group bg-white rounded-xl border-2 border-gray-400 overflow-hidden hover:shadow-2xl hover:border-green-600 transition-all duration-200 flex flex-col h-full" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Image Section */}
      <div className="relative h-64 bg-gray-100 overflow-hidden border-b-2 border-gray-300">
        {post.images && post.images.length > 0 ? (
          <img
            src={post.images[0]}
            alt={post.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 bg-gray-100">
            <Tag size={36} className="mb-2" strokeWidth={2.5} />
            <span className="text-xl font-semibold">No Image Available</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex gap-2">
          <div className={`px-2 py-0.5 rounded-full text-sm font-bold border-2 shadow-lg ${
            post.status === 'solved' 
              ? 'bg-green-500 text-black border-black' 
              : 'bg-amber-500 text-black border-black'
          }`}>
            {post.status === 'solved' ? 'Solved' : 'Unsolved'}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col grow">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-white bg-black px-2.5 py-1 rounded-full w-fit">
              <Tag size={14} strokeWidth={2.5} />
              {categoryDisplay}
            </span>
            <h3 className="font-bold text-xl text-black line-clamp-1 group-hover:text-green-700 transition-colors">
              {post.name || 'Unknown Item'}
            </h3>
          </div>
        </div>

        <p className="text-gray-800 text-md mb-4 line-clamp-2 leading-relaxed grow font-medium">
          {post.description}
        </p>

        <div className="pt-3 border-t-2 border-gray-400 group-hover:border-green-600 mt-auto">
          <div className="flex gap-4 flex-col min-[500px]:flex-row min-[500px]:items-center md:flex-col md:items-stretch">
            
            {/* Text Section (Left Aligned) */}
            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 text-md text-black">
                <div className="p-2 bg-green-600 rounded-lg text-black border-2 border-black">
                  <MapPin size={16} strokeWidth={2.5} />
                </div>
                <span className="truncate font-semibold">{post.destination}</span>
              </div>
              
              <div className="flex items-center gap-2 text-md text-gray-800 font-medium">
                <Clock size={16} strokeWidth={2.5} />
                <span>{post.date}</span>
                {post.contact && (
                  <>
                    <span className="mx-1">•</span>
                    <Phone size={16} strokeWidth={2.5} />
                    <span className="truncate max-w-[120px]">{post.contact}</span>
                  </>
                )}
              </div>
            </div>
            {/* Button Section (Right Aligned) */}
            <div className="flex justify-end w-full min-[500px]:w-auto md:w-full">
              <Button
                to={currentUser ? `/item/${post.id}` : '/login'}
                icon={Eye}
                bgColor="bg-green-600"
                textColor="text-black"
                hoverBgColor="bg-black"
                hoverTextColor="group-hover/btn:text-white"
                className="shadow-md border-2 border-black"
              >
                {currentUser ? 'View Details' : 'Login to View'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
