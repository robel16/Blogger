import { initializeApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDVpgOClvJo_EQ3_2H4Gb_nD2LMXJSbGSA",
  authDomain: "fir-43e31.firebaseapp.com",
  projectId: "fir-43e31",
  storageBucket: "fir-43e31.firebasestorage.app",
  messagingSenderId: "972964249810",
  appId: "1:972964249810:web:248baf5d808b39177b2d0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence and popup settings
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Additional initialization if needed
    auth.useDeviceLanguage(); // Use browser's language
  })
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });

export { auth }; 