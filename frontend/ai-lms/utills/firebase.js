// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "learning-management-syst-97fe4.firebaseapp.com",
  projectId: "learning-management-syst-97fe4",
  storageBucket: "learning-management-syst-97fe4.firebasestorage.app",
  messagingSenderId: "194649931380",
  appId: "1:194649931380:web:c4187b90e98d925f259b21"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth,provider} 