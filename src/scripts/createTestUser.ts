import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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
const auth = getAuth(app);
const db = getFirestore(app);

async function createTestUser() {
  try {
    // Crear usuario de prueba (profesor)
    const timestamp = new Date().getTime();
    const teacherEmail = `profesor${timestamp}@ejemplo.com`;
    const teacherPassword = 'profesor123';
    const teacherCredential = await createUserWithEmailAndPassword(auth, teacherEmail, teacherPassword);
    
    // Crear documento del profesor en Firestore
    await setDoc(doc(db, 'users', teacherCredential.user.uid), {
      email: teacherEmail,
      role: 'teacher',
      name: 'Profesor de Prueba',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('Usuario profesor creado:', teacherEmail);

    // Crear usuario de prueba (estudiante)
    const studentEmail = `estudiante${timestamp}@ejemplo.com`;
    const studentPassword = 'estudiante123';
    const studentCredential = await createUserWithEmailAndPassword(auth, studentEmail, studentPassword);
    
    // Crear documento del estudiante en Firestore
    await setDoc(doc(db, 'users', studentCredential.user.uid), {
      email: studentEmail,
      role: 'student',
      name: 'Estudiante de Prueba',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('Usuario estudiante creado:', studentEmail);
    console.log('Usuarios de prueba creados exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('Error al crear usuarios de prueba:', error);
    process.exit(1);
  }
}

createTestUser(); 