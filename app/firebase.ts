// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjruu4jjmbIB1JOO2zBkNo6i89ok37aMc",
  authDomain: "oneiitbbs.firebaseapp.com",
  projectId: "oneiitbbs",
  storageBucket: "oneiitbbs.firebasestorage.app",
  messagingSenderId: "208282390520",
  appId: "1:208282390520:web:2ee28e7045c001a2d2d00d",
  measurementId: "G-DTDHB683HV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Ensure Expo Router route resolution passes when the file is inside /app.
export default function FirebaseScreen() {
  return null;
}
