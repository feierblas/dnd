import { useState } from "react";
import { Capacite } from "@/types/Player";

type Props = {
  onAdd: (cap: Capacite) => void;
  onClose: () => void;
};

export default function CapaciteModalAdd({ onAdd, onClose }: Props) {
  const [nom, setNom] = useState("");
  const [desc, setDesc] = useState("");

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
    </div>
  );
}
