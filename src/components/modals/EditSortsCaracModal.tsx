import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Sorts, EmplacementSort } from "@/types/Player";

type Carac = "intelligence" | "sagesse" | "charisme";

type Props = {
  sorts: Sorts;
  onSave: (sorts: Sorts) => void;
  onClose: () => void;
};

// Lock scroll sur le body si ouvert
function useLockBodyScroll(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [lock]);
}

export default function EditSortsCaracModal({ sorts, onSave, onClose }: Props) {
  useLockBodyScroll(true);

  const [carac, setCarac] = useState<Carac>(
    sorts.caracteristiqueIncantation as Carac
  );
  const [bonusAttaqueSort, setBonusAttaqueSort] = useState(
    sorts.bonusAttaqueSort
  );
  const [ddSort, setDdSort] = useState(sorts.ddSort);
  const [emplacements, setEmplacements] = useState<EmplacementSort[]>(
    sorts.emplacements
  );

  // Escape pour fermer la modale
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus auto
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  function updateEmplacementTotal(index: number, total: number) {
    setEmplacements((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              total,
              restants:
                total < item.restants
                  ? total
                  : item.restants === item.total
                  ? total
                  : item.restants,
            }
          : item
      )
    );
  }
  function removeEmplacement(index: number) {
    setEmplacements((e) => e.filter((_, i) => i !== index));
  }
  function addEmplacement() {
    const used = new Set(emplacements.map((e) => e.niveau));
    let next = 1;
    while (used.has(next) && next < 10) next++;
    setEmplacements((e) => [...e, { niveau: next, total: 1, restants: 1 }]);
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[1200] bg-black/70 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="bg-gray-900 rounded-xl p-6 shadow-lg max-w-lg w-full relative outline-none"
        tabIndex={0}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-3 top-3 text-xl text-gray-400 hover:text-white"
          onClick={onClose}
          title="Fermer"
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold text-orange-300 mb-4">
          Caractéristiques des sorts
        </h3>
        <div className="mb-3 flex flex-col gap-2">
          <label className="block text-sm text-gray-400">
            Caractéristique d’incantation
          </label>
          <select
            className="rounded bg-gray-800 border-gray-700 px-2 py-1"
            value={carac}
            onChange={(e) => setCarac(e.target.value as Carac)}
          >
            <option value="intelligence">Intelligence</option>
            <option value="sagesse">Sagesse</option>
            <option value="charisme">Charisme</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-sm text-gray-400">
              Bonus attaque sort
            </label>
            <input
              type="number"
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={bonusAttaqueSort}
              onChange={(e) => setBonusAttaqueSort(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400">DD sort</label>
            <input
              type="number"
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={ddSort}
              onChange={(e) => setDdSort(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="mb-2">
          <label className="block text-sm text-gray-400 mb-1">
            Emplacements de sorts
          </label>
          {emplacements
            .sort((a, b) => a.niveau - b.niveau)
            .map((e, i) => (
              <div key={i} className="flex gap-2 items-center mb-1">
                <span className="w-20">Niveau {e.niveau}</span>
                <input
                  type="number"
                  className="w-16 rounded bg-gray-800 border-gray-700 px-2 py-1"
                  value={e.total}
                  min={0}
                  onChange={(ev) => {
                    const newTotal = Number(ev.target.value);
                    updateEmplacementTotal(i, newTotal);
                  }}
                  placeholder="Total"
                />
                <span className="text-gray-400 text-xs">
                  (restants : {Math.min(e.restants, e.total)})
                </span>
                <button
                  className="text-red-400 hover:text-red-700"
                  onClick={() => removeEmplacement(i)}
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            ))}
          <button
            className="mt-2 text-green-600 font-bold"
            onClick={addEmplacement}
          >
            + Ajouter un niveau
          </button>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="px-4 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-1 bg-green-700 text-white rounded hover:bg-green-800"
            onClick={() =>
              onSave({
                ...sorts,
                caracteristiqueIncantation: carac,
                bonusAttaqueSort,
                ddSort,
                emplacements,
              })
            }
          >
            Sauver
          </button>
        </div>
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
}
