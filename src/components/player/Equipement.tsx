// /components/player/Equipement.tsx

import { EquipementItem } from "@/types/Player";

type Props = {
  equipement: EquipementItem[];
  onChange: (equipement: EquipementItem[]) => void;
};

export default function Equipement({ equipement, onChange }: Props) {
  // Ajout d’un nouvel item vide
  function addItem() {
    onChange([...equipement, { nom: "", quantite: 1 }]);
  }
  // Modification individuelle
  function updateItem(index: number, patch: Partial<EquipementItem>) {
    onChange(
      equipement.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }
  // Suppression
  function removeItem(index: number) {
    onChange(equipement.filter((_, i) => i !== index));
  }

  return (
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">Équipement</h2>
      <table className="w-full text-sm mb-2">
        <thead>
          <tr className="text-orange-300 border-b border-gray-700">
            <th>Objet</th>
            <th>Quantité</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {equipement.map((item, i) => (
            <tr key={i} className="border-b border-gray-800">
              <td>
                <input
                  type="text"
                  value={item.nom}
                  onChange={(e) => updateItem(i, { nom: e.target.value })}
                  className="w-full rounded bg-gray-800 border-gray-700 px-2"
                />
              </td>
              <td>
                <input
                  type="number"
                  min={0}
                  value={item.quantite}
                  onChange={(e) =>
                    updateItem(i, { quantite: Number(e.target.value) })
                  }
                  className="w-20 rounded bg-gray-800 border-gray-700 text-center"
                />
              </td>
              <td>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeItem(i)}
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
        className="bg-green-700 hover:bg-green-800 px-3 py-1 rounded text-white"
        onClick={addItem}
      >
        + Ajouter un objet
      </button>
    </section>
  );
}
