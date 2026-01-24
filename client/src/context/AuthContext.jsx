import { createContext, useContext, useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth, signInWithGoogle, handleRedirectResult } from "../firebase";
import { authAPI } from "../services/api";
import LoadingScreen from "../components/LoadingScreen";
import "../loading-screen.css";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Brief fade-out so the loading screen doesn't snap away
  const [loaderExiting, setLoaderExiting] = useState(false);

  // Minimum time the loading screen stays visible, even if auth + backend
  // resolve instantly, so users actually get to see the animation.
  const MIN_LOAD_MS = 3000;

  // Hard cap: never let the loading screen hang forever if the backend is
  // slow or unreachable. Auth may still resolve afterwards and update state.
  const MAX_LOAD_MS = 4000;

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
    const result = await signInWithGoogle();
    // On mobile, signInWithRedirect returns null (page redirects)
    if (!result) return null;
    const user = result.user;

    // ============ EMAIL RESTRICTION TOGGLE ============
    // Choose ONE block below - comment the other

    // -------- PRODUCTION MODE (IIUC emails only) --------

    // if (!user.email.endsWith("@ugrad.iiuc.ac.bd")) {
    //   await signOut(auth);
    //   throw new Error("Only @ugrad.iiuc.ac.bd emails are allowed.");
    // }

    // ----------------------------------------------------

    // -------- DEVELOPMENT MODE (all emails allowed) --------
    // No email restriction - all emails are allowed
    // -------------------------------------------------------

    // ==================================================

    const backendUserData = await syncWithBackend(user);
    console.log("Login completed, backend user:", backendUserData);

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

  // Handle redirect result on page load (for production mobile redirect fallback)
  useEffect(() => {
    if (window.location.protocol === "https:") {
      handleRedirectResult().catch((error) => {
        console.error("Redirect result error:", error);
      });
    }
  }, []);

  useEffect(() => {
    const startedAt = Date.now();
    let dismissed = false;

    // Smooth fade-out before revealing the app, clamped to the minimum time.
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      const wait = Math.max(0, MIN_LOAD_MS - (Date.now() - startedAt));
      setTimeout(() => {
        setLoaderExiting(true);
        setTimeout(() => setLoading(false), 650);
      }, wait);
    };

    // Safety net: dismiss the loader even if auth/backend never responds.
    const cap = setTimeout(dismiss, MAX_LOAD_MS);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ============ EMAIL RESTRICTION TOGGLE ============
        // Choose ONE block below - comment the other

        // -------- PRODUCTION MODE (IIUC emails only) --------

        // if (!user.email.endsWith("@ugrad.iiuc.ac.bd")) {
        //   signOut(auth);
        //   setCurrentUser(null);
        //   setBackendUser(null);
        // } else {
        //   setCurrentUser(user);
        //   const backendUserData = await syncWithBackend(user);
        //   console.log('Auth state changed, backend user loaded:', backendUserData);
        // }

        // ----------------------------------------------------

        // -------- DEVELOPMENT MODE (all emails allowed) --------
        setCurrentUser(user);
        const backendUserData = await syncWithBackend(user);
        console.log(
          "Auth state changed, backend user loaded:",
          backendUserData,
        );
        // -------------------------------------------------------

        // ==================================================
      } else {
        setCurrentUser(null);
        setBackendUser(null);
      }
      // Smooth fade-out before revealing the app
      clearTimeout(cap);
      dismiss();
    });

    return () => {
      clearTimeout(cap);
      unsubscribe();
    };
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
      {loading ? <LoadingScreen exiting={loaderExiting} /> : children}
    </AuthContext.Provider>
  );
};
