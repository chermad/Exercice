import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const NOTES_COLLECTION = "notes";

// ➕ Ajouter une note
export async function addNote(note) {
  try {
    await addDoc(collection(db, NOTES_COLLECTION), {
      text: note.text || "", // 👈 plus de 'content'
      author: note.author || "Anonyme",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erreur addNote:", error);
  }
}

// 📖 Récupérer toutes les notes
export async function getAllNotes() {
  const snapshot = await getDocs(collection(db, NOTES_COLLECTION));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ✏️ Mettre à jour une note
export async function updateNote(id, data) {
  const noteRef = doc(db, NOTES_COLLECTION, id);
  await updateDoc(noteRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ❌ Supprimer une note
export async function deleteNote(id) {
  await deleteDoc(doc(db, NOTES_COLLECTION, id));
}
