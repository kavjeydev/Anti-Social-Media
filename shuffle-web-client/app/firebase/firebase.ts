// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    User }
    from "firebase/auth"
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIXXtv2t7HIGWqDEoV3hHC-Tourk3BzIM",
  authDomain: "anti-social-media-72712.firebaseapp.com",
  projectId: "anti-social-media-72712",
  appId: "1:514615373087:web:a9653ca92b9cf7728f142a",
  measurementId: "G-CWWX013ZNX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const functions = getFunctions();
// const analytics = getAnalytics(app);

const auth = getAuth(app);

export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

export function signOut(){
    return auth.signOut();
}

export function onAuthStateChangedHelper(callback: (user: User | null) => void){
    return onAuthStateChanged(auth, callback);
}