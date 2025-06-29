import { useState, useEffect } from "react";
import { Competence } from "@/types/Player";

type Props = {
  competence: Competence;
  onChange: (c: Competence) => void;
};

export default function CompetenceItem({ competence, onChange }: Props) {
  // État local pour la valeur (manuel seulement)
  const [valeur, setValeur] = useState(competence.valeur);

  // Synchronisation du local <-> props
  useEffect(() => {
    setValeur(competence.valeur);
  }, [competence.valeur]);

  // Commit la valeur seulement au blur
  function handleValeurBlur() {
    if (competence.mode === "manuel") {
      onChange({ ...competence, valeur });
    }
  }

  return (
    <div className="flex items-center gap-2 py-1 border-b border-gray-700">
      <span className="min-w-[140px] font-medium">{competence.nom}</span>
      <span className="text-xs text-gray-400 italic w-20">
        ({competence.stat})
      </span>
      <input
        type="checkbox"
        checked={competence.maitrise}
        onChange={(e) =>
          onChange({ ...competence, maitrise: e.target.checked })
        }
        className="mx-1"
        title="Maîtrise"
      />
      <span className="text-xs text-yellow-400">M</span>
      <input
        type="checkbox"
        checked={competence.expertise}
        onChange={(e) =>
          onChange({ ...competence, expertise: e.target.checked })
        }
        className="mx-1"
        title="Expertise"
      />
      <span className="text-xs text-blue-400">E</span>
      <select
        value={competence.mode}
        onChange={(e) =>
          onChange({ ...competence, mode: e.target.value as "auto" | "manuel" })
        }
        className="rounded px-1 py-0.5 text-xs bg-gray-700 text-white"
      >
        <option value="auto">Auto</option>
        <option value="manuel">Manuel</option>
      </select>
      <input
        type="number"
        value={competence.mode === "auto" ? competence.valeur : valeur}
        disabled={competence.mode === "auto"}
        onChange={(e) => setValeur(Number(e.target.value))}
        onBlur={handleValeurBlur}
        className="w-14 text-center rounded border-gray-600 bg-gray-800"
      />
    </div>
  );
}
