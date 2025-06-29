import { useState, useEffect } from "react";
import { JetDeSauvegarde } from "@/types/Player";

type Props = {
  jds: JetDeSauvegarde;
  onChange: (j: JetDeSauvegarde) => void;
};

export default function JetDeSauvegardeItem({ jds, onChange }: Props) {
  // Local value for number input
  const [localVal, setLocalVal] = useState(jds.valeur);
  const [dirty, setDirty] = useState(false);

  // Sync local input if parent changes (unless user is typing)
  useEffect(() => {
    if (!dirty) setLocalVal(jds.valeur);
    // eslint-disable-next-line
  }, [jds.valeur]);

  // Handle blur (push value to parent)
  function handleBlur() {
    setDirty(false);
    if (localVal !== jds.valeur) {
      onChange({ ...jds, valeur: localVal });
    }
  }

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
        className="rounded px-1 py-0.5 text-xs bg-gray-700 text-white"
      >
        <option value="auto">Auto</option>
        <option value="manuel">Manuel</option>
      </select>
      <input
        type="number"
        value={jds.mode === "auto" ? jds.valeur : localVal}
        disabled={jds.mode === "auto"}
        onChange={(e) => {
          setLocalVal(Number(e.target.value));
          setDirty(true);
        }}
        onBlur={handleBlur}
        className="w-14 text-center rounded border-gray-600 bg-gray-800"
      />
    </div>
  );
}
