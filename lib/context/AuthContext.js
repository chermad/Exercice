// context/AuthContext.js
"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext();

const provider = new GoogleAuthProvider();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Optionnel : forcer la persistance locale (sur reloads)
    setPersistence(auth, browserLocalPersistence).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, provider);
  };

  const signupWithEmail = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const signinWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, signupWithEmail, signinWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
