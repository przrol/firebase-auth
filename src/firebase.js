import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  addDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
});

const questionCollection = "questions";

export const db = getFirestore();

const storage = getStorage();

export const addNewImage = async (file) => {
  const storageRef = ref(storage, file.name);

  // 'file' comes from the Blob or File API
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);

  return downloadURL;
};

// // Child references can also take paths delimited by '/'
// const fileRef = ref(storage, "0007300002.png");
// getDownloadURL(fileRef)
//   .then((url) => {
//     // Use the URL for the image, e.g. set the source of an image element
//     // document.querySelector('img').src = url;
//     console.log(url);
//   })
//   .catch((error) => {
//     // Handle any errors
//   });

// adding document
export const addNewDocument = async (
  question,
  questionBelowImg,
  correctAnswers,
  incorrectAnswers,
  explanation,
  imageUrl,
  examTopicId
) => {
  const collectionRef = collection(db, questionCollection);

  const newDocRef = await addDoc(collectionRef, {
    question,
    questionBelowImg,
    correctAnswers,
    incorrectAnswers,
    explanation,
    imageUrl,
    examTopicId,
  });

  return newDocRef;
};

// updating document
export const updateDocument = async (
  docId,
  question,
  questionBelowImg,
  correctAnswers,
  incorrectAnswers,
  explanation,
  imageUrl,
  examTopicId
) => {
  const docRef = doc(db, questionCollection, docId);

  await updateDoc(docRef, {
    question,
    questionBelowImg,
    correctAnswers,
    incorrectAnswers,
    explanation,
    imageUrl,
    examTopicId,
  });
};

export const getQuestionsAndDocuments = async () => {
  const collectionRef = collection(db, questionCollection);
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const questions = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return questions;
};

export const auth = getAuth();
export default app;
