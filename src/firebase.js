import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyBWb-9KR8_0PWeorMbQ-QdE0KLKVU_cMik",
  authDomain: "auth-development-8c020.firebaseapp.com",
  projectId: "auth-development-8c020",
  storageBucket: "auth-development-8c020.appspot.com",
  messagingSenderId: "6824600978",
  appId: "1:6824600978:web:bbe04fe44ef012001e8d4b",
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
