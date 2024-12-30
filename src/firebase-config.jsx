// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLYfJAz2X1uRgsrvp9d_Nh3YbhqlVlMY0",
  authDomain: "didactypo.firebaseapp.com",
  projectId: "didactypo",
  storageBucket: "didactypo.firebasestorage.app",
  messagingSenderId: "883369472393",
  appId: "1:883369472393:web:e9a32e7690a0de595fb158"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);