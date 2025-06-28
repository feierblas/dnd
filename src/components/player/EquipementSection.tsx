import { EquipementItem } from "@/types/Player";
import { useState } from "react";
import EquipementModalVoir from "@/components/modals/EquipementModalVoir";
import EquipementModalEdit from "@/components/modals/EquipementModalEdit";

type Props = {
  equipement: EquipementItem[];
  onChange: (equipement: EquipementItem[]) => void;
};

export default function EquipementSection({ equipement, onChange }: Props) {
  const [modalVoir, setModalVoir] = useState<number | null>(null);
  const [modalEdit, setModalEdit] = useState<number | null>(null);
  const [modalAdd, setModalAdd] = useState(false);

  function addEquipement(item: EquipementItem) {
    onChange([...equipement, item]);
  }
  function updateEquipement(idx: number, item: EquipementItem) {
    onChange(equipement.map((it, i) => (i === idx ? item : it)));
  }
  function removeEquipement(idx: number) {
    onChange(equipement.filter((_, i) => i !== idx));
  }

  return (
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">Équipement</h2>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-orange-200 text-xs">
            <th className="text-left">Nom</th>
            <th className="text-center">Quantité</th>
            <th className="text-center">Magique</th>
            <th className="text-center">Lien</th>
            <th className="text-left"></th>
            <th className="text-left"></th>
            <th className="text-right"></th>
          </tr>
        </thead>
        <tbody>
          {equipement.map((item, i) => (
            <tr key={i}>
              <td>{item.nom}</td>
              <td className="text-center">{item.quantite ?? 1}</td>
              <td className="text-center">
                {item.magique ? (
                  <span className="px-2 py-0.5 bg-green-900 text-green-400 rounded text-xs font-semibold">
                    Magique
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Non</span>
                )}
              </td>
              <td className="text-center">
                {item.lien ? (
                  <span className="px-2 py-0.5 bg-blue-900 text-blue-300 rounded text-xs font-semibold">
                    Lien
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">Non</span>
                )}
              </td>
              <td>
                <button
                  className="underline text-blue-300"
                  onClick={() => setModalVoir(i)}
                >
                  Voir
                </button>
              </td>
              <td>
                <button
                  className="underline text-orange-400"
                  onClick={() => setModalEdit(i)}
                >
                  Éditer
                </button>
              </td>
              <td className="text-right">
                <button
                  className="text-red-400 hover:text-red-700 text-xs"
                  onClick={() => removeEquipement(i)}
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
        + Ajouter un objet
      </button>

      {modalVoir !== null && (
        <EquipementModalVoir
          item={equipement[modalVoir]}
          onClose={() => setModalVoir(null)}
        />
      )}
      {modalEdit !== null && (
        <EquipementModalEdit
          item={equipement[modalEdit]}
          onSave={(item) => {
            updateEquipement(modalEdit, item);
            setModalEdit(null);
          }}
          onClose={() => setModalEdit(null)}
        />
      )}
      {modalAdd && (
        <EquipementModalEdit
          onSave={(item) => {
            addEquipement(item);
            setModalAdd(false);
          }}
          onClose={() => setModalAdd(false)}
        />
      )}
    </section>
  );
}
