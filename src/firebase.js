import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCVKtJUCbLVV8acNL2xlZoF2AXvq9-3S60",
  authDomain: "challenge-5690a.firebaseapp.com",
  projectId: "challenge-5690a",
  storageBucket: "challenge-5690a.appspot.com",
  messagingSenderId: "962106949858",
  appId: "1:962106949858:web:4b285ebee85e163797debb",
  measurementId: "G-NTDZHH0L06"
};

//const firebaseApp = firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
//const db = firebaseApp.firestore();
const db = getFirestore(app);
//const auth = firebase.auth();
const auth = getAuth(app)



export {auth, db};