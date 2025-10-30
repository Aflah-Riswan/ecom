// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyBq_ixjDj6pbgx53ybewONZWlgqgu25zz4",
  authDomain: "redux-project-ec4ce.firebaseapp.com",
  projectId: "redux-project-ec4ce",
  storageBucket: "redux-project-ec4ce.firebasestorage.app",
  messagingSenderId: "1038200323211",
  appId: "1:1038200323211:web:8e76b70288e155df3ee88e",
  measurementId: "G-43B82BFLJ7"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);