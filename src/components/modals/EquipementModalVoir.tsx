import { EquipementItem } from "@/types/Player";

type Props = {
  item: EquipementItem;
  onClose: () => void;
};

export default function EquipementModalVoir({ item, onClose }: Props) {
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
        <h3 className="text-2xl font-bold text-orange-300 mb-3">{item.nom}</h3>
        <div className="mb-2 flex gap-4 text-sm">
          <span
            className={
              item.magique ? "text-green-400 font-bold" : "text-gray-400"
            }
          >
            {item.magique ? "Magique" : ""}
          </span>
          <span
            className={item.lien ? "text-blue-300 font-bold" : "text-gray-400"}
          >
            {item.lien ? "Lien" : ""}
          </span>
        </div>
        {item.quantite !== undefined && (
          <div className="mb-2">
            Quantité : <span className="font-bold">{item.quantite}</span>
          </div>
        )}
        {item.rarete && (
          <div className="mb-2">
            Rareté : <span className="font-semibold">{item.rarete}</span>
          </div>
        )}
        <div className="whitespace-pre-wrap text-base text-gray-200">
          {item.description}
        </div>
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
