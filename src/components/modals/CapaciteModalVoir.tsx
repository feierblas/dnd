// src/components/modals/CapaciteModalVoir.tsx

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Capacite } from "@/types/Player";

type Props = {
  capacite: Capacite;
  onClose: () => void;
};

// Pour être sûr d’être en environnement browser
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

export default function CapaciteModalVoir({ capacite, onClose }: Props) {
  useLockBodyScroll(true);

  // Fermer avec la touche Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus auto sur la modale (pour accessibilité)
  useEffect(() => {
    const el = document.getElementById("capacite-modal-content");
    el?.focus();
  }, []);

  // Rendu dans body (portal)
  return createPortal(
    <div
      className="fixed inset-0 z-[1200] bg-black/70 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={onClose} // Ferme la modal si on clique sur le backdrop
    >
      <div
        id="capacite-modal-content"
        className="bg-gray-900 rounded-xl p-6 shadow-lg max-w-md w-full relative outline-none"
        tabIndex={0}
        onClick={(e) => e.stopPropagation()} // Empêche de fermer si clique sur la modal
      >
        <button
          className="absolute right-3 top-3 text-xl text-gray-400 hover:text-white"
          onClick={onClose}
          title="Fermer"
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold text-orange-300 mb-3">
          {capacite.nom}
        </h3>
        <div className="whitespace-pre-wrap text-base text-gray-200">
          {capacite.description}
        </div>
        {capacite.utilisationsMax !== undefined &&
          capacite.utilisationsRestantes !== undefined && (
            <div className="mb-2 text-sm text-orange-100 font-semibold pt-4">
              Utilisations : {capacite.utilisationsRestantes} /{" "}
              {capacite.utilisationsMax}
            </div>
          )}
        <div className="flex justify-end mt-4">
          <button
            className="px-4 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
}
