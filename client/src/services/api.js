// API Service Layer - Connects frontend to backend

// In development, use Vite's proxy (/api) so it works from any device on the LAN.
// In production, use the configured VITE_API_URL.
const API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || '')
  : '/api';

// Helper function for API requests

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      // Log the full error response to see validation details
      console.error('Full API Error Response:', data);
      throw new Error(data.error || data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ==================== AUTH API ====================
export const authAPI = {
  // Sync user with backend after Firebase login
  syncUser: async (userData) => {
    // Build payload - only include profilePic if it's a valid string
    const payload = {
      firebaseUid: userData.firebaseUid,
      fullName: userData.fullName,
      email: userData.email,
    };
    
    // Only add profilePic if it's a non-empty string
    if (userData.profilePic && typeof userData.profilePic === 'string') {
      payload.profilePic = userData.profilePic;
    }
    
    return apiRequest('/auth', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Update user gender
  updateGender: async (userId, gender) => {
    return apiRequest('/users/gender', {
      method: 'PUT',
      body: JSON.stringify({ userId, gender }),
    });
  },

  // Get total user count
  getUserCount: async () => {
    return apiRequest('/users/count');
  },
};

// ==================== REPORTS API ====================
export const reportsAPI = {
  // Get all categories
  getCategories: async () => {
    return apiRequest('/categories');
  },

  // Get all reports with optional category filter
  getReports: async (category = null, page = 1, limit = 10, status = null) => {
    let query = `?page=${page}&limit=${limit}`;
    if (category && category !== 'ALL') {
      query += `&category=${category}`;
    }
    if (status && status !== 'ALL') {
      query += `&status=${status}`;
    }
    return apiRequest(`/reports${query}`);
  },

  // Get single report by ID
  getReportById: async (id) => {
    return apiRequest(`/reports/${id}`);
  },

  // Upload image to Cloudinary via backend
  uploadImage: async (base64Image) => {
    const response = await apiRequest('/upload-image', {
      method: 'POST',
      body: JSON.stringify({ image: base64Image }),
    });
    return response.data.url;
  },

  // Create new report
  createReport: async (reportData) => {
    return apiRequest('/report', {
      method: 'POST',
      body: JSON.stringify({
        finderId: reportData.finderId,
        category: reportData.category,
        title: reportData.title,
        description: reportData.description,
        location: reportData.location,
        contactInfo: reportData.contactInfo,
        images: reportData.images,
      }),
    });
  },

  // Get reports by user (firebase uid)
  getUserReports: async (odId) => {
    return apiRequest(`/reports/user/${odId}`);
  },
};

// ==================== CLAIMS API ====================
export const claimsAPI = {
  // Create a new claim
  createClaim: async (reportId, claimerId) => {
    return apiRequest('/claim', {
      method: 'POST',
      body: JSON.stringify({ reportId, claimerId }),
    });
  },

  // Cancel claim (by claimer)
  cancelClaim: async (claimId, claimerId) => {
    return apiRequest('/claim/cancel', {
      method: 'POST',
      body: JSON.stringify({ claimId, claimerId }),
    });
  },

  // Reject claim (by finder)
  rejectClaim: async (claimId, finderId) => {
    return apiRequest('/claim/reject', {
      method: 'POST',
      body: JSON.stringify({ claimId, finderId }),
    });
  },

  // Finder confirms handover
  confirmFinder: async (claimId) => {
    console.log('API confirmFinder called with claimId:', claimId);
    return apiRequest('/confirm/finder', {
      method: 'POST',
      body: JSON.stringify({ claimId }),
    });
  },

  // Owner confirms receipt
  confirmOwner: async (claimId) => {
    return apiRequest('/confirm/owner', {
      method: 'POST',
      body: JSON.stringify({ claimId }),
    });
  },

  // Get claims by user (firebase uid)
  getUserClaims: async (odId) => {
    return apiRequest(`/claims/user/${odId}`);
  },
};

// ==================== MESSAGES API ====================
export const messagesAPI = {
  // Get user's inbox (all conversations with messages)
  getInbox: async (odId) => {
    return apiRequest(`/messages/inbox/${odId}`);
  },

  // Get unread message count
  getUnreadCount: async (odId) => {
    return apiRequest(`/messages/unread/${odId}`);
  },

  // Get all messages for a specific claim
  getMessages: async (claimId, odId) => {
    return apiRequest(`/messages/${claimId}?odId=${odId}`);
  },

  // Send a new message (REST fallback)
  sendMessage: async (claimId, senderId, content) => {
    return apiRequest('/messages', {
      method: 'POST',
      body: JSON.stringify({ claimId, senderId, content }),
    });
  },

  // Mark messages as read
  markAsRead: async (claimId, userId) => {
    return apiRequest('/messages/read', {
      method: 'PUT',
      body: JSON.stringify({ claimId, userId }),
    });
  },
};

// ==================== DATA TRANSFORMERS ====================
// Transform backend report to frontend format
export const transformReport = (backendReport) => {
  return {
    id: backendReport.id,
    name: backendReport.title,
    category: backendReport.category,
    date: formatRelativeDate(backendReport.createdAt),
    description: backendReport.description,
    destination: backendReport.location,
    status: backendReport.status?.toLowerCase() || 'unsolved',
    images: backendReport.images || [],
    finder: backendReport.finder ? {
      name: backendReport.finder.fullName,
      email: backendReport.finder.email || 'Not provided',
      phone: (backendReport.contactInfo && backendReport.contactInfo !== backendReport.finder.email) 
        ? backendReport.contactInfo 
        : null,
      profilePic: backendReport.finder.profilePic,
      gender: backendReport.finder.gender,
    } : null,
    finderId: backendReport.finderId,
    contactInfo: backendReport.contactInfo,
    createdAt: backendReport.createdAt,
    claim: (() => {
      // Backend returns "claims" (plural array) from Prisma relation
      const claims = backendReport.claims || [];
      // Pick the most relevant claim: PENDING > SOLVED > first available (skip CANCELLED/REJECTED)
      const activeClaim = claims.find(c => c.status === 'PENDING') 
        || claims.find(c => c.status === 'SOLVED')
        || claims.find(c => c.status !== 'CANCELLED' && c.status !== 'REJECTED')
        || claims[0] || null;
      if (!activeClaim) return null;
      return {
        id: activeClaim.id,
        status: activeClaim.status,
        claimerId: activeClaim.claimerId,
        claimer: activeClaim.claimer ? {
          name: activeClaim.claimer.fullName,
          gender: activeClaim.claimer.gender,
        } : null,
        finderConfirmed: activeClaim.finderConfirmed,
        ownerConfirmed: activeClaim.ownerConfirmed,
        claimedAt: activeClaim.claimedAt,
      };
    })(),
  };
};

// Transform array of reports
export const transformReports = (backendReports) => {
  return backendReports.map(transformReport);
};

// Format date to relative format (Today, Yesterday, X days ago, X hours ago)
function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now - date;
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Less than 24 hours - show hours
  if (diffHours < 24) {
    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }

  // 24 hours or more - show days/weeks/months
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

// ==================== CATEGORY MAPPING ====================
// Backend enum values (exact match with backend CategoryType enum)
export const CategoryType = {
  DOCUMENTS: 'DOCUMENTS',
  ELECTRONICS: 'ELECTRONICS',
  BOOKS_AND_NOTES: 'BOOKS_AND_NOTES',
  ACCESSORIES: 'ACCESSORIES',
  STATIONERY: 'STATIONERY',
  OTHERS: 'OTHERS',
};

// Backend enum values to display labels
export const CATEGORY_MAP = {
  'DOCUMENTS': 'Documents',
  'ELECTRONICS': 'Electronics',
  'BOOKS_AND_NOTES': 'Books & Notes',
  'ACCESSORIES': 'Accessories',
  'STATIONERY': 'Stationery',
  'OTHERS': 'Others',
};

// Get category display label from backend value
export const getCategoryLabel = (backendValue) => {
  return CATEGORY_MAP[backendValue] || backendValue;
};

// Categories for filter dropdown (includes "All" option)
export const FILTER_CATEGORIES = [
  { value: 'ALL', label: 'All Categories' },
  ...Object.entries(CATEGORY_MAP).map(([value, label]) => ({ value, label })),
];

// Categories for form dropdown (no "All" option - exact backend enum)
export const CATEGORIES = Object.entries(CATEGORY_MAP).map(([value, label]) => ({
  value,
  label,
}));

export default {
  auth: authAPI,
  reports: reportsAPI,
  claims: claimsAPI,
};
