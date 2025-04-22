import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBttZi4KYeSA5Q9Av1HSesqZh3JhPM_v5g",
  authDomain: "appcolegios-e623e.firebaseapp.com",
  projectId: "appcolegios-e623e",
  storageBucket: "appcolegios-e623e.firebasestorage.app",
  messagingSenderId: "381837024612",
  appId: "1:381837024612:web:1b75843b6d3debcb462e71",
  measurementId: "G-GBD2SRDKGJ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 