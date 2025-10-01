"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // Assurez-vous que ce chemin est correct

// 1. Constantes pour l'optimisation et la lisibilité
const NEW_MESSAGE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

const formatTimestamp = (timestamp) => {
  if (!timestamp?.seconds) return "---";
  return new Date(timestamp.seconds * 1000).toLocaleString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// 2. Composant enfant optimisé avec React.memo
const NoteItem = React.memo(({ note, currentTime, setEditingNote, setEditText, setNoteToDelete }) => {
    
    const isNew = (note) => {
        if (!note.createdAt?.seconds) return false;
        const creationTime = note.createdAt.seconds * 1000;
        return currentTime - creationTime <= NEW_MESSAGE_DURATION;
    };

    const isRecent = isNew(note);

    return (
        <li className={`
            p-4 border rounded-lg shadow-md relative
            transition duration-500 transform hover:shadow-xl hover:scale-[1.01] /* 💡 Effet au survol */
            ${isRecent ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}
        `}>
            {/* Affichage du badge si la note est nouvelle */}
            {isRecent && (
                <span className="
                    absolute top-0 right-0 mt-[-10px] mr-[-10px] 
                    bg-blue-600 text-white text-xs font-bold 
                    px-2 py-0.5 rounded-full uppercase tracking-wider
                    shadow-lg animate-bounce /* 💡 Effet de rebond pour les nouveaux messages */
                ">
                    Nouveau
                </span>
            )}
            
            <p className="text-gray-800 text-base mb-1">{note.text}</p>
            
            <div className="text-xs text-gray-500 mt-2 border-t pt-2 border-gray-100">
                <p>
                    **Créé** : {formatTimestamp(note.createdAt)}
                </p>
                {note.updatedAt?.seconds && (
                    <p className="text-gray-400">
                        **Modifié** : {formatTimestamp(note.updatedAt)}
                    </p>
                )}
            </div>

            <div className="flex gap-2 mt-3">
                <button
                    onClick={() => {
                        setEditingNote(note.id);
                        setEditText(note.text);
                    }}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm transition duration-300 transform hover:scale-105"
                >
                    Modifier
                </button>
                <button
                    onClick={() => setNoteToDelete(note.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition duration-300 transform hover:scale-105"
                >
                    Supprimer
                </button>
            </div>
        </li>
    );
});
NoteItem.displayName = 'NoteItem';


// 3. Composant principal (NotesPage)
export default function NotesPage() {
    // ... (États et Timers inchangés) ...
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [editingNote, setEditingNote] = useState(null);
    const [editText, setEditText] = useState("");
    const [noteToDelete, setNoteToDelete] = useState(null);
    
    const [currentTime, setCurrentTime] = useState(Date.now()); 

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 60000); 
        return () => clearInterval(timer);
    }, []);

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

    const handleAddNote = useCallback(async () => {
        if (!newNote.trim()) return;
        await addDoc(collection(db, "notes"), {
            text: newNote,
            createdAt: serverTimestamp(),
            updatedAt: null,
        });
        setNewNote("");
    }, [newNote]);

    const handleUpdateNote = useCallback(async (id) => {
        if (!editText.trim()) return;
        const noteRef = doc(db, "notes", id);
        await updateDoc(noteRef, {
            text: editText,
            updatedAt: serverTimestamp(),
        });
        setEditingNote(null);
        setEditText("");
    }, [editText]);

    const handleDeleteNote = useCallback(async () => {
        if (!noteToDelete) return;
        await deleteDoc(doc(db, "notes", noteToDelete));
        setNoteToDelete(null);
    }, [noteToDelete]);

    // Rendu
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="p-6 max-w-2xl mx-auto pb-32 md:pb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-2">
                    📝 Gestionnaire de Notes
                </h1>

                {/* Liste des notes */}
                <ul className="space-y-6">
                    {notes.map((note) => (
                        <React.Fragment key={note.id}>
                            {editingNote === note.id ? (
                                // Mode édition (Stylisé comme un modal in-place)
                                <li className="p-4 border-2 border-green-500 rounded-lg shadow-xl bg-white space-y-3 transition duration-300">
                                    <h3 className="text-lg font-semibold text-green-600">Modification de la Note</h3>
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="border p-3 w-full rounded-md focus:ring-2 focus:ring-green-500 transition"
                                    />
                                    <div className="flex gap-3 justify-end">
                                        <button
                                            onClick={() => handleUpdateNote(note.id)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition duration-300 transform hover:scale-105"
                                        >
                                            Sauvegarder
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingNote(null);
                                                setEditText("");
                                            }}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition duration-300 transform hover:scale-105"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </li>
                            ) : (
                                // Rendu du composant enfant optimisé
                                <NoteItem 
                                    note={note}
                                    currentTime={currentTime}
                                    setEditingNote={setEditingNote}
                                    setEditText={setEditText}
                                    setNoteToDelete={setNoteToDelete}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            </div>
            
            {/* Barre d'ajout de note (Fixed Bottom sur Mobile) */}
            <div className="
                fixed bottom-0 left-0 right-0 bg-white 
                p-4 border-t shadow-2xl z-10 
                md:static md:p-0 md:shadow-none md:border-none md:mb-6
            ">
                <div className="max-w-2xl mx-auto flex gap-3">
                    <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Écrire une nouvelle note..."
                        className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                    />
                    <button
                        onClick={handleAddNote}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Ajouter
                    </button>
                </div>
            </div>


            {/* Modal de confirmation de suppression (avec un fond plus clair) */}
            {noteToDelete && (
                <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50 p-4">
                    {/* 💡 Animation : Transition d'échelle lors de l'apparition */}
                    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full transition duration-300 transform scale-100 animate-in fade-in zoom-in-50">
                        <p className="text-xl font-semibold mb-4 text-gray-800">Confirmer la suppression</p>
                        <p className="mb-6 text-gray-600">Êtes-vous sûr de vouloir supprimer cette note de manière définitive ?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setNoteToDelete(null)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2 rounded-lg font-medium transition duration-300"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteNote}
                                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition duration-300"
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}