
// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDFtpjQu-KqJhTwoi5YdAQ9QdnQm2jj6O0",
  authDomain: "shop-8ccde.firebaseapp.com",
  projectId: "shop-8ccde",
  storageBucket: "shop-8ccde.firebasestorage.app",
  messagingSenderId: "508650009801",
  appId: "1:508650009801:web:42582c7732398732310918",
  measurementId: "G-D1NG43CM83"
};


// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };