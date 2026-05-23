import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default null;
