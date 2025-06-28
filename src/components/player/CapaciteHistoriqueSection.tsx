import { useState } from "react";
import { Capacite } from "@/types/Player";
import CapaciteModalVoir from "@/components/modals/CapaciteModalVoir";
import CapaciteModalEdit from "@/components/modals/CapaciteModalEdit";

export default function CapaciteHistoriqueSection({
  capacite,
  onChange,
}: {
  capacite?: Capacite;
  onChange: (c: Capacite) => void;
}) {
  const [modalVoir, setModalVoir] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  function updateUtilisation(delta: number) {
    if (!capacite) return;
    const max = capacite.utilisationsMax ?? 0;
    const rest = capacite.utilisationsRestantes ?? max;
    const next = Math.max(0, Math.min(max, rest + delta));
    onChange({
      ...capacite,
      utilisationsRestantes: next,
    });
  }

  return (
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">
        Capacité d’historique
      </h2>
      {capacite ? (
        <div className="mb-3">
          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between bg-gray-800 rounded-lg p-3 mb-2">
            <span className="text-lg font-bold text-orange-200">
              {capacite.nom}
            </span>
            {capacite.utilisationsMax !== undefined &&
            capacite.utilisationsRestantes !== undefined ? (
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-0.5 rounded bg-gray-700 text-white hover:bg-gray-600"
                  onClick={() => updateUtilisation(-1)}
                  disabled={capacite.utilisationsRestantes <= 0}
                >
                  -
                </button>
                <span className="font-semibold text-orange-300">
                  {capacite.utilisationsRestantes} / {capacite.utilisationsMax}
                </span>
                <button
                  className="px-2 py-0.5 rounded bg-gray-700 text-white hover:bg-gray-600"
                  onClick={() => updateUtilisation(+1)}
                  disabled={
                    capacite.utilisationsRestantes >= capacite.utilisationsMax
                  }
                >
                  +
                </button>
              </div>
            ) : (
              <span className="text-gray-400 ml-2">—</span>
            )}
          </div>
          {/* ACTIONS */}
          <div className="flex gap-2 mb-2">
            <button
              className="underline text-blue-300"
              onClick={() => setModalVoir(true)}
            >
              Voir
            </button>
            <button
              className="underline text-orange-400"
              onClick={() => setModalEdit(true)}
            >
              Éditer
            </button>
          </div>
        </div>
      ) : (
        <button
          className="text-green-600 font-bold"
          onClick={() => setModalEdit(true)}
        >
          + Ajouter une capacité d’historique
        </button>
      )}
      {modalVoir && capacite && (
        <CapaciteModalVoir
          capacite={capacite}
          onClose={() => setModalVoir(false)}
        />
      )}
      {modalEdit && (
        <CapaciteModalEdit
          capacite={capacite}
          onSave={(c) => {
            onChange(c);
            setModalEdit(false);
          }}
          onClose={() => setModalEdit(false)}
        />
      )}
    </section>
  );
}
