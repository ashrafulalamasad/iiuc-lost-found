import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, User, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { messagesAPI } from "../services/api";

const Inbox = () => {
  const { currentUser } = useAuth();
  const { refreshUnreadCount } = useSocket();
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInbox = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        const response = await messagesAPI.getInbox(currentUser.uid);
        if (response.status === "success") {
          setInbox(response.data.inbox);
        }
      } catch (err) {
        console.error("Failed to fetch inbox:", err);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, [currentUser]);

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes <= 1 ? "Just now" : `${diffMinutes}m`;
    }
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  // Truncate message for preview
  const truncateMessage = (text, maxLength = 40) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 pt-28 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 pt-28 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/profile"
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Inbox List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {inbox.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600">No messages yet</h3>
              <p className="text-gray-400 mt-2">
                When you start a conversation with someone about a claim, it will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {inbox.map((conversation) => (
                <Link
                  key={conversation.claimId}
                  to={`/chat/${conversation.claimId}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Profile Picture */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-blue-100 border-2 border-blue-200 overflow-hidden flex items-center justify-center">
                      {conversation.otherUser.profilePic ? (
                        <img
                          src={conversation.otherUser.profilePic}
                          alt={conversation.otherUser.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User size={24} className="text-blue-400" />
                      )}
                    </div>
                    {/* Unread badge */}
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`font-semibold truncate ${
                          conversation.unreadCount > 0 ? "text-gray-900" : "text-gray-700"
                        }`}
                      >
                        {conversation.otherUser.name}
                      </h3>
                      <span className="text-xs text-gray-400 shrink-0">
                        {formatTime(conversation.updatedAt)}
                      </span>
                    </div>

                    {/* Report Title */}
                    <p className="text-xs text-blue-600 truncate mb-1">
                      Re: {conversation.reportTitle}
                    </p>

                    {/* Message Preview */}
                    {conversation.unreadCount > 0 ? (
                      // Unread state - bright text
                      <p className="text-sm font-medium text-blue-600">
                        {conversation.unreadCount === 1
                          ? "1 new message"
                          : `${conversation.unreadCount} new messages`}
                      </p>
                    ) : (
                      // Read state - gray/dimmed text with message preview
                      <p className="text-sm text-gray-400 truncate">
                        {conversation.latestMessage?.isFromMe && (
                          <span className="text-gray-500">You: </span>
                        )}
                        {truncateMessage(conversation.latestMessage?.content || "No messages")}
                      </p>
                    )}
                  </div>

                  {/* Status indicator */}
                  <div className="shrink-0">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        conversation.claimStatus === "SOLVED"
                          ? "bg-green-100 text-green-700"
                          : conversation.claimStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {conversation.claimStatus}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
