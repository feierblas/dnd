// src/app/maitre/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useLockToMJ } from "@/lib/useLockToMJ";
import { CampagneList } from "@/components/campagnes/CampagneList";
import { useCampagnes } from "@/hooks/useCampagnes";

export default function MaitrePage() {
  useLockToMJ();
  const {
    campagnes,
    loading,
    erreur,
    setErreur,
    fetchCampagnes,
    createCampagne,
  } = useCampagnes();

  const [nom, setNom] = useState("");

  useEffect(() => {
    fetchCampagnes();
    // eslint-disable-next-line
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const ok = await createCampagne(nom);
    if (ok) setNom("");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-8 select-none">
        Maître du Jeu — Vos campagnes
      </h1>
      <div className="w-full max-w-lg">
        <form onSubmit={handleCreate} className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder="Nom de la nouvelle campagne"
            value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              setErreur("");
            }}
            className="flex-1 p-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-600"
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 font-semibold text-white"
            disabled={loading || !nom.trim()}
          >
            {loading ? "Création..." : "Créer"}
          </button>
        </form>
        {erreur && <div className="text-red-400 mb-4">{erreur}</div>}
        <h2 className="text-xl font-semibold mb-4">Liste des campagnes</h2>
        <CampagneList campagnes={campagnes} />
      </div>
    </main>
  );
}
