"use client";
import { useEffect, useState, use } from "react";

export default function Page({ params }) {
  const { slug, idCombat } = use(params);
  const [combat, setCombat] = useState(null);
  const [erreur, setErreur] = useState("");

  async function fetchCombat() {
    const res = await fetch(`/api/campagnes/${slug}/combat/${idCombat}`);
    if (res.ok) setCombat(await res.json()), setErreur("");
    else setErreur("Ce combat n'est pas (ou plus) en accès public.");
  }
  useEffect(() => {
    fetchCombat();
    const t = setInterval(fetchCombat, 2000);
    return () => clearInterval(t);
  }, []);

  if (erreur)
    return (
      <main className="max-w-xl mx-auto mt-12 bg-gray-900 rounded-xl p-8 text-center text-orange-200 text-xl shadow">
        <div className="mb-4 text-4xl">🚫</div>
        <div>{erreur}</div>
      </main>
    );

  if (!combat)
    return (
      <div className="p-8 text-lg text-center text-gray-300">Chargement…</div>
    );

  const creatures = [...combat.creatures].sort(
    (a, b) => b.initiative - a.initiative
  );

  return (
    <main className="max-w-2xl mx-auto mt-8 p-4 rounded-xl bg-gray-900 shadow text-white">
      <h1 className="text-3xl font-bold mb-4 select-none text-center">
        Suivi du Combat (Joueur)
      </h1>
      <div className="w-full overflow-x-auto">
        <table className="min-w-[500px] w-full border-separate border-spacing-y-2 text-base">
          <thead>
            <tr className="text-orange-300">
              <th className="text-left">Créature</th>
              <th>État</th>
              <th>Concentration</th>
              <th>Initiative</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {creatures.map((c) => (
              <tr
                key={c.id}
                className={
                  "rounded-lg " +
                  (c.tourActuel
                    ? "bg-green-800/60 font-bold ring-2 ring-green-400"
                    : c.pv < 0
                    ? "bg-red-900/40 text-gray-400 line-through"
                    : "bg-gray-800/80")
                }
              >
                <td className="px-3 py-2">{c.nom}</td>
                <td className="px-3 py-2">{c.etat || "—"}</td>
                <td className="px-3 py-2 text-center">
                  {c.concentration ? "✔️" : ""}
                </td>
                <td className="px-3 py-2 text-center">{c.initiative}</td>
                <td className="px-2 py-2 text-center">
                  {c.tourActuel && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded bg-green-500/90 text-white shadow">
                      🎲 Tour
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-gray-400 text-xs mt-6 text-center">
        Actualisé toutes les 2 secondes.
      </div>
    </main>
  );
}
