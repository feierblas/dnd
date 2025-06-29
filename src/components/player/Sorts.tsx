import { Sorts, SortComplet, EmplacementSort } from "@/types/Player";
import { useState } from "react";
import SortModalVoir from "@/components/modals/SortModalVoir";
import SortModalEdit from "@/components/modals/SortModalEdit";
import EditSortsCaracModal from "@/components/modals/EditSortsCaracModal";

export default function SortsSection({
  sorts,
  onChange,
}: {
  sorts: Sorts;
  onChange: (s: Sorts) => void;
}) {
  const [modalSort, setModalSort] = useState<SortComplet | null>(null);
  const [modalType, setModalType] = useState<"voir" | "edit" | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [caracModalOpen, setCaracModalOpen] = useState(false);

  // Ajout
  function addSort() {
    setModalSort({
      nom: "",
      niveau: 0,
      ecole: "",
      description: "",
      concentration: false,
      rituel: false,
      prepare: false,
      portee: "",
      duree: "",
      tempsIncantation: "",
      composantes: [],
      source: "",
    });
    setEditIndex(null);
    setModalType("edit");
  }

  // Edition
  function editSort(i: number) {
    setModalSort(sorts.connus[i]);
    setEditIndex(i);
    setModalType("edit");
  }

  // Voir
  function voirSort(i: number) {
    setModalSort(sorts.connus[i]);
    setEditIndex(i);
    setModalType("voir");
  }

  // Sauvegarde ajout/édition
  function saveSort(newSort: SortComplet) {
    let connus = [...sorts.connus];
    if (editIndex === null) {
      connus.push(newSort);
    } else {
      connus[editIndex] = newSort;
    }
    onChange({ ...sorts, connus });
    setModalSort(null);
    setEditIndex(null);
    setModalType(null);
  }

  // Suppression
  function removeSort(i: number) {
    const connus = sorts.connus.filter((_, idx) => idx !== i);
    onChange({ ...sorts, connus });
    setModalSort(null);
    setEditIndex(null);
    setModalType(null);
  }

  // Edition préparé/rituel inline
  function updateSort(index: number, patch: Partial<SortComplet>) {
    const connus = sorts.connus.map((s, i) =>
      i === index ? { ...s, ...patch } : s
    );
    onChange({ ...sorts, connus });
  }

  // Affichage des sorts préparés
  const sortsPrepares = sorts.connus.filter((s) => s.prepare);

  return (
    <section className="bg-gray-900 rounded-xl shadow p-3 w-full max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-orange-400">Sorts</h2>
        <div className="flex gap-2">
          <button
            className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded"
            onClick={() => setCaracModalOpen(true)}
            title="Éditer caractéristiques de sorts"
          >
            ✏️ Carac. sorts
          </button>
          <button
            className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded"
            onClick={addSort}
            title="Ajouter un sort"
          >
            + Ajouter
          </button>
        </div>
      </div>
      <div className="mb-2">
        <span className="font-semibold text-orange-300">Sorts préparés :</span>{" "}
        {sortsPrepares.length > 0 ? (
          sortsPrepares.map((s) => s.nom).join(", ")
        ) : (
          <span className="italic text-gray-400">Aucun</span>
        )}
      </div>
      <div className="mb-2 flex flex-wrap gap-4">
        <div>
          <span className="text-sm text-gray-300 mr-2">
            Carac. incantation :
          </span>
          <span className="font-bold text-orange-300">
            {sorts.caracteristiqueIncantation}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-300 mr-2">DD Sort :</span>
          <span className="font-bold text-orange-300">{sorts.ddSort}</span>
        </div>
        <div>
          <span className="text-sm text-gray-300 mr-2">
            Bonus attaque sort :
          </span>
          <span className="font-bold text-orange-300">
            {sorts.bonusAttaqueSort}
          </span>
        </div>
      </div>
      <div className="mb-2 flex gap-4 flex-wrap">
        {sorts.emplacements
          .filter((e) => e.total > 0)
          .sort((a, b) => a.niveau - b.niveau)
          .map((e, i) => (
            <div
              key={e.niveau}
              className="text-xs bg-gray-800 rounded p-2 shadow flex items-center gap-2"
            >
              <span className="text-orange-200 font-bold">
                Niv {e.niveau} :
              </span>
              <button
                className="px-2 py-0.5 rounded bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => {
                  if (e.restants > 0) {
                    const next = sorts.emplacements.map((emp) =>
                      emp.niveau === e.niveau
                        ? { ...emp, restants: emp.restants - 1 }
                        : emp
                    );
                    onChange({ ...sorts, emplacements: next });
                  }
                }}
                disabled={e.restants <= 0}
                title="Utiliser un emplacement"
              >
                -
              </button>
              <span>
                {e.restants} / {e.total} emplacements
              </span>
              <button
                className="px-2 py-0.5 rounded bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => {
                  if (e.restants < e.total) {
                    const next = sorts.emplacements.map((emp) =>
                      emp.niveau === e.niveau
                        ? { ...emp, restants: emp.restants + 1 }
                        : emp
                    );
                    onChange({ ...sorts, emplacements: next });
                  }
                }}
                disabled={e.restants >= e.total}
                title="Récupérer un emplacement"
              >
                +
              </button>
            </div>
          ))}
      </div>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-orange-300 border-b border-gray-700">
              <th className="text-left">Sort</th>
              <th>Niveau</th>
              <th>Préparé</th>
              <th>Rituel</th>
              <th colSpan={3}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorts.connus.map((sort, i) => (
              <tr
                key={sort.nom + i}
                className="border-b border-gray-800 hover:bg-gray-800"
              >
                <td>{sort.nom}</td>
                <td className="text-center">{sort.niveau}</td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={sort.prepare}
                    onChange={(e) =>
                      updateSort(i, { prepare: e.target.checked })
                    }
                  />
                </td>
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={sort.rituel}
                    onChange={(e) =>
                      updateSort(i, { rituel: e.target.checked })
                    }
                  />
                </td>
                <td className="text-center">
                  <button
                    className="underline text-blue-300"
                    onClick={() => voirSort(i)}
                  >
                    Voir
                  </button>
                </td>
                <td className="text-center">
                  <button
                    className="underline text-orange-400"
                    onClick={() => editSort(i)}
                  >
                    Éditer
                  </button>
                </td>
                <td className="text-center">
                  <button
                    className="text-red-400 hover:text-red-700"
                    onClick={() => removeSort(i)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modals */}
      {modalType === "voir" && modalSort && (
        <SortModalVoir
          sort={modalSort}
          onClose={() => {
            setModalSort(null);
            setEditIndex(null);
            setModalType(null);
          }}
        />
      )}
      {modalType === "edit" && modalSort && (
        <SortModalEdit
          sort={modalSort}
          onSave={saveSort}
          onClose={() => {
            setModalSort(null);
            setEditIndex(null);
            setModalType(null);
          }}
        />
      )}
      {caracModalOpen && (
        <EditSortsCaracModal
          sorts={sorts}
          onSave={(updated) => {
            onChange(updated);
            setCaracModalOpen(false);
          }}
          onClose={() => setCaracModalOpen(false)}
        />
      )}
    </section>
  );
}
