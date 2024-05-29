import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  function createUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function createUserProfile(userID, hasMembership) {
    const userInfo = {
      hasMembership: hasMembership,
    };
    return setDoc(doc(db, "users", userID), userInfo);
  }

  function logOut() {
    return signOut(auth);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{ createUser, createUserProfile, user, logOut, logIn }}
    >
      {children}
    </AuthContext.Provider>
  );
}
