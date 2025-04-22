import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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
const db = getFirestore(app);

const createUserDocument = async () => {
  try {
    const userId = 'Gn0hQVhwZKM5bJajJ7wcqeEWbpw2'; // El UID que proporcionaste
    const userData = {
      email: 'teacher@example.com',
      role: 'teacher',
      name: 'Test Teacher'
    };

    await setDoc(doc(db, 'users', userId), userData);
    console.log('User document created successfully!');
  } catch (error) {
    console.error('Error creating user document:', error);
  }
};

createUserDocument(); 