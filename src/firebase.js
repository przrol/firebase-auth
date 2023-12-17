import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const app = initializeApp({
  apiKey: "AIzaSyBWb-9KR8_0PWeorMbQ-QdE0KLKVU_cMik",
  authDomain: "auth-development-8c020.firebaseapp.com",
  projectId: "auth-development-8c020",
  storageBucket: "auth-development-8c020.appspot.com",
  messagingSenderId: "6824600978",
  appId: "1:6824600978:web:bbe04fe44ef012001e8d4b",
});

export const auth = getAuth();
export default app;
