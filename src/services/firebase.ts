import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Default configuration with environment variables or fallback configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyAxiTexApiKey987123",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "axitex-voice-ai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "axitex-voice-ai",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "axitex-voice-ai.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "937305829632",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:937305829632:web:2ad7dd8735334c7f",
};

let app: any = null;
let auth: any = null;
let db: any = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
} catch (err) {
  console.warn('Firebase initialized in local/offline resilient mode:', err);
}

export { app, auth, db, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, doc, getDoc, setDoc };
