import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

/**
 * Sign in with Google.
 * - Always tries popup first (works on desktop AND mobile).
 * - If popup fails on a production HTTPS site, falls back to redirect.
 * - On HTTP (local dev over LAN), popup is the only option since
 *   Firebase redirect requires HTTPS (or literal "localhost").
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    const isPopupError =
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/cancelled-popup-request';

    if (isPopupError && window.location.protocol === 'https:') {
      // On production HTTPS, redirect is reliable on mobile
      await signInWithRedirect(auth, googleProvider);
      return null;
    }

    if (isPopupError) {
      // On HTTP dev, redirect won't work — ask user to retry
      throw new Error(
        'Sign-in popup was closed. Please try again and complete the sign-in in the opened window.'
      );
    }

    throw error;
  }
};

/**
 * Process redirect result on page load (only matters after a
 * signInWithRedirect fallback on production HTTPS).
 */
export const handleRedirectResult = () => getRedirectResult(auth);
