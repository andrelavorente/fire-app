import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA816Ldoccgzajo-N0xC7s1A9REWiSyuOo",
  authDomain: "curso-6e8b0.firebaseapp.com",
  projectId: "curso-6e8b0",
  storageBucket: "curso-6e8b0.appspot.com",
  messagingSenderId: "152478534213",
  appId: "1:152478534213:web:6082e6c73eb69a44f6b12c",
  measurementId: "G-79HDCR9T41",
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = getAuth();

export { db, auth };
