import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAzR8hB5Hs-RrpSbhZ8PURIqkAkSS2Xh-g",
  authDomain: "swirl-station-8dcb1.firebaseapp.com",
  projectId: "swirl-station-8dcb1",
  storageBucket: "swirl-station-8dcb1.firebasestorage.app",
  messagingSenderId: "734579024452",
  appId: "1:734579024452:web:b95f4ea35c16e768de1211",
  measurementId: "G-7HC7GB8KQT"
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();