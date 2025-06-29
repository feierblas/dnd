// /components/player/MaitrisesSection.tsx

import { useEffect, useState } from "react";
import { Maitrises, Arme } from "@/types/Player";

type Props = {
  maitrises: Maitrises;
  onChangeMaitrises: (m: Maitrises) => void;
};

export default function MaitrisesSection({
  maitrises,
  onChangeMaitrises,
}: Props) {
  // États locaux pour édition différée
  const [tempArmures, setTempArmures] = useState<string[]>(maitrises.armures);
  const [tempArmes, setTempArmes] = useState<string[]>(maitrises.armes);
  const [tempOutils, setTempOutils] = useState<string[]>(maitrises.outils);

  function removeArray(list: string[], i: number) {
    return list.filter((_, idx) => idx !== i);
  }
  function addArray(list: string[]) {
    return [...list, ""];
  }

  // Fonction factorisée pour éviter de dupliquer le JSX des trois blocs
  function renderList(
    label: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    key: keyof Maitrises
  ) {
    return (
      <div>
        <div className="font-semibold text-gray-300 mb-1 text-xs">{label}</div>
        {items.map((v, i) => (
          <div key={i} className="flex gap-0.5 mb-0.5">
            <input
              type="text"
              value={v}
              onChange={(e) =>
                setItems((arr) =>
                  arr.map((item, idx) => (idx === i ? e.target.value : item))
                )
              }
              onBlur={() => onChangeMaitrises({ ...maitrises, [key]: items })}
              className="rounded bg-gray-800 border-gray-700 px-2 py-0.5 text-xs"
            />
            <button
              className="text-red-500 hover:text-red-700 text-xs"
              onClick={() => {
                const updated = removeArray(items, i);
                setItems(updated);
                onChangeMaitrises({ ...maitrises, [key]: updated });
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          className="text-green-600 font-bold text-xs"
          onClick={() => {
            const updated = addArray(items);
            setItems(updated);
            onChangeMaitrises({ ...maitrises, [key]: updated });
          }}
        >
          + {label.slice(0, -1)}
        </button>
      </div>
    );
  }

  return (
    <section className="bg-gray-900 rounded-xl shadow p-3 w-full max-w-5xl">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">
        Maîtrises & armes
      </h2>
      <div className="flex flex-wrap gap-4">
        {renderList("Armures", tempArmures, setTempArmures, "armures")}
        {renderList("Armes", tempArmes, setTempArmes, "armes")}
        {renderList("Outils", tempOutils, setTempOutils, "outils")}
      </div>
    </section>
  );
}
