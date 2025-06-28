// src/app/joueur/page.ts
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function JoueurList() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/players")
      .then((res) => res.json())
      .then((data) => {
        setPlayers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Personnages Joueurs</h1>
      <Link
        href="/joueur/create"
        className="mb-6 inline-block px-4 py-2 rounded bg-green-600 hover:bg-green-700 transition"
      >
        + Créer un nouveau personnage
      </Link>
      {players.length === 0 ? (
        <div className="text-gray-400">
          Aucun joueur trouvé. Crée ton premier personnage !
        </div>
      ) : (
        <ul>
          {players.map((p) => (
            <li key={p.id} className="mb-2">
              <Link
                href={`/joueur/${p.id}`}
                className="underline text-blue-400 hover:text-blue-600"
              >
                {p.name} (Niveau {p.niveau} - {p.classe})
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
