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
  getDoc,
  writeBatch,
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
  collectionName,
  question,
  questionBelowImg,
  correctAnswersArray,
  incorrectAnswersArray,
  explanation,
  imageUrl,
  examTopicId,
  answerArea
) => {
  const collectionRef = collection(db, collectionName);

  // Transform the correctAnswers array of arrays into an object with dynamic keys
  const correctAnswersObject = correctAnswersArray.reduce(
    (obj, subArray, index) => {
      obj[`correctAnswers${index}`] = subArray;
      return obj;
    },
    {}
  );

  // Do the same for incorrectAnswers
  const incorrectAnswersObject = incorrectAnswersArray.reduce(
    (obj, subArray, index) => {
      obj[`incorrectAnswers${index}`] = subArray;
      return obj;
    },
    {}
  );

  const newDocRef = await addDoc(collectionRef, {
    question,
    questionBelowImg,
    ...correctAnswersObject, // Spread the correctAnswersObject to include all its key-value pairs
    ...incorrectAnswersObject,
    explanation,
    imageUrl,
    examTopicId,
    answerArea,
  });

  return newDocRef;
};

// updating document
export const updateDocument = async (
  collectionName,
  docId,
  question,
  questionBelowImg,
  correctAnswersArray,
  incorrectAnswersArray,
  explanation,
  imageUrl,
  examTopicId,
  answerArea
) => {
  const docRef = doc(db, collectionName, docId);

  // Transform the correctAnswers array of arrays into an object with dynamic keys
  const correctAnswersObject = correctAnswersArray.reduce(
    (obj, subArray, index) => {
      obj[`correctAnswers${index}`] = subArray;
      return obj;
    },
    {}
  );

  // Do the same for incorrectAnswers
  const incorrectAnswersObject = incorrectAnswersArray.reduce(
    (obj, subArray, index) => {
      obj[`incorrectAnswers${index}`] = subArray;
      return obj;
    },
    {}
  );

  await updateDoc(docRef, {
    question,
    questionBelowImg,
    ...correctAnswersObject, // Spread the correctAnswersObject to include all its key-value pairs
    ...incorrectAnswersObject, // Do the same for incorrectAnswersObject
    explanation,
    imageUrl,
    examTopicId,
    answerArea,
  });
};

export const getExamQuestions = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const questions = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return questions;
};

export const fetchCollectionNames = async () => {
  const metadataDocRef = doc(db, "_metadata", "collections");
  const docSnap = await getDoc(metadataDocRef);

  if (docSnap.exists()) {
    const collectionsArray = docSnap.data().names;
    // console.log("Collections:", collectionsArray);
    return collectionsArray;
  } else {
    console.error("No metadata found");
    return [];
  }
};

// Function to export collection as JSON
export const exportCollectionAsJSON = async (collectionName) => {
  try {
    // Reference to your collection
    const collectionRef = collection(db, collectionName);

    // Fetch documents
    const querySnapshot = await getDocs(collectionRef);

    // Serialize documents to JSON
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Convert to a JSON string
    const json = JSON.stringify(documents, null, 2);

    // Create a blob with the JSON data
    const blob = new Blob([json], { type: "application/json" });

    // Create an anchor element and trigger a download
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${collectionName}.json`;
    a.click();

    // Cleanup
    URL.revokeObjectURL(a.href);
  } catch (error) {
    console.error("Error exporting collection:", error);
  }
};

export const importDataToFirestore = async (jsonContent, collectionName) => {
  const collectionRef = collection(db, collectionName);
  const batch = writeBatch(db);

  jsonContent.forEach((item) => {
    const docRef = doc(collectionRef, item.id); // using the id field as the document id
    batch.set(docRef, item);
  });

  await batch.commit();
  console.log("Data successfully imported to Firestore!");
};

export const auth = getAuth();
export default app;
