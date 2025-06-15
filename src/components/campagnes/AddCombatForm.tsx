"use client";
import React, { useRef, useState } from "react";

type AddCombatFormProps = {
  value: string;
  error?: string;
  loading?: boolean;
  onSubmit: (nom: string) => void;
  compact?: boolean;
};

export default function AddCombatForm({
  value = "",
  error = "",
  loading = false,
  onSubmit,
  compact = false,
}: Readonly<AddCombatFormProps>) {
  const [nom, setNom] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(nom);
    setNom("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={
        compact ? "flex gap-2 w-full" : "flex flex-col gap-2 w-full max-w-xs"
      }
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Nom du combat"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className={
          "p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-600 flex-1"
        }
        disabled={loading}
        required
      />
      <button
        type="submit"
        className={
          compact
            ? "px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 font-semibold text-white"
            : "px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 font-semibold text-white w-full"
        }
        disabled={loading || !nom.trim()}
      >
        {loading ? "Création..." : "Créer un combat"}
      </button>
      {error && <div className="text-red-400">{error}</div>}
    </form>
  );
}
