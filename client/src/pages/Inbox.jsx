import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, User, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { messagesAPI } from "../services/api";
import BackButton from '../components/BackButton';

const Inbox = () => {
  const { currentUser, backendUser } = useAuth();
  const { socket, refreshUnreadCount } = useSocket();
  const [inbox, setInbox] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch inbox on mount
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

  // Listen for real-time updates via socket
  useEffect(() => {
    if (!socket || !backendUser?.id) return;

    // Listen for inbox updates - this fires when someone sends you a message
    // and you're NOT in that specific chat room
    const handleInboxUpdate = ({ claimId: msgClaimId, message }) => {
      setInbox((prevInbox) => {
        const existingIndex = prevInbox.findIndex(
          (conv) => conv.claimId === msgClaimId
        );

        if (existingIndex !== -1) {
          // Update existing conversation
          const updated = [...prevInbox];
          const conv = { ...updated[existingIndex] };
          
          // Increment unread count (message is always from someone else via inboxUpdate)
          conv.unreadCount = (conv.unreadCount || 0) + 1;
          
          conv.latestMessage = {
            content: message.content,
            isFromMe: false,
          };
          conv.updatedAt = message.createdAt;
          
          // Move to top
          updated.splice(existingIndex, 1);
          return [conv, ...updated];
        }
        
        // New conversation - refetch to get full data
        messagesAPI.getInbox(currentUser.uid).then((response) => {
          if (response.status === "success") {
            setInbox(response.data.inbox);
          }
        });
        
        return prevInbox;
      });
    };

    // Listen for newMessage - only fires if you're in a claim room (e.g., just left chat)
    const handleNewMessage = (message) => {
      // This handles the case where you might still be in a claim room briefly
      setInbox((prevInbox) => {
        const existingIndex = prevInbox.findIndex(
          (conv) => conv.claimId === message.claimId
        );

        if (existingIndex !== -1) {
          const updated = [...prevInbox];
          const conv = { ...updated[existingIndex] };
          
          // Only increment unread if message is from someone else
          if (message.senderId !== backendUser.id) {
            conv.unreadCount = (conv.unreadCount || 0) + 1;
          }
          
          conv.latestMessage = {
            content: message.content,
            isFromMe: message.senderId === backendUser.id,
          };
          conv.updatedAt = message.createdAt;
          
          updated.splice(existingIndex, 1);
          return [conv, ...updated];
        }
        
        return prevInbox;
      });
    };

    const handleMessagesRead = ({ claimId, readBy }) => {
      if (readBy !== backendUser.id) {
        refreshUnreadCount();
      }
    };

    // Listen to user-specific inbox updates (primary way to get updates when on Inbox page)
    socket.on(`inboxUpdate:${backendUser.id}`, handleInboxUpdate);
    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off(`inboxUpdate:${backendUser.id}`, handleInboxUpdate);
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, backendUser, currentUser, refreshUnreadCount]);

  // Format time for display
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return diffMinutes < 1 ? "Now" : diffMinutes < 2 ? `1m ago` : `${diffMinutes}m ago`;
    }
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
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
      <div className="min-h-screen bg-gray-50 pt-28 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10">
      <div className="max-w-3xl mx-auto px-4 max-[400px]:px-2 h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="mb-2 shrink-0">
            <BackButton />
        </div>
        <div className="flex items-center gap-4 mb-6 shrink-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">Messages</h1>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-4 shrink-0 font-bold shadow-lg">
            {error}
          </div>
        )}

        {/* Inbox List - Scrollable Container */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-400 overflow-hidden flex-1 flex flex-col min-h-0">
          {inbox.length === 0 ? (
            <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
              <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" strokeWidth={2.5} />
              <h3 className="text-lg font-bold text-black">No messages yet</h3>
              <p className="text-gray-600 mt-2 font-medium">
                When you start a conversation with someone about a claim, it will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1 p-1 space-y-2 bg-gray-50">
              {inbox.map((conversation) => (
                <Link
                  key={conversation.claimId}
                  to={`/chat/${conversation.claimId}`}
                  className="relative flex items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl border-2 border-gray-400 hover:border-green-600 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  {/* Status indicator and Time - Top Right */}
                  <div className="absolute top-3 right-3 flex flex-col items-end gap-6">
                    <span
                      className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border-2 font-semibold ${
                        conversation.claimStatus === "SOLVED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-600"
                          : conversation.claimStatus === "PENDING"
                          ? "bg-amber-50 text-amber-700 border-amber-600"
                          : "bg-neutral-100 text-neutral-700 border-neutral-600"
                      }`}
                    >
                      {conversation.claimStatus}
                    </span>
                    <span className="absolute top-12 sm:top-14 right-1 text-xs sm:text-sm text-black font-medium whitespace-nowrap">
                      {formatTime(conversation.updatedAt)}
                    </span>
                  </div>

                  {/* Profile Picture */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-100 border-2 border-gray-400 overflow-hidden flex items-center justify-center shadow-sm">
                      {conversation.otherUser.profilePic ? (
                        <img
                          src={conversation.otherUser.profilePic}
                          alt={conversation.otherUser.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User size={20} className="text-gray-600 sm:w-6 sm:h-6" strokeWidth={2.5} />
                      )}
                    </div>
                    {/* Unread badge */}
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-green-600 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0 pr-16">
                    {/* Name - Always visible */}
                    <h3
                      className={`font-bold truncate text-base sm:text-lg mb-1 ${
                        conversation.unreadCount > 0 ? "text-black" : "text-gray-700"
                      }`}
                    >
                      {conversation.otherUser.name}
                    </h3>

                    {/* Report Title */}
                    <p className="text-xs sm:text-sm text-gray-600 truncate mb-1.5 font-medium">
                      Re: {conversation.reportTitle}
                    </p>

                    {/* Message Preview */}
                    {conversation.unreadCount > 0 ? (
                      // Unread state - bright text
                      <p className="text-xs sm:text-sm font-bold text-black truncate">
                        {conversation.unreadCount === 1
                          ? "1 new message"
                          : `${conversation.unreadCount} new messages`}
                      </p>
                    ) : (
                      // Read state - gray/dimmed text with message preview
                      <p className="text-xs sm:text-sm text-gray-500 truncate font-medium">
                        {conversation.latestMessage?.isFromMe && (
                          <span className="text-gray-600">You: </span>
                        )}
                        {truncateMessage(conversation.latestMessage?.content || "No messages")}
                      </p>
                    )}
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
