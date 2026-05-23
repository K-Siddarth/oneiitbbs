import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { signOut as firebaseSignOut, GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';

WebBrowser.maybeCompleteAuthSession();

interface FirestoreUser {
  uid: string;
  email: string;
  displayName: string;
  isAdmin?: boolean;
}

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  devSignIn: () => Promise<void>; // Added devSignIn to the interface
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Removing Native GoogleSignin configuration

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    // IMPORTANT: Using only webClientId for testing. Make sure to:
    // 1. Go to Google Cloud Console > OAuth consent screen
    // 2. Set it to "Internal" (not External)
    // 3. Add test users if in development
    // 4. Make sure this Web Client ID is created and configured
    clientId: '208282390520-d81krkplg5qhfvljbl0qbn4lvhqcc1aq.apps.googleusercontent.com',
    webClientId: '208282390520-d81krkplg5qhfvljbl0qbn4lvhqcc1aq.apps.googleusercontent.com',
    
    // iOS and Android Client IDs - Comment out for now if causing issues
    // Uncomment and fill these in after completing GCP OAuth setup
    // iosClientId: '208282390520-vn2cpspjkm1ncachrthuch4imislek51.apps.googleusercontent.com',
    // androidClientId: '208282390520-xxxxxxx.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(error => {
        console.error("Firebase credential sign-in error:", error);
        setLoading(false);
      });
    } else if (response?.type === 'error') {
      console.error("Google Auth Error:", response.error);
      console.error("Google Auth Error Code:", response.error?.code);
      console.error("Google Auth Error Message:", response.error?.message);
      setLoading(false);
    } else if (response?.type === 'cancel') {
      console.log("User cancelled Google sign-in");
      setLoading(false);
    }
  }, [response]);

  useEffect(() => {
    // Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // User is logged into Firebase. Fetch their Firestore document to check `isAdmin`.
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const data = userSnap.data() as FirestoreUser;
            
            // Re-verify the user is admin
            if (data.isAdmin === true) {
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email || data.email,
                displayName: firebaseUser.displayName || data.displayName,
                isAdmin: true,
              });
            } else {
              // Not an admin, sign them out
              await firebaseSignOut(auth);
              setUser(null);
            }
          } else {
             // Document doesn't exist, sign them out
             await firebaseSignOut(auth);
             setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user from Firestore:", error);
          setUser(null);
        }
      } else {
        // Prevent Firebase from overwriting our Dev Mock user when it reports "logged out"
        setUser((currentUser) => {
          if (currentUser?.uid === 'dev-mock-uid-12345') {
            return currentUser; // Keep the dev user
          }
          return null; // Otherwise, clear the user
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Standard Google Sign-In
  const signIn = async () => {
    try {
      setLoading(true);
      if (!request) {
        console.error('Google auth request not ready');
        throw new Error('Google authentication is not properly initialized. Please ensure Google Cloud Console is configured correctly.');
      }
      await promptAsync();
    } catch (error: any) {
      console.error('Sign In Error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
      });
      setLoading(false);
      throw error;
    }
  };

  // Dev Mock Sign-In (Bypasses Google & Firebase entirely)
  const devSignIn = async () => {
    setLoading(true);
    // Simulate a brief network delay so loading spinners work naturally
    setTimeout(() => {
      setUser({
        uid: 'dev-mock-uid-12345',
        email: '23cs01027@iitbbs.ac.in',
        displayName: 'Dev User',
        isAdmin: true, // You can toggle this to false to test non-admin views
      });
      setLoading(false);
    }, 500);
  };

  const logout = async () => {
    try {
      setLoading(true);
      if (auth.currentUser) {
        await firebaseSignOut(auth);
      }
    } catch (error) {
       console.error("Error signing out:", error);
    } finally {
       setUser(null);
       setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    devSignIn, // Exporting the new bypass function
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};