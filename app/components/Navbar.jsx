"use client";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../lib/context/AuthContext";
import AuthForm from "./AuthForm";
import { useState } from "react";

export default function Navbar() {
  const { user, loginWithGoogle, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

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
        {user ? (
          <>
            {/* Avatar + nom de l'utilisateur */}
            <div className="flex items-center gap-2">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-white font-medium">
                {user.displayName || user.email}
              </span>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowAuth(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded transition-colors"
            >
              Connexion / Inscription
            </button>

            {showAuth && (
              <AuthForm onClose={() => setShowAuth(false)} />
            )}
          </>
        )}
      </div>
    </nav>
  );
}
