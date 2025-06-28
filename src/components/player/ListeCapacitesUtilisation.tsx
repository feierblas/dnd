import { Capacite } from "@/types/Player";
import { useState } from "react";
import CapaciteModalVoir from "@/components/modals/CapaciteModalVoir";
import CapaciteModalEdit from "@/components/modals/CapaciteModalEdit";

type Props = {
  titre: string;
  capacites: Capacite[];
  onChange: (capacites: Capacite[]) => void;
};

export default function ListeCapacitesUtilisation({
  titre,
  capacites,
  onChange,
}: Props) {
  const [modalVoir, setModalVoir] = useState<number | null>(null);
  const [modalEdit, setModalEdit] = useState<number | null>(null);
  const [modalAdd, setModalAdd] = useState(false);

  function handleChangeCapacite(idx: number, patch: Partial<Capacite>) {
    onChange(
      capacites.map((cap, i) => (i === idx ? { ...cap, ...patch } : cap))
    );
  }
  function removeCapacite(idx: number) {
    onChange(capacites.filter((_, i) => i !== idx));
  }
  function addCapacite(cap: Capacite) {
    onChange([...capacites, cap]);
  }

  return (
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">{titre}</h2>
      <table className="w-full mb-2">
        <thead>
          <tr className="text-orange-200 text-xs">
            <th className="text-left">Nom</th>
            <th className="text-center">Utilisation</th>
            <th></th>
            <th></th>
            <th className="text-right"></th>
          </tr>
        </thead>
        <tbody>
          {capacites.map((cap, i) => (
            <tr key={i}>
              <td>{cap.nom}</td>
              <td className="text-center">
                {cap.utilisationsMax !== undefined &&
                cap.utilisationsRestantes !== undefined ? (
                  <>
                    <button
                      className="px-2 py-0.5 rounded bg-gray-700 text-white hover:bg-gray-600 mr-1"
                      onClick={() =>
                        handleChangeCapacite(i, {
                          utilisationsRestantes: Math.max(
                            0,
                            (cap.utilisationsRestantes ?? 0) - 1
                          ),
                        })
                      }
                      disabled={cap.utilisationsRestantes <= 0}
                    >
                      -
                    </button>
                    <span>
                      {cap.utilisationsRestantes} / {cap.utilisationsMax}
                    </span>
                    <button
                      className="px-2 py-0.5 rounded bg-gray-700 text-white hover:bg-gray-600 ml-1"
                      onClick={() =>
                        handleChangeCapacite(i, {
                          utilisationsRestantes: Math.min(
                            (cap.utilisationsRestantes ?? 0) + 1,
                            cap.utilisationsMax!
                          ),
                        })
                      }
                      disabled={
                        cap.utilisationsRestantes! >= cap.utilisationsMax!
                      }
                    >
                      +
                    </button>
                  </>
                ) : (
                  <span className="text-gray-400">—</span>
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
                  Modifier
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
        + Ajouter
      </button>

      {modalVoir !== null && (
        <CapaciteModalVoir
          capacite={capacites[modalVoir]}
          onClose={() => setModalVoir(null)}
        />
      )}
      {modalEdit !== null && (
        <CapaciteModalEdit
          capacite={capacites[modalEdit]}
          onSave={(c) => {
            handleChangeCapacite(modalEdit, c);
            setModalEdit(null);
          }}
          onClose={() => setModalEdit(null)}
        />
      )}
      {modalAdd && (
        <CapaciteModalEdit
          onSave={(c) => {
            addCapacite(c);
            setModalAdd(false);
          }}
          onClose={() => setModalAdd(false)}
        />
      )}
    </section>
  );
}
