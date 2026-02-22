/// <reference types="vite/client" />
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfWwidRP7tci60yVr1A9xCRaNeAYYYnoE",
  authDomain: "roomfinderthk-7ec6d.firebaseapp.com",
  databaseURL: "https://roomfinderthk-7ec6d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "roomfinderthk-7ec6d",
  storageBucket: "roomfinderthk-7ec6d.firebasestorage.app",
  messagingSenderId: "27010002308",
  appId: "1:27010002308:web:9b139680f027dce66681d1",
  measurementId: "G-KE41WTXMCE"
};

// Initialize Firebase
export { firebaseConfig };
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);