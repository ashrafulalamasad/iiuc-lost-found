import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user with backend
  const syncWithBackend = async (firebaseUser) => {
    try {
      console.log("Syncing user with backend:", firebaseUser.email);

      const response = await authAPI.syncUser({
        firebaseUid: firebaseUser.uid,
        fullName: firebaseUser.displayName || firebaseUser.email.split("@")[0],
        email: firebaseUser.email,
        profilePic: firebaseUser.photoURL,
      });

      console.log("Backend sync response:", response);

      // Handle the response - backend returns { status, data: { user } }
      const user = response?.data?.user || response?.user;
      if (user) {
        console.log("Backend user set:", user);
        setBackendUser(user);
        return user;
      } else {
        console.error("No user in response:", response);
      }
    } catch (error) {
      console.error("Failed to sync with backend:", error);
      // Don't throw - allow app to work even if backend sync fails
    }
    return null;
  };

  const login = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user.email.endsWith("@ugrad.iiuc.ac.bd")) {
      await signOut(auth);
      throw new Error("Only @ugrad.iiuc.ac.bd emails are allowed.");
    }

    await syncWithBackend(user);

    return user;
  };

  const logout = () => {
    setBackendUser(null);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!user.email.endsWith("@ugrad.iiuc.ac.bd")) {
          signOut(auth);
          setCurrentUser(null);
          setBackendUser(null);
        } else {
          setCurrentUser(user);
          await syncWithBackend(user);
        }
      } else {
        setCurrentUser(null);
        setBackendUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    backendUser, // Backend user with database ID
    userId: backendUser?.id, // Convenience: direct access to backend user ID
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
