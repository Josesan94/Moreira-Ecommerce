import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDW5NxTZyUZzdj7wYniQDOpozCIwwER9hs",
  authDomain: "moreira-ecommerce-1fc40.firebaseapp.com",
  projectId: "moreira-ecommerce-1fc40",
  storageBucket: "moreira-ecommerce-1fc40.appspot.com",
  messagingSenderId: "74199017484",
  appId: "1:74199017484:web:bdb7947aeffa0494f06629",
  measurementId: "G-N5C9E2D2PE"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage()

export {auth, db, storage}

