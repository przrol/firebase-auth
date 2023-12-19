import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

export const db = getFirestore();

export const getQuestionsAndDocuments = async () => {
  const collectionRef = collection(db, "questions");
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const questions = querySnapshot.docs.map((doc) => ({ ...doc.data() }));

  return questions;
};

export const auth = getAuth();
export default app;
