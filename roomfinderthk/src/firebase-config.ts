// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCERj2pCT1ViUPAsUoS0XQGvoExtoRiuAQ",
  authDomain: "roomfinderthk-7ec6d.firebaseapp.com",
  databaseURL: "https://roomfinderthk-7ec6d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "roomfinderthk-7ec6d",
  storageBucket: "roomfinderthk-7ec6d.firebasestorage.app",
  messagingSenderId: "27010002308",
  appId: "1:27010002308:web:9b139680f027dce66681d1",
  measurementId: "G-35PT84K34K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);