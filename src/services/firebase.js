// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyByN2YresjpUmsGivnEaQwJCKbu51Tuq9k",
  authDomain: "si-huki-8b637.firebaseapp.com",
  projectId: "si-huki-8b637",
  storageBucket: "si-huki-8b637.firebasestorage.app",
  messagingSenderId: "302315076921",
  appId: "1:302315076921:web:c79134cda7b25cffa53ce8",
  measurementId: "G-89SMFBY549",
};

const app = initializeApp(firebaseConfig);

// ✅ Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// ✅ Firestore
export const db = getFirestore(app);

// ✅ Storage (opsional)
export const storage = getStorage(app);

export default app;
