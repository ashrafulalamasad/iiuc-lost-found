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
      <div className="min-h-screen bg-linear-to-br from-neutral-50 via-stone-50 to-zinc-100 pt-28 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-800"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-stone-50 to-zinc-100 pt-28 pb-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6" >
            <BackButton />
        </div>
        <div className="flex items-center gap-4 mb-6">
          {/* <Link
            to="/profile"
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link> */}
          <h1 className="text-2xl font-bold text-neutral-800">Messages</h1>
        </div>

        {error && (
          <div className="bg-rose-50 border border-neutral-300 text-rose-700 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Inbox List */}
        <div className="bg-white rounded-2xl shadow-md border border-neutral-300 overflow-hidden">
          {inbox.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle size={48} className="mx-auto text-neutral-300 mb-4" />
              <h3 className="text-lg font-medium text-neutral-600">No messages yet</h3>
              <p className="text-neutral-400 mt-2">
                When you start a conversation with someone about a claim, it will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {inbox.map((conversation) => (
                <Link
                  key={conversation.claimId}
                  to={`/chat/${conversation.claimId}`}
                  className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors"
                >
                  {/* Profile Picture */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-300 overflow-hidden flex items-center justify-center">
                      {conversation.otherUser.profilePic ? (
                        <img
                          src={conversation.otherUser.profilePic}
                          alt={conversation.otherUser.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <User size={24} className="text-neutral-500" />
                      )}
                    </div>
                    {/* Unread badge */}
                    {conversation.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-800 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                      </span>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`font-semibold truncate ${
                          conversation.unreadCount > 0 ? "text-neutral-900" : "text-neutral-700"
                        }`}
                      >
                        {conversation.otherUser.name}
                      </h3>
                      <span className="text-xs text-neutral-500 shrink-0">
                        {formatTime(conversation.updatedAt)}
                      </span>
                    </div>

                    {/* Report Title */}
                    <p className="text-xs text-neutral-500 truncate mb-1">
                      Re: {conversation.reportTitle}
                    </p>

                    {/* Message Preview */}
                    {conversation.unreadCount > 0 ? (
                      // Unread state - bright text
                      <p className="text-sm font-medium text-neutral-800">
                        {conversation.unreadCount === 1
                          ? "1 new message"
                          : `${conversation.unreadCount} new messages`}
                      </p>
                    ) : (
                      // Read state - gray/dimmed text with message preview
                      <p className="text-sm text-neutral-400 truncate">
                        {conversation.latestMessage?.isFromMe && (
                          <span className="text-neutral-500">You: </span>
                        )}
                        {truncateMessage(conversation.latestMessage?.content || "No messages")}
                      </p>
                    )}
                  </div>

                  {/* Status indicator */}
                  <div className="shrink-0">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        conversation.claimStatus === "SOLVED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : conversation.claimStatus === "PENDING"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-neutral-100 text-neutral-600 border-neutral-300"
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
