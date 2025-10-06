// components/Providers.jsx
"use client";
import React from "react";
import { AuthProvider } from "../../lib/context/AuthContext";
import Navbar from "./Navbar";

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <Navbar />
      {children}
    </AuthProvider>
  );
}
