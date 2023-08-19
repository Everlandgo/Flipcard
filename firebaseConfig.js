// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAX-yGU_CkcU5w3n3Kj1ZO4ywNO8-6GBlQ",
  authDomain: "flipcard-cc9e0.firebaseapp.com",
  projectId: "flipcard-cc9e0",
  storageBucket: "flipcard-cc9e0.appspot.com",
  messagingSenderId: "223620289187",
  appId: "1:223620289187:web:a93e344a56d54fd7efe516"
};

// Initialize Firebase
export const firebase_app = initializeApp(firebaseConfig);
export const firebase_auth = getAuth(firebase_app);

