import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Send, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import { messagesAPI } from "../services/api";

const Chat = () => {
  const { claimId } = useParams();
  const { currentUser, backendUser } = useAuth();
  const { socket, isConnected, joinClaim, leaveClaim, markRead, refreshUnreadCount } = useSocket();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const isInitialLoad = useRef(true);

  // Scroll to bottom of messages container (not the whole page)
  const scrollToBottom = (instant = false) => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Fetch messages and join socket room
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser?.uid || !claimId) return;

      try {
        setLoading(true);
        const response = await messagesAPI.getMessages(claimId, currentUser.uid);
        if (response.status === "success") {
          setMessages(response.data.messages);
          setChatInfo({
            claim: response.data.claim,
            otherUser: response.data.otherUser,
            myRole: response.data.myRole,
          });

          // Mark messages as read
          if (backendUser?.id) {
            await messagesAPI.markAsRead(claimId, backendUser.id);
            markRead(claimId, backendUser.id);
            refreshUnreadCount();
          }
          
          // Scroll to bottom after loading messages
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError("Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Join socket room
    if (claimId) {
      joinClaim(claimId);
    }

    return () => {
      if (claimId) {
        leaveClaim(claimId);
      }
    };
  }, [currentUser, backendUser, claimId]);

  // Listen for new messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      // Only add message if it belongs to this claim
      if (message.claimId === claimId) {
        setMessages((prev) => [...prev, message]);
        
        // Auto-scroll to bottom when new message arrives
        setTimeout(() => {
          scrollToBottom();
        }, 100);
        
        // Mark as read if it's from the other person and refresh global count
        if (message.senderId !== backendUser?.id && backendUser?.id) {
          messagesAPI.markAsRead(claimId, backendUser.id).then(() => {
            refreshUnreadCount(); // Refresh the navbar counter
          });
          markRead(claimId, backendUser.id);
        }
      }
    };

    const handleMessagesRead = ({ claimId: readClaimId, readBy }) => {
      if (readClaimId === claimId && readBy !== backendUser?.id) {
        // Other user read our messages - could update UI to show "seen"
        console.log("Messages read by other user");
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messagesRead", handleMessagesRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesRead", handleMessagesRead);
    };
  }, [socket, claimId, backendUser]);

  // Scroll to bottom when new messages arrive (not on initial load)
  // Removed auto-scroll - users can scroll manually

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !backendUser?.id || sending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setSending(true);

    try {
      // Use socket for real-time, fallback to REST
      if (socket && isConnected) {
        socket.emit("sendMessage", {
          claimId,
          senderId: backendUser.id,
          content,
        });
      } else {
        const response = await messagesAPI.sendMessage(claimId, backendUser.id, content);
        if (response.status === "success") {
          setMessages((prev) => [...prev, response.data.message]);
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setNewMessage(content); // Restore message on error
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  // Format time for message timestamp
  const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Group messages by date
  const groupMessagesByDate = (messages) => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });
    return groups;
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-28 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-red-50 border-2 border-red-500 text-red-700 px-4 py-3 rounded-xl font-bold shadow-lg">
            {error}
          </div>
          <Link to="/inbox" className="mt-4 inline-block text-black hover:text-green-600 hover:underline font-bold">
            ← Back to Inbox
          </Link>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-4 flex flex-col">
      <div className="max-w-2xl mx-auto px-4 flex flex-col flex-1 w-full">
        {/* Chat Header */}
        <div className="bg-white rounded-t-xl shadow-lg border-2 border-gray-400 p-4 flex items-center gap-4">
          <Link
            to="/inbox"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors border-2 border-gray-400 hover:border-green-600"
          >
            <ArrowLeft size={20} className="text-black" strokeWidth={2.5} />
          </Link>

          <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-400 overflow-hidden flex items-center justify-center">
            {chatInfo?.otherUser?.profilePic ? (
              <img
                src={chatInfo.otherUser.profilePic}
                alt={chatInfo.otherUser.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User size={20} className="text-gray-600" strokeWidth={2.5} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-black truncate">
              {chatInfo?.otherUser?.fullName}
            </h2>
            <p className="text-xs text-gray-600 truncate font-medium">
              Re: {chatInfo?.claim?.reportTitle}
            </p>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full border-2 font-bold ${
              chatInfo?.claim?.status === "SOLVED"
                ? "bg-emerald-50 text-emerald-700 border-emerald-600"
                : chatInfo?.claim?.status === "PENDING"
                ? "bg-amber-50 text-amber-700 border-amber-500"
                : "bg-gray-100 text-black border-gray-400"
            }`}
          >
            {chatInfo?.claim?.status}
          </span>
        </div>

        {/* Messages Area */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 bg-white shadow-lg border-x-2 border-gray-400 overflow-y-auto p-4 space-y-4 min-h-100 max-h-[calc(100vh-280px)]"
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-center font-medium">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center justify-center my-4">
                  <span className="text-xs text-gray-600 bg-gray-100 border-2 border-gray-300 px-3 py-1 rounded-full font-bold">
                    {formatDateHeader(date)}
                  </span>
                </div>

                {/* Messages for this date */}
                {dateMessages.map((message) => {
                  const isMe = message.senderId === backendUser?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-xl border-2 ${
                          isMe
                            ? "bg-black text-white border-gray-400 rounded-br-md shadow-md"
                            : "bg-gray-50 text-black border-gray-400 rounded-bl-md shadow-sm"
                        }`}
                      >
                        <p className="wrap-break-word font-medium">{message.content}</p>
                        <p
                          className={`text-xs mt-1 font-medium ${
                            isMe ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {formatMessageTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSend}
          className="bg-white rounded-b-xl shadow-lg border-2 border-gray-400 p-4 flex items-center gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-50 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent font-medium hover:border-green-600 transition-all"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`p-3 rounded-xl transition-all border-2 shadow-lg ${
              newMessage.trim() && !sending
                ? "bg-green-600 text-black hover:bg-black hover:text-white border-gray-400 hover:shadow-xl"
                : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
            }`}
          >
            <Send size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
