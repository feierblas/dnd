import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EquipementItem } from "@/types/Player";

type Props = {
  item?: EquipementItem;
  onSave: (item: EquipementItem) => void;
  onClose: () => void;
};

// Lock scroll du body si modal ouverte
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

export default function EquipementModalEdit({ item, onSave, onClose }: Props) {
  useLockBodyScroll(true);

  const [nom, setNom] = useState(item?.nom ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [quantite, setQuantite] = useState(item?.quantite ?? 1);
  const [magique, setMagique] = useState(item?.magique ?? false);
  const [lien, setLien] = useState(item?.lien ?? false);
  const [rarete, setRarete] = useState(item?.rarete ?? "");

  // Escape pour fermer la modale
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Focus auto à l'ouverture
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
          {item ? "Éditer un objet" : "Nouvel objet"}
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
        <div className="mb-3 flex gap-2">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Quantité</label>
            <input
              type="number"
              className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={quantite}
              min={1}
              onChange={(e) => setQuantite(Number(e.target.value))}
            />
          </div>
          <div className="flex flex-col gap-2 justify-end ml-4">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={magique}
                onChange={(e) => setMagique(e.target.checked)}
              />
              Objet magique
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={lien}
                onChange={(e) => setLien(e.target.checked)}
              />
              Lien
            </label>
          </div>
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">
            Description
          </label>
          <textarea
            className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
            value={description}
            rows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm text-gray-400 mb-1">Rareté</label>
          <input
            type="text"
            className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1"
            value={rarete}
            onChange={(e) => setRarete(e.target.value)}
            placeholder="(optionnel)"
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
                onSave({
                  nom: nom.trim(),
                  description: description.trim(),
                  quantite,
                  magique,
                  lien,
                  rarete: rarete.trim() || undefined,
                });
              }
              onClose();
            }}
            disabled={!nom.trim()}
          >
            Sauver
          </button>
        </div>
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
}
