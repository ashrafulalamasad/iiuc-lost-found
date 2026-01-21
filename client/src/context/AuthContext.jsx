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
    }
    return null;
  };

  const login = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // ============ EMAIL RESTRICTION TOGGLE ============
    // Choose ONE block below - comment the other

    // -------- PRODUCTION MODE (IIUC emails only) --------

    if (!user.email.endsWith("@ugrad.iiuc.ac.bd")) {
      await signOut(auth);
      throw new Error("Only @ugrad.iiuc.ac.bd emails are allowed.");
    }

    // ----------------------------------------------------

    // -------- DEVELOPMENT MODE (all emails allowed) --------
    // No email restriction - all emails are allowed
    // -------------------------------------------------------

    // ==================================================

    const backendUserData = await syncWithBackend(user);
    console.log('Login completed, backend user:', backendUserData);

    return user;
  };

  const logout = () => {
    setBackendUser(null);
    return signOut(auth);
  };

  const refetchUser = async () => {
    if (currentUser) {
      await syncWithBackend(currentUser);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ============ EMAIL RESTRICTION TOGGLE ============
        // Choose ONE block below - comment the other

        // -------- PRODUCTION MODE (IIUC emails only) --------

        if (!user.email.endsWith("@ugrad.iiuc.ac.bd")) {
          signOut(auth);
          setCurrentUser(null);
          setBackendUser(null);
        } else {
          setCurrentUser(user);
          const backendUserData = await syncWithBackend(user);
          console.log('Auth state changed, backend user loaded:', backendUserData);
        }

        // ----------------------------------------------------

        // -------- DEVELOPMENT MODE (all emails allowed) --------
        setCurrentUser(user);
        const backendUserData = await syncWithBackend(user);
        console.log('Auth state changed, backend user loaded:', backendUserData);
        // -------------------------------------------------------

        // ==================================================
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
    backendUser,
    userId: backendUser?.id,
    login,
    logout,
    refetchUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
