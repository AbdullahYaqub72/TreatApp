import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthorized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authorized emails
const AUTHORIZED_EMAILS = [
  'abdullahyaqub555@gmail.com',
  '2020cs72@gmail.com'
];

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthorized = currentUser ? AUTHORIZED_EMAILS.includes(currentUser.email || '') : false;

  // Create or update user profile in Firestore
  const createUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user profile
        await setDoc(userRef, {
          displayName: user.displayName || 'Anonymous',
          email: user.email || '',
          photoURL: user.photoURL || '',
          createdAt: serverTimestamp(),
        });
      }

      // Fetch and set user profile
      const updatedSnap = await getDoc(userRef);
      if (updatedSnap.exists()) {
        setUserProfile({
          id: updatedSnap.id,
          ...updatedSnap.data(),
        } as UserProfile);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  useEffect(() => {
    // Set a timeout to stop loading after 3 seconds
    const loadingTimeout = setTimeout(() => {
      console.log('Auth loading timeout - continuing anyway');
      setLoading(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(loadingTimeout);
      setCurrentUser(user);
      if (user) {
        await createUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      clearTimeout(loadingTimeout);
      setLoading(false);
    });

    return () => {
      clearTimeout(loadingTimeout);
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Check if user is authorized
      if (!AUTHORIZED_EMAILS.includes(result.user.email || '')) {
        await firebaseSignOut(auth);
        alert('Access Denied: Only authorized users (abdullahyaqub555@gmail.com or 2020cs72@gmail.com) can sign in.');
        throw new Error('Unauthorized email');
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      if (error.code === 'auth/unauthorized-domain') {
        alert('Error: This domain is not authorized. Please add localhost to Firebase Console → Authentication → Settings → Authorized domains');
      }
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    signInWithGoogle,
    signOut,
    isAuthorized,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
