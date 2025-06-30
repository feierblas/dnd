import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Capacite } from "@/types/Player";

type Props = {
  onAdd: (cap: Capacite) => void;
  onClose: () => void;
};

// Scroll lock du body quand la modal est ouverte
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

export default function CapaciteModalAdd({ onAdd, onClose }: Props) {
  useLockBodyScroll(true);

  const [nom, setNom] = useState("");
  const [desc, setDesc] = useState("");

  // Fermer avec la touche Escape
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
        className="bg-gray-900 rounded-xl p-6 shadow-lg max-w-md w-full relative outline-none"
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
        <h3 className="text-2xl font-bold text-orange-300 mb-3">
          Nouvelle capacité
        </h3>
        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">Nom</label>
          <input
            type="text"
            className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">
            Description
          </label>
          <textarea
            className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
            value={desc}
            rows={4}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-1 bg-green-700 text-white rounded hover:bg-green-800"
            onClick={() => {
              if (nom.trim()) {
                onAdd({ nom: nom.trim(), description: desc.trim() });
              }
              onClose();
            }}
            disabled={!nom.trim()}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
}
