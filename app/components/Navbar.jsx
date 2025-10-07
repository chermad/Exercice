"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../lib/context/AuthContext";
import AuthForm from "./AuthForm";
import { useState, useEffect } from "react";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localUser, setLocalUser] = useState(null);

  // 🔹 Surveiller l'état d'authentification en temps réel
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLocalUser(user);
      if (user) {
        setShowAuthModal(false); // Ferme le modal si l'utilisateur est connecté
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Connexion avec Google via POPUP (plus fiable)
  const loginWithGoogle = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // L'utilisateur est automatiquement connecté après le popup
      console.log("Utilisateur connecté:", result.user);
      setShowAuthModal(false);
    } catch (error) {
      console.error("Erreur de connexion Google:", error);
      
      // Messages d'erreur plus explicites
      if (error.code === 'auth/popup-blocked') {
        alert("Le popup a été bloqué. Veuillez autoriser les popups pour ce site.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.log("L'utilisateur a fermé le popup");
        // Pas besoin d'alerte, c'est normal
      } else {
        alert("Erreur de connexion: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Déconnexion
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
    }
  };

  // Utiliser l'utilisateur local ou du contexte
  const currentUser = localUser || user;

  return (
    <nav className="bg-gray-900 px-3 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row justify-between items-center">
      {/* --- Partie gauche : nom du site + liens de navigation --- */}
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
        <h1 className="text-cyan-400 text-lg font-semibold">Mon site</h1>
        <ul className="flex flex-col sm:flex-row gap-3 sm:gap-8 items-center list-none m-0 p-0">
          <li>
            <Link
              href="/"
              className="text-white hover:text-cyan-400 font-medium transition-colors px-2 py-1 rounded"
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link
              href="/excercice-1"
              className="text-white hover:text-cyan-400 font-medium transition-colors px-2 py-1 rounded"
            >
              Exercice 1
            </Link>
          </li>
          <li>
            <Link
              href="/excercice-2"
              className="text-white hover:text-cyan-400 font-medium transition-colors px-2 py-1 rounded"
            >
              Exercice 2
            </Link>
          </li>
          <li>
            <Link
              href="/excercice-3"
              className="text-white hover:text-cyan-400 font-medium transition-colors px-2 py-1 rounded"
            >
              Exercice 3
            </Link>
          </li>
        </ul>
      </div>

      {/* --- Partie droite : authentification / profil --- */}
      <div className="flex items-center gap-3 mt-3 sm:mt-0">
        {currentUser ? (
          <>
            {/* Avatar + nom de l'utilisateur */}
            <div className="flex items-center gap-2">
              {currentUser.photoURL && (
                <Image
                  src={currentUser.photoURL}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-white font-medium max-w-[150px] truncate">
                {currentUser.displayName || currentUser.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors text-sm"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            {/* 🔹 Bouton principal de connexion */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded transition-colors"
            >
              Connexion
            </button>

            {/* 🔹 Bouton Google séparé */}
            <button
              onClick={loginWithGoogle}
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 px-3 py-1 rounded transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLoading ? 'Connexion...' : 'Google'}
            </button>

            {/* 🔹 Modal d'authentification */}
            {showAuthModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Connexion</h3>
                    <button
                      onClick={() => setShowAuthModal(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Formulaire d'authentification existant */}
                  <AuthForm onClose={() => setShowAuthModal(false)} />
                  
                  {/* 🔹 Séparateur */}
                  <div className="flex items-center my-4">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500 text-sm">ou</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  
                  {/* 🔹 Bouton Google dans le modal */}
                  <button
                    onClick={loginWithGoogle}
                    disabled={isLoading}
                    className={`flex items-center justify-center gap-3 font-medium py-3 px-6 rounded-lg transition shadow-sm w-full ${
                      isLoading
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {isLoading ? 'Connexion en cours...' : 'Se connecter avec Google'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
}