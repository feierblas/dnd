"use client";
import { useEffect, useState } from "react";

// Types de base (tu adapteras avec tes types)
type PersoMini = {
  id: string;
  name: string;
  archived?: boolean;
};

export default function PageJoueur() {
  const [persos, setPersos] = useState<PersoMini[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  // Charger tous les persos (API à implémenter côté serveur)
  async function loadPersos() {
    setLoading(true);
    const res = await fetch("/api/joueurs");
    setPersos(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    loadPersos();
  }, []);

  // Création personnage
  async function createPerso() {
    if (!newName.trim()) return;
    setCreating(true);
    await fetch("/api/joueurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setNewName("");
    setCreating(false);
    loadPersos();
  }

  // Suppression, archiver, activer
  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer ce personnage ?")) return;
    await fetch(`/api/joueurs/${id}`, { method: "DELETE" });
    loadPersos();
  }

  async function handleArchive(id: string, archive: boolean) {
    await fetch(`/api/joueurs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: archive }),
    });
    loadPersos();
  }

  // Séparation actifs / archivés
  const actifs = persos.filter((p) => !p.archived);
  const archives = persos.filter((p) => p.archived);

  return (
    <main className="min-h-screen w-full bg-gray-950 text-white flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-2xl mx-auto">
        {/* ---- Actifs ---- */}
        <h2 className="text-2xl font-bold text-orange-400 mb-4">
          Personnages actifs
        </h2>
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 rounded bg-gray-800 border border-gray-700 px-3 py-1"
            type="text"
            placeholder="Nom du nouveau personnage"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && createPerso()}
            disabled={creating}
          />
          <button
            className="bg-green-700 hover:bg-green-800 text-white px-4 py-1 rounded font-semibold"
            onClick={createPerso}
            disabled={creating || !newName.trim()}
          >
            {creating ? "Création…" : "Créer"}
          </button>
        </div>
        {(() => {
          if (loading) {
            return <div className="text-center text-gray-400">Chargement…</div>;
          } else if (actifs.length === 0) {
            return (
              <div className="text-gray-400 mb-6">Aucun personnage actif.</div>
            );
          } else {
            return (
              <div className="mb-10">
                {actifs.map((perso) => (
                  <div
                    key={perso.id}
                    className="flex items-center gap-3 py-2 px-3 bg-gray-800 rounded-lg mb-2"
                  >
                    <span className="flex-1 font-semibold">{perso.name}</span>
                    <button
                      className="bg-blue-800 hover:bg-blue-700 text-white px-2 rounded"
                      onClick={() =>
                        window.open(`/joueur/personnage//${perso.id}`, "_blank")
                      }
                      title="Voir"
                    >
                      Voir
                    </button>
                    <button
                      className="bg-yellow-700 hover:bg-yellow-600 text-white px-2 rounded"
                      onClick={() => handleArchive(perso.id, true)}
                      title="Archiver"
                    >
                      Archiver
                    </button>
                    <button
                      className="bg-red-700 hover:bg-red-600 text-white px-2 rounded"
                      onClick={() => handleDelete(perso.id)}
                      title="Supprimer"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            );
          }
        })()}

        {/* ---- Archivés ---- */}
        <h2 className="text-2xl font-bold text-orange-400 mt-8 mb-4">
          Personnages archivés
        </h2>
        {(() => {
          if (loading) {
            return <div className="text-center text-gray-400">Chargement…</div>;
          } else if (archives.length === 0) {
            return (
              <div className="text-gray-400 mb-6">
                Aucun personnage archivé.
              </div>
            );
          } else {
            return (
              <div>
                {archives.map((perso) => (
                  <div
                    key={perso.id}
                    className="flex items-center gap-3 py-2 px-3 bg-gray-800 rounded-lg mb-2"
                  >
                    <span className="flex-1 font-semibold">{perso.name}</span>
                    <button
                      className="bg-blue-800 hover:bg-blue-700 text-white px-2 rounded"
                      onClick={() =>
                        window.open(`/joueur/personnage//${perso.id}`, "_blank")
                      }
                      title="Voir"
                    >
                      Voir
                    </button>
                    <button
                      className="bg-green-700 hover:bg-green-600 text-white px-2 rounded"
                      onClick={() => handleArchive(perso.id, false)}
                      title="Activer"
                    >
                      Activer
                    </button>
                    <button
                      className="bg-red-700 hover:bg-red-600 text-white px-2 rounded"
                      onClick={() => handleDelete(perso.id)}
                      title="Supprimer"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            );
          }
        })()}
      </div>
    </main>
  );
}
