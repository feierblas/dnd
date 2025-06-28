import { useState } from "react";
import { Capacite } from "@/types/Player";

type Props = {
  capacite?: Capacite; // undefined pour ajout, défini pour édition
  onSave: (c: Capacite) => void;
  onClose: () => void;
};

export default function CapaciteModalEdit({
  capacite,
  onSave,
  onClose,
}: Props) {
  const [nom, setNom] = useState(capacite?.nom ?? "");
  const [desc, setDesc] = useState(capacite?.description ?? "");
  const [utilMax, setUtilMax] = useState<number | undefined>(
    capacite?.utilisationsMax ?? undefined
  );
  const [utilRest, setUtilRest] = useState<number | undefined>(
    capacite?.utilisationsRestantes ?? capacite?.utilisationsMax ?? undefined
  );

  function handleSave() {
    if (!nom.trim()) return;
    const cap: Capacite = {
      nom: nom.trim(),
      description: desc.trim(),
      ...(utilMax !== undefined && utilMax > 0
        ? {
            utilisationsMax: utilMax,
            utilisationsRestantes:
              utilRest !== undefined ? Math.min(utilRest, utilMax) : utilMax,
          }
        : {}),
    };
    onSave(cap);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg max-w-md w-full relative">
        <button
          className="absolute right-3 top-3 text-xl text-gray-400 hover:text-white"
          onClick={onClose}
          title="Fermer"
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold text-orange-300 mb-3">
          {capacite ? "Éditer la capacité" : "Nouvelle capacité"}
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
        <div className="mb-3 flex gap-2 items-center">
          <label className="block text-sm text-gray-400 mb-1">
            Nombre d’utilisations max (optionnel)
          </label>
          <input
            type="number"
            className="w-20 rounded bg-gray-800 border-gray-700 px-2 py-1"
            value={utilMax ?? ""}
            min={0}
            onChange={(e) => {
              const v = Number(e.target.value);
              setUtilMax(isNaN(v) || v <= 0 ? undefined : v);
              setUtilRest(isNaN(v) || v <= 0 ? undefined : v);
            }}
            placeholder="ex: 2"
          />
        </div>
        {utilMax !== undefined && utilMax > 0 && (
          <div className="mb-3 flex gap-2 items-center">
            <label className="block text-sm text-gray-400 mb-1">
              Utilisations restantes
            </label>
            <input
              type="number"
              className="w-20 rounded bg-gray-800 border-gray-700 px-2 py-1"
              value={utilRest ?? ""}
              min={0}
              max={utilMax}
              onChange={(e) => {
                const v = Number(e.target.value);
                setUtilRest(isNaN(v) ? utilMax : Math.min(v, utilMax));
              }}
            />
            <span className="text-xs text-gray-400">/ {utilMax}</span>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-1 bg-green-700 text-white rounded hover:bg-green-800"
            onClick={handleSave}
            disabled={!nom.trim()}
          >
            Sauver
          </button>
        </div>
      </div>
    </div>
  );
}
