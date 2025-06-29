import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SortComplet } from "@/types/Player";

type Props = {
  sort: SortComplet;
  onSave: (sort: SortComplet) => void;
  onClose: () => void;
};

// Lock scroll body quand la modal est ouverte
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

export default function SortModalEdit({ sort, onSave, onClose }: Props) {
  useLockBodyScroll(true);

  const [value, setValue] = useState<SortComplet>(sort);

  function handleChange<K extends keyof SortComplet>(key: K, v: any) {
    setValue((prev) => ({ ...prev, [key]: v }));
  }

  function handleComposantes(s: string) {
    setValue((prev) => ({
      ...prev,
      composantes: s
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean),
    }));
  }

  // Escape pour fermer
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus auto sur la modale à l'ouverture
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

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
          {sort.nom ? "Éditer un sort" : "Nouveau sort"}
        </h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-sm text-gray-400">Nom</label>
            <input
              type="text"
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={value.nom}
              onChange={(e) => handleChange("nom", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Niveau</label>
            <input
              type="number"
              min={0}
              max={9}
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={value.niveau}
              onChange={(e) => handleChange("niveau", Number(e.target.value))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-sm text-gray-400">École</label>
            <input
              type="text"
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={value.ecole}
              onChange={(e) => handleChange("ecole", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Source</label>
            <input
              type="text"
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={value.source}
              onChange={(e) => handleChange("source", e.target.value)}
            />
          </div>
        </div>
        <div className="mb-2">
          <label className="block text-sm text-gray-400">Description</label>
          <textarea
            className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
            value={value.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-sm text-gray-400">Portée</label>
            <input
              type="text"
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={value.portee}
              onChange={(e) => handleChange("portee", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Durée</label>
            <input
              type="text"
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={value.duree}
              onChange={(e) => handleChange("duree", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-sm text-gray-400">
              Temps d'incantation
            </label>
            <input
              type="text"
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={value.tempsIncantation}
              onChange={(e) => handleChange("tempsIncantation", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400">Composantes</label>
            <input
              type="text"
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={value.composantes.join(", ")}
              onChange={(e) => handleComposantes(e.target.value)}
              placeholder="V, S, M"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={value.concentration}
              onChange={(e) => handleChange("concentration", e.target.checked)}
            />
            Concentration
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={value.rituel}
              onChange={(e) => handleChange("rituel", e.target.checked)}
            />
            Rituel
          </label>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={value.prepare}
              onChange={(e) => handleChange("prepare", e.target.checked)}
            />
            Préparé
          </label>
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-1 bg-green-700 text-white rounded hover:bg-green-800"
            onClick={() => onSave(value)}
          >
            Sauver
          </button>
        </div>
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
}
