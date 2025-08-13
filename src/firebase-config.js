// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Імпортуємо getFirestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBna8yI8GHmUkskCzCchF2dDPXKt41VzWs",
  authDomain: "steam-investments-6855d.firebaseapp.com",
  projectId: "steam-investments-6855d",
  storageBucket: "steam-investments-6855d.firebasestorage.app",
  messagingSenderId: "643019176291",
  appId: "1:643019176291:web:db1c2fd17461c2ff803b56",
  measurementId: "G-ZFXT0Q5X9N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Ініціалізуємо та експортуємо об'єкт бази даних