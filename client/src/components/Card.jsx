import { MapPin, Phone, Tag, Clock, Eye } from 'lucide-react';
import Button from './Button_New';
import { getCategoryLabel } from '../services/api';

export default function Card({ post }) {
  // Get display label for category (handles both backend enum and display values)
  const categoryDisplay = getCategoryLabel(post.category) || post.category;
  
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-64 bg-slate-100 overflow-hidden">
        {post.images && post.images.length > 0 ? (
          <img
            src={post.images[0]}
            alt={post.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
            <Tag size={32} className="mb-2 opacity-50" />
            <span className="text-lg">No Image Available</span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
            post.status === 'solved' 
              ? 'bg-green-500/90 text-white' 
              : 'bg-amber-500/90 text-white'
          }`}>
            {post.status === 'solved' ? 'Solved' : 'Unsolved'}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col grow">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
              <Tag size={12} />
              {categoryDisplay}
            </span>
            <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {post.name || 'Unknown Item'}
            </h3>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed grow">
          {post.description}
        </p>

        <div className="pt-4 border-t border-slate-100">
          {/* Location, Time Info and View Details Button */}
          <div className="flex flex-col xl:flex-row xl:items-center gap-3">
            {/* Left side - Location and Time Info */}
            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-2.5 text-sm text-slate-600">
                <div className="p-1.5 bg-slate-100 rounded-full text-slate-500">
                  <MapPin size={14} />
                </div>
                <span className="truncate font-medium">{post.destination}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Clock size={14} />
                <span>{post.date}</span>
                {post.contact && (
                  <>
                    <span className="mx-1">•</span>
                    <Phone size={14} />
                    <span className="truncate max-w-[120px]">{post.contact}</span>
                  </>
                )}
              </div>
            </div>

            {/* View Details Button */}
            <div className="xl:w-auto">
              <Button
                to={`/item/${post.id}`}
                icon={Eye}
                bgColor="bg-green-600"
                textColor="text-white"
                hoverBgColor="bg-sky-400"
                hoverTextColor="text-black"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
