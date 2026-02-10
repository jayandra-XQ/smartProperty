// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "smartproperty-56c9b.firebaseapp.com",
  projectId: "smartproperty-56c9b",
  storageBucket: "smartproperty-56c9b.firebasestorage.app",
  messagingSenderId: "931021142522",
  appId: "1:931021142522:web:52990aceb3bfe250488c43"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);