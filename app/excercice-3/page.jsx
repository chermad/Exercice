"use client";
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editNote, setEditNote] = useState(null);
  const [editText, setEditText] = useState("");

  // Charger les notes en temps réel
  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    });
    return () => unsubscribe();
  }, []);

  // Ajouter une note
  const addNote = async () => {
    if (newNote.trim() === "") return;
    await addDoc(collection(db, "notes"), {
      text: newNote,
      createdAt: serverTimestamp(),
    });
    setNewNote("");
  };

  // Supprimer une note
  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notes", id));
  };

  // Ouvrir le modal d’édition
  const openEditModal = (note) => {
    setEditNote(note);
    setEditText(note.text);
  };

  // Sauvegarder la modification
  const saveEdit = async () => {
    if (!editNote) return;
    await updateDoc(doc(db, "notes", editNote.id), {
      text: editText,
      updatedAt: serverTimestamp(),
    });
    setEditNote(null);
    setEditText("");
  };

  // Formatter la date Firestore
  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleString("fr-FR");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📝 Gestion des Notes</h1>

      {/* Champ d’ajout */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Écris une nouvelle note..."
          className="flex-1 border rounded p-2"
        />
        <button
          onClick={addNote}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Ajouter
        </button>
      </div>

      {/* Liste des notes */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border rounded p-4 shadow flex flex-col gap-2"
          >
            <p className="text-lg">{note.text}</p>
            <div className="text-sm text-gray-500">
              Créé le : {formatDate(note.createdAt)} <br />
              {note.updatedAt && (
                <span>Modifié le : {formatDate(note.updatedAt)}</span>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => openEditModal(note)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Modifier
              </button>
              <button
                onClick={() => deleteNote(note.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d’édition */}
      {editNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Modifier la note</h2>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditNote(null)}
                className="px-4 py-2 border rounded"
              >
                Annuler
              </button>
              <button
                onClick={saveEdit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
