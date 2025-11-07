import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCNrCZP-z1-Z7keeNv8lgWGgTVNJVPKDyw",
  authDomain: "pronunciationapp-93d67.firebaseapp.com",
  projectId: "pronunciationapp-93d67",
  storageBucket: "pronunciationapp-93d67.firebasestorage.app",
  messagingSenderId: "1013588686815",
  appId: "1:1013588686815:web:5175c84f53f6982a00f66a",
  measurementId: "G-TZTRQVHMSP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);