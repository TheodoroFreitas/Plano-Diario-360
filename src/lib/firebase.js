import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBa1NqoHWGhALyG2vs4FNPSmU-xts-T1VM",
  authDomain: "plano-diario-360.firebaseapp.com",
  projectId: "plano-diario-360",
  storageBucket: "plano-diario-360.firebasestorage.app",
  messagingSenderId: "1028464282418",
  appId: "1:1028464282418:web:ca6aec1098f238e61ca52b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
