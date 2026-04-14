// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1BlcQYVK6cLYlMdAnOh0kXYNcoPD9gsk",
  authDomain: "repsense-1fc8a.firebaseapp.com",
  projectId: "repsense-1fc8a",
  storageBucket: "repsense-1fc8a.firebasestorage.app",
  messagingSenderId: "896857706969",
  appId: "1:896857706969:web:d0c56eb87dd712702949c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);