// /components/player/JetDeSauvegardeItem.tsx

import { JetDeSauvegarde } from "@/types/Player";

type Props = {
  jds: JetDeSauvegarde;
  onChange: (j: JetDeSauvegarde) => void;
};

export default function JetDeSauvegardeItem({ jds, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 py-1 border-b border-gray-700">
      <span className="min-w-[100px] font-medium">{jds.nom}</span>
      <input
        type="checkbox"
        checked={jds.maitrise}
        onChange={(e) => onChange({ ...jds, maitrise: e.target.checked })}
        className="mx-1"
        title="Maîtrise"
      />
      <span className="text-xs text-yellow-400">M</span>
      <select
        value={jds.mode}
        onChange={(e) =>
          onChange({ ...jds, mode: e.target.value as "auto" | "manuel" })
        }
        className="rounded px-1 py-0.5 text-xs"
      >
        <option value="auto">Auto</option>
        <option value="manuel">Manuel</option>
      </select>
      <input
        type="number"
        value={jds.valeur}
        disabled={jds.mode === "auto"}
        onChange={(e) => onChange({ ...jds, valeur: Number(e.target.value) })}
        className="w-14 text-center rounded border-gray-600 bg-gray-800"
      />
    </div>
  );
}
