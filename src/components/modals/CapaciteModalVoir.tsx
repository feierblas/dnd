import { Capacite } from "@/types/Player";

type Props = {
  capacite: Capacite;
  onClose: () => void;
};

export default function CapaciteModalVoir({ capacite, onClose }: Props) {
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
    </div>
  );
}
