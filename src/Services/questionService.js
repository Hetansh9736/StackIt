import { db } from "../lib/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

const questionsRef = collection(db, "questions");

export const addQuestion = async (data) => {
  await addDoc(questionsRef, {
    ...data,
    createdAt: new Date(),
  });
};

export const getQuestions = async () => {
  const q = query(questionsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
