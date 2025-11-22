import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration for Treat Planner
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBP6BCpwskfc0B2JOY4qHAu42yF5Nf_tSA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "treat-management-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "treat-management-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "treat-management-app.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "596421224037",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:596421224037:web:treat-planner-web-app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
