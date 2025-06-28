// /components/player/IdentitePerso.tsx

import { Player } from "@/types/Player";
import { useState } from "react";

type Props = {
  player: Player;
  onChange: (fields: Partial<Player>) => void;
};

export default function IdentitePerso({ player, onChange }: Props) {
  const [apparence, setApparence] = useState(player.apparence);

  function handleApparence<K extends keyof typeof apparence>(
    key: K,
    value: any
  ) {
    const next = { ...apparence, [key]: value };
    setApparence(next);
    onChange({ apparence: next });
  }

  return (
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">
        Identité et histoire
      </h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          value={player.race.nom}
          onChange={(e) =>
            onChange({ race: { ...player.race, nom: e.target.value } })
          }
          className="rounded bg-gray-800 border-gray-700 px-2 py-1"
          placeholder="Race"
        />
        <input
          type="text"
          value={player.historique}
          onChange={(e) => onChange({ historique: e.target.value })}
          className="rounded bg-gray-800 border-gray-700 px-2 py-1"
          placeholder="Historique"
        />
        <input
          type="text"
          value={player.alignement}
          onChange={(e) => onChange({ alignement: e.target.value })}
          className="rounded bg-gray-800 border-gray-700 px-2 py-1"
          placeholder="Alignement"
        />
      </div>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="number"
          value={apparence.age ?? ""}
          onChange={(e) => handleApparence("age", Number(e.target.value))}
          className="w-20 rounded bg-gray-800 border-gray-700 px-2 py-1"
          placeholder="Âge"
        />
        <input
          type="text"
          value={apparence.taille ?? ""}
          onChange={(e) => handleApparence("taille", e.target.value)}
          className="w-20 rounded bg-gray-800 border-gray-700 px-2 py-1"
          placeholder="Taille"
        />
        <input
          type="text"
          value={apparence.poids ?? ""}
          onChange={(e) => handleApparence("poids", e.target.value)}
          className="w-20 rounded bg-gray-800 border-gray-700 px-2 py-1"
          placeholder="Poids"
        />
        <input
          type="text"
          value={apparence.couleurYeux ?? ""}
          onChange={(e) => handleApparence("couleurYeux", e.target.value)}
          className="w-24 rounded bg-gray-800 border-gray-700 px-2 py-1"
          placeholder="Yeux"
        />
      </div>
      <textarea
        value={apparence.description ?? ""}
        onChange={(e) => handleApparence("description", e.target.value)}
        className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1 mb-4"
        rows={2}
        placeholder="Description physique"
      />
      <textarea
        value={player.histoire}
        onChange={(e) => onChange({ histoire: e.target.value })}
        className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1 mb-4"
        rows={3}
        placeholder="Histoire du personnage"
      />
      <textarea
        value={player.personnalite}
        onChange={(e) => onChange({ personnalite: e.target.value })}
        className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
        rows={2}
        placeholder="Personnalité, traits, motivations"
      />
      <div className="mb-4">
        <label className="block text-sm text-gray-400 mb-1">Langues</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {player.langues.map((langue, i) => (
            <div
              key={i}
              className="flex items-center gap-1 bg-gray-800 rounded px-2 py-1"
            >
              <span>{langue}</span>
              <button
                className="text-red-400 hover:text-red-700 text-xs"
                onClick={() =>
                  onChange({
                    langues: player.langues.filter((_, j) => j !== i),
                  })
                }
                title="Supprimer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Nouvelle langue"
          className="rounded bg-gray-800 border-gray-700 px-2 py-1 w-48 mr-2"
          onKeyDown={(e) => {
            const value = (e.target as HTMLInputElement).value.trim();
            if (e.key === "Enter" && value) {
              onChange({ langues: [...player.langues, value] });
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <span className="text-gray-400 text-xs">
          (Appuyez sur Entrée pour ajouter)
        </span>
      </div>
    </section>
  );
}
