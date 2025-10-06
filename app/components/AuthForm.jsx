// components/AuthForm.jsx
"use client";
import React, { useState } from "react";
import { useAuth } from "../../lib/context/AuthContext";

export default function AuthForm({ onClose }) {
  const { signupWithEmail, signinWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin"); // or 'signup'
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "signup") {
        await signupWithEmail(email, password);
      } else {
        await signinWithEmail(email, password);
      }
      onClose?.();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 bg-white text-black rounded shadow-md">
      <form onSubmit={submit} className="flex flex-col gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <input value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="mot de passe" />
        <div className="flex gap-2">
          <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
            {mode === "signup" ? "S'inscrire" : "Se connecter"}
          </button>
          <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")} className="px-3 py-1 bg-gray-300 rounded">
            {mode === "signup" ? "J'ai déjà un compte" : "Créer un compte"}
          </button>
        </div>
        {error && <p className="text-red-600">{error}</p>}
      </form>
    </div>
  );
}
