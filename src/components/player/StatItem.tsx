import { Stat } from "@/types/Player";
import { useEffect, useState } from "react";

type Props = {
  label: string; // ex "FOR"
  value: Stat;
  onChange: (v: Stat) => void;
};

export default function StatItem({ label, value, onChange }: Props) {
  const [score, setScore] = useState<number>(value.score);
  const [mod, setMod] = useState<number>(value.mod);

  // Synchronise avec la prop externe si jamais ça bouge
  useEffect(() => {
    setScore(value.score);
    setMod(value.mod);
  }, [value.score, value.mod]);

  // Gestion au blur seulement !
  function handleScoreBlur() {
    const autoMod = Math.floor((score - 10) / 2);
    setMod(autoMod); // Visuellement
    onChange({ score, mod: autoMod });
  }

  function handleModBlur() {
    onChange({ score, mod });
  }

  return (
    <div className="flex flex-col items-center gap-1 bg-gray-800 rounded-xl p-2 min-w-[80px] shadow">
      <span className="font-bold text-orange-400">{label}</span>
      <input
        type="number"
        value={score}
        min={1}
        max={30}
        onChange={(e) => setScore(Number(e.target.value))}
        onBlur={handleScoreBlur}
        className="w-14 text-center rounded bg-gray-900 border-gray-700"
        title="Score"
      />
      <input
        type="number"
        value={mod}
        onChange={(e) => setMod(Number(e.target.value))}
        onBlur={handleModBlur}
        className="w-14 text-center rounded bg-gray-900 border-gray-700"
        title="Modificateur"
      />
      <span className="text-xs text-gray-400">Mod</span>
    </div>
  );
}
