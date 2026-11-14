"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  auth,
  BOOTSTRAP_ADMIN_EMAIL,
  db,
  testFirestoreConnection,
} from "@/lib/firebase/client";

type FirebaseContextValue = {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  dbConnected: boolean | null;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    void testFirestoreConnection().then(setDbConnected);

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIsAdmin(false);
        setAuthReady(true);
        return;
      }

      const verifiedEmail = nextUser.emailVerified && nextUser.email === BOOTSTRAP_ADMIN_EMAIL;
      if (verifiedEmail) {
        setIsAdmin(true);
        setAuthReady(true);
        return;
      }

      try {
        const adminSnap = await getDoc(doc(db, "admins", nextUser.uid));
        setIsAdmin(Boolean(nextUser.emailVerified && adminSnap.exists()));
      } catch {
        setIsAdmin(false);
      } finally {
        setAuthReady(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, provider);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Authentication failed");
    }
  }, []);

  const signOut = useCallback(async () => {
    setAuthError(null);
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo<FirebaseContextValue>(
    () => ({
      user,
      authReady,
      isAdmin,
      dbConnected,
      authError,
      signInWithGoogle,
      signOut,
    }),
    [user, authReady, isAdmin, dbConnected, authError, signInWithGoogle, signOut],
  );

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

export function useFirebase() {
  const ctx = useContext(FirebaseContext);
  if (!ctx) {
    throw new Error("useFirebase must be used inside FirebaseProvider");
  }
  return ctx;
}
