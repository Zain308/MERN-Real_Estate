// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-e5da7.firebaseapp.com",
  projectId: "mern-estate-e5da7",
  storageBucket: "mern-estate-e5da7.firebasestorage.app",
  messagingSenderId: "598851281521",
  appId: "1:598851281521:web:2d40236e5b7ae1d20c71d0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);