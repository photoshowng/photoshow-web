// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut } from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-43GSI9Q7RZFYv2enYz-0sFkXDx7A0bY",
  authDomain: "photoshow-2fc26.firebaseapp.com",
  databaseURL: "https://photoshow-2fc26-default-rtdb.firebaseio.com",
  projectId: "photoshow-2fc26",
  storageBucket: "photoshow-2fc26.appspot.com",
  messagingSenderId: "578204887386",
  appId: "1:578204887386:web:1ff9b8a5d9475a90062b63",
  measurementId: "G-449X7NTCMJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const storeRef = ref
const analytics = getAnalytics(app);

export const handleLogout = () => {
  signOut(auth)
    .then(() => {
      // Logout successful
      sessionStorage.removeItem('userId')
    })
    .catch((error) => {
      // An error happened
      console.error('Error signing out: ', error);
    });
};

export const handleSuperLogout = () => {
  signOut(auth)
    .then(() => {
      // Logout successful
      sessionStorage.removeItem('superId')
    })
    .catch((error) => {
      // An error happened
      console.error('Error signing out: ', error);
    });
};