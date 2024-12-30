import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  writeBatch,
  deleteDoc,
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

export const formatNumber = (number) => {
  // Convert the number to a string and pad it with leading zeros
  let paddedNumber = number.toString().padStart(3, "0");
  return `question_${paddedNumber}`;
};

export const deleteDocument = async (collectionName, docId) => {
  await deleteDoc(doc(db, collectionName, docId));
};

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
  answerArea,
  lastModified
) => {
  // const collectionRef = collection(db, collectionName);
  const newDocId = formatNumber(examTopicId);

  await setDoc(doc(db, collectionName, newDocId), {
    question,
    questionBelowImg,
    correctAnswers: JSON.stringify(correctAnswersArray),
    incorrectAnswers: JSON.stringify(incorrectAnswersArray),
    explanation,
    imageUrl,
    examTopicId,
    answerArea,
    lastModified,
  });

  return newDocId;
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
  answerArea,
  lastModified,
  groupNumber
) => {
  const docRef = doc(db, collectionName, docId);

  await updateDoc(docRef, {
    question,
    questionBelowImg,
    correctAnswers: JSON.stringify(correctAnswersArray),
    incorrectAnswers: JSON.stringify(incorrectAnswersArray),
    explanation,
    imageUrl,
    examTopicId,
    answerArea,
    lastModified,
    groupNumber,
  });
};

export const getExamQuestions = async (collectionName) => {
  const collectionRef = collection(db, collectionName);

  // Add where clause to filter documents with lastModified property
  // const q = query(collectionRef, where("lastModified", "!=", null)); // Use '!=' to check for existence
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const questions = [];

  for (let i = 0; i < querySnapshot.docs.length; i++) {
    const doc = querySnapshot.docs[i];

    try {
      questions.push({
        ...doc.data(),
        correctAnswers: JSON.parse(doc.data().correctAnswers),
        incorrectAnswers: JSON.parse(doc.data().incorrectAnswers),
        id: doc.id,
      });
    } catch (error) {
      console.log(`document id: ${doc.id}`);
      console.error(doc.data().incorrectAnswers);
      console.log(error);
    }
  }

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
    if (item.id) {
      // Check if item.id is truthy (not null, undefined, or an empty string)
      const docRef = doc(collectionRef, item.id); // using the id field as the document id
      batch.set(docRef, item);
    } else {
      console.error(
        "Error importing item to Firestore: Missing or empty id field",
        item
      );
    }
  });

  await batch.commit();
  console.log("Data successfully imported to Firestore!");
};

export const auth = getAuth();
export default app;
