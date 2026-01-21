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
  const inputRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      setMessages((prev) => [...prev, message]);
      
      // Mark as read if it's from the other person
      if (message.senderId !== backendUser?.id && backendUser?.id) {
        messagesAPI.markAsRead(claimId, backendUser.id);
        markRead(claimId, backendUser.id);
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

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 pt-28 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 pt-28 pb-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
          <Link to="/inbox" className="mt-4 inline-block text-blue-600 hover:underline">
            ← Back to Inbox
          </Link>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 pt-24 pb-4 flex flex-col">
      <div className="max-w-2xl mx-auto px-4 flex flex-col flex-1 w-full">
        {/* Chat Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-4 flex items-center gap-4">
          <Link
            to="/inbox"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>

          <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-200 overflow-hidden flex items-center justify-center">
            {chatInfo?.otherUser?.profilePic ? (
              <img
                src={chatInfo.otherUser.profilePic}
                alt={chatInfo.otherUser.fullName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User size={20} className="text-blue-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-800 truncate">
              {chatInfo?.otherUser?.fullName}
            </h2>
            <p className="text-xs text-blue-600 truncate">
              Re: {chatInfo?.claim?.reportTitle}
            </p>
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full ${
              chatInfo?.claim?.status === "SOLVED"
                ? "bg-green-100 text-green-700"
                : chatInfo?.claim?.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {chatInfo?.claim?.status}
          </span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-white shadow-lg overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[calc(100vh-280px)]">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 text-center">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center justify-center my-4">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
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
                        className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                          isMe
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-gray-100 text-gray-800 rounded-bl-md"
                        }`}
                      >
                        <p className="wrap-break-word">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isMe ? "text-blue-200" : "text-gray-400"
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
          className="bg-white rounded-b-2xl shadow-lg p-4 flex items-center gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className={`p-3 rounded-full transition-colors ${
              newMessage.trim() && !sending
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
