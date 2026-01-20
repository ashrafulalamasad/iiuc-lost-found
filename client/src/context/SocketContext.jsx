import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const SocketProvider = ({ children }) => {
  const { currentUser, backendUser } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Connect socket when user is authenticated
  useEffect(() => {
    if (currentUser && backendUser) {
      const newSocket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });

      // Listen for inbox updates to this user
      newSocket.on(`inboxUpdate:${backendUser.id}`, (data) => {
        console.log("Inbox update received:", data);
        setUnreadCount((prev) => prev + 1);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      // Disconnect if user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setUnreadCount(0);
      }
    }
  }, [currentUser, backendUser]);

  // Fetch initial unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (currentUser?.uid) {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
          const response = await fetch(`${API_BASE_URL}/messages/unread/${currentUser.uid}`);
          const data = await response.json();
          if (data.status === "success") {
            setUnreadCount(data.data.unreadCount);
          }
        } catch (error) {
          console.error("Failed to fetch unread count:", error);
        }
      }
    };

    fetchUnreadCount();
  }, [currentUser]);

  // Join a claim room
  const joinClaim = (claimId) => {
    if (socket && isConnected) {
      socket.emit("joinClaim", claimId);
    }
  };

  // Leave a claim room
  const leaveClaim = (claimId) => {
    if (socket && isConnected) {
      socket.emit("leaveClaim", claimId);
    }
  };

  // Send a message via socket
  const sendMessage = (claimId, senderId, content) => {
    if (socket && isConnected) {
      socket.emit("sendMessage", { claimId, senderId, content });
    }
  };

  // Mark messages as read
  const markRead = (claimId, userId) => {
    if (socket && isConnected) {
      socket.emit("markRead", { claimId, userId });
    }
  };

  // Decrease unread count (when entering chat)
  const decreaseUnreadCount = (count) => {
    setUnreadCount((prev) => Math.max(0, prev - count));
  };

  // Refresh unread count
  const refreshUnreadCount = async () => {
    if (currentUser?.uid) {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const response = await fetch(`${API_BASE_URL}/messages/unread/${currentUser.uid}`);
        const data = await response.json();
        if (data.status === "success") {
          setUnreadCount(data.data.unreadCount);
        }
      } catch (error) {
        console.error("Failed to refresh unread count:", error);
      }
    }
  };

  const value = {
    socket,
    isConnected,
    unreadCount,
    joinClaim,
    leaveClaim,
    sendMessage,
    markRead,
    decreaseUnreadCount,
    refreshUnreadCount,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
