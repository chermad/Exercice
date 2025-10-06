"use client";

import React, { useEffect, useState, useRef } from "react";
import { addNote, updateNote, deleteNote } from "@/lib/notesFunctions";
import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

// Durée pendant laquelle une note est considérée comme "NOUVELLE"
const NEW_MESSAGE_DURATION = 30 * 60 * 1000; // 30 minutes

// 🌟 DÉFINITION DE L'EMAIL DU SUPER ADMIN
const SUPER_ADMIN_EMAIL = "chermad@gmail.com";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const textareaRef = useRef(null);
  const noteRefs = useRef({});

  // 🔹 Surveille l'état de connexion Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  // 🌟 Détermine si l'utilisateur est super admin
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  // 🔹 Met à jour l'heure actuelle toutes les minutes
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  // 🔹 Écoute en temps réel les notes depuis Firestore
  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedNotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(fetchedNotes);
    });
    return () => unsubscribe();
  }, []);

  // 🛠️ Fermer le menu lors d'un clic à l’extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuOpenId) return;
      const targetRef = noteRefs.current[menuOpenId];
      if (targetRef && !targetRef.contains(event.target)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpenId]);

  // 🔹 Vérifie si une note est récente (< 30 minutes)
  const isNew = (note) => {
    if (!note.createdAt?.seconds) return false;
    const creationTime = note.createdAt.seconds * 1000;
    return currentTime - creationTime <= NEW_MESSAGE_DURATION;
  };

  // 🔹 Ajouter une note
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    await addNote({
      text: newNote.trim(),
      author: user?.email || "Anonyme",
      createdAt: serverTimestamp(),
    });
    setNewNote("");
  };

  // 🔹 Modifier une note
  const handleEditNote = (note) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
    setMenuOpenId(null);
  };

  const handleSaveEdit = async (id) => {
    if (!editingText.trim()) return;
    await updateNote(id, {
      text: editingText,
      updatedAt: serverTimestamp(),
    });
    setEditingNoteId(null);
    setEditingText("");
  };

  // 🔹 Supprimer une note
  const handleDeleteNote = async (id) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cette note ?");
    if (confirmed) {
      await deleteNote(id);
      setMenuOpenId(null);
    }
  };

  // 🔹 Formater la date affichée
  const formatTimestamp = (timestamp) => {
    if (!timestamp?.seconds) return "—";
    return new Date(timestamp.seconds * 1000).toLocaleString("fr-FR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // 🌟 Logique de permissions
  const canModify = (note) => user && user.email === note.author;
  const canDelete = (note) => user && (user.email === note.author || isSuperAdmin);
  const hasActions = (note) => canModify(note) || canDelete(note);

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 pb-28">
      <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">
        Notes publiques
      </h2>

      {notes.length === 0 ? (
        <p className="text-gray-600 text-center">Aucune note pour le moment.</p>
      ) : (
        notes.map((note) => {
          const isNoteNew = isNew(note);

          return (
            <div
              ref={(el) => (noteRefs.current[note.id] = el)}
              key={note.id}
              className={`bg-white rounded-2xl p-3 shadow-md transition relative 
                ${isNoteNew ? "border-2 border-cyan-500" : "border border-gray-300"}
              `}
            >
              {isNoteNew && (
                <span className="absolute top-[-10px] right-[-10px] bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                  NOUVEAU
                </span>
              )}

              {editingNoteId === note.id ? (
                <textarea
                  ref={textareaRef}
                  className="w-full bg-gray-100 text-gray-800 rounded p-3 mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-gray-300 resize-y"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  rows="3"
                />
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap pr-8">{note.text}</p>
              )}

              {editingNoteId === note.id && (
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setEditingNoteId(null);
                      setEditingText("");
                    }}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-sm transition"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleSaveEdit(note.id)}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-lg text-sm transition"
                  >
                    Sauvegarder
                  </button>
                </div>
              )}

              <div
                className={`text-xs text-gray-500 mt-2 flex justify-between items-center border-t border-gray-200 pt-2 ${
                  editingNoteId === note.id ? "hidden" : ""
                }`}
              >
                <span>{note.author || "Anonyme"}</span>
                <span>
                  <span className="font-bold">Créé</span> : {formatTimestamp(note.createdAt)}
                  {note.updatedAt?.seconds ? " • " : ""}
                  {note.updatedAt?.seconds && (
                    <>
                      <span className="font-bold">Modifié</span> :{" "}
                      {formatTimestamp(note.updatedAt)}
                    </>
                  )}
                </span>
              </div>

              <div className="absolute top-3 right-3 z-10">
                {hasActions(note) && (
                  <button
                    onClick={() =>
                      setMenuOpenId(menuOpenId === note.id ? null : note.id)
                    }
                    className="text-gray-500 hover:text-cyan-600 w-6 h-6 flex items-center justify-center text-xl font-bold"
                    disabled={editingNoteId === note.id}
                  >
                    ⋮
                  </button>
                )}

                {menuOpenId === note.id && (
                  <div className="absolute right-0 mt-1 w-32 bg-white text-gray-800 rounded-md shadow-md py-1 z-20 border border-gray-200">
                    {canModify(note) && (
                      <button
                        onClick={() => handleEditNote(note)}
                        className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 hover:text-cyan-600"
                      >
                        ✏️ Modifier
                      </button>
                    )}

                    {canDelete(note) && (
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="block w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-gray-100 hover:text-red-700"
                      >
                        🗑 Supprimer
                      </button>
                    )}

                    {!hasActions(note) && (
                      <p className="px-3 py-1.5 text-gray-500 text-sm">Lecture seule</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* 🔹 ZONE D'AJOUT UNIQUEMENT POUR LES UTILISATEURS CONNECTÉS */}
      {user && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-100 p-3 flex items-center justify-center gap-2 border-t border-gray-300 shadow-xl z-30">
          <textarea
            className="flex-1 bg-white text-gray-800 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500 h-16 sm:h-20 border border-gray-300"
            placeholder="Écrire une nouvelle note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows="2"
          />
          <button
            onClick={handleAddNote}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full sm:rounded-lg sm:px-4 sm:py-2 p-3 text-xl sm:text-base transition min-w-[70px]"
            disabled={!newNote.trim()}
          >
            <span className="hidden sm:block">Ajouter</span>
            <span className="sm:hidden">＋</span>
          </button>
        </div>
      )}
    </div>
  );
}