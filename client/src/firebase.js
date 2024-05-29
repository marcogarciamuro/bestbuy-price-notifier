import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZUgHpVQNs_ubUBlod2-XPaa8GdXtQRzY",
  authDomain: "bestbuy-price-notifier.firebaseapp.com",
  projectId: "bestbuy-price-notifier",
  storageBucket: "bestbuy-price-notifier.appspot.com",
  messagingSenderId: "429948767644",
  appId: "1:429948767644:web:46ec52c0e283c26f0e0c59",
  measurementId: "G-BZF8LB0LC5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
