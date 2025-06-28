import { Capacite, Race } from "@/types/Player";
import { useState } from "react";
import CapaciteModalVoir from "@/components/modals/CapaciteModalVoir";
import CapaciteModalAdd from "@/components/modals/CapaciteModalAdd";

type Props = {
  race: Race;
  onChangeRace: (race: Race) => void;
  capacites: Capacite[];
  onChange: (capacites: Capacite[]) => void;
};

export default function ListeTraitsEspece({
  race,
  onChangeRace,
  capacites,
  onChange,
}: Props) {
  const [modalVoir, setModalVoir] = useState<number | null>(null);
  const [modalAdd, setModalAdd] = useState(false);

  function addCapacite(cap: Capacite) {
    onChange([...capacites, cap]);
  }
  function removeCapacite(idx: number) {
    onChange(capacites.filter((_, i) => i !== idx));
  }

  return (
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
      <div className="flex items-center gap-4 mb-2">
        <label className="font-semibold text-orange-400 text-lg">Race :</label>
        <input
          value={race.nom}
          onChange={(e) => onChangeRace({ ...race, nom: e.target.value })}
          className="rounded bg-gray-800 border-gray-700 px-2 py-1 w-64"
          placeholder="Nom de la race"
        />
      </div>
      <h2 className="text-xl font-semibold mb-4 text-orange-400">
        Traits d'espèce
      </h2>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-orange-200 text-xs">
            <th className="text-left">Nom</th>
            <th></th>
            <th className="text-right"></th>
          </tr>
        </thead>
        <tbody>
          {capacites.map((cap, i) => (
            <tr key={i}>
              <td className="py-1">{cap.nom}</td>
              <td>
                <button
                  className="underline text-blue-300"
                  onClick={() => setModalVoir(i)}
                >
                  Voir
                </button>
              </td>
              <td className="text-right">
                <button
                  className="text-red-400 hover:text-red-700 text-xs"
                  onClick={() => removeCapacite(i)}
                  title="Supprimer"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="text-green-600 font-bold mt-2"
        onClick={() => setModalAdd(true)}
      >
        + Ajouter un trait
      </button>

      {modalVoir !== null && (
        <CapaciteModalVoir
          capacite={capacites[modalVoir]}
          onClose={() => setModalVoir(null)}
        />
      )}
      {modalAdd && (
        <CapaciteModalAdd
          onAdd={addCapacite}
          onClose={() => setModalAdd(false)}
        />
      )}
    </section>
  );
}
