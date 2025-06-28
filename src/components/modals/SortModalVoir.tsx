import { SortComplet } from "@/types/Player";

type Props = {
  sort: SortComplet;
  onClose: () => void;
};

export default function SortModalVoir({ sort, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-40 bg-black/70 flex items-center justify-center">
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg max-w-lg w-full relative">
        <button
          className="absolute right-3 top-3 text-xl text-gray-400 hover:text-white"
          onClick={onClose}
          title="Fermer"
        >
          ✕
        </button>
        <h3 className="text-2xl font-bold text-orange-300 mb-1">{sort.nom}</h3>
        <div className="text-xs text-gray-400 mb-4 italic">
          Niveau {sort.niveau} — {sort.ecole}
        </div>
        <div className="mb-2 flex flex-wrap gap-4 text-sm">
          <div>
            <span className="font-semibold">Portée :</span> {sort.portee}
          </div>
          <div>
            <span className="font-semibold">Durée :</span> {sort.duree}
          </div>
          <div>
            <span className="font-semibold">Incantation :</span>{" "}
            {sort.tempsIncantation}
          </div>
          <div>
            <span className="font-semibold">Composantes :</span>{" "}
            {sort.composantes.join(", ")}
          </div>
          <div>
            <span className="font-semibold">Concentration :</span>{" "}
            {sort.concentration ? (
              <span className="text-green-400">Oui</span>
            ) : (
              <span className="text-gray-400">Non</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Rituel :</span>{" "}
            {sort.rituel ? (
              <span className="text-green-400">Oui</span>
            ) : (
              <span className="text-gray-400">Non</span>
            )}
          </div>
          {sort.source && (
            <div>
              <span className="font-semibold">Source :</span> {sort.source}
            </div>
          )}
          <div>
            <span className="font-semibold">Préparé :</span>{" "}
            {sort.prepare ? (
              <span className="text-green-400">Oui</span>
            ) : (
              <span className="text-gray-400">Non</span>
            )}
          </div>
        </div>
        <div className="mb-2">
          <span className="font-semibold">Description :</span>
          <div className="whitespace-pre-wrap text-base mt-1">
            {sort.description}
          </div>
        </div>
        <div className="flex justify-end">
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
