import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBnrbaEvRcO1kC5KOQL-f0cId1jH5C-8dM",
  authDomain: "ai-resume-analyzer-13d49.firebaseapp.com",
  projectId: "ai-resume-analyzer-13d49",
  storageBucket: "ai-resume-analyzer-13d49.firebasestorage.app",
  messagingSenderId: "656198145803",
  appId: "1:656198145803:web:a73ab3bf556705e2f8f40e",
  measurementId: "G-90RGJP4RBJ"
};

console.log('🔥 Initializing Firebase...');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialized:', app.name);

// Initialize services
export const auth = getAuth(app);
console.log('✅ Firebase Auth initialized');
console.log('Auth current user:', auth.currentUser);

export const db = getFirestore(app);
console.log('✅ Firestore initialized');

export const googleProvider = new GoogleAuthProvider();

// Initialize analytics (only in browser)
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
  console.log('✅ Analytics initialized');
}

export { analytics };
export default app;
