// /components/player/StatItem.tsx

import { Stat, StatsBlock } from "@/types/Player";
import { useEffect, useState } from "react";

type Props = {
  label: string; // ex "FOR"
  value: Stat;
  onChange: (v: Stat) => void;
};

export default function StatItem({ label, value, onChange }: Props) {
  // Mise à jour automatique du modificateur quand le score change (DnD 5e)
  const [score, setScore] = useState<number>(value.score);
  const [mod, setMod] = useState<number>(value.mod);

  useEffect(() => {
    setScore(value.score);
    setMod(value.mod);
  }, [value.score, value.mod]);

  // Met à jour le modificateur si l'utilisateur change le score
  function handleScoreChange(newScore: number) {
    setScore(newScore);
    const autoMod = Math.floor((newScore - 10) / 2);
    setMod(autoMod);
    onChange({ score: newScore, mod: autoMod });
  }

  // Permet à l'utilisateur de forcer le mod (mode manuel)
  function handleModChange(newMod: number) {
    setMod(newMod);
    onChange({ score, mod: newMod });
  }

  return (
    <div className="flex flex-col items-center gap-1 bg-gray-800 rounded-xl p-2 min-w-[80px] shadow">
      <span className="font-bold text-orange-400">{label}</span>
      <input
        type="number"
        value={score}
        min={1}
        max={30}
        onChange={(e) => handleScoreChange(Number(e.target.value))}
        className="w-14 text-center rounded bg-gray-900 border-gray-700"
        title="Score"
      />
      <input
        type="number"
        value={mod}
        onChange={(e) => handleModChange(Number(e.target.value))}
        className="w-14 text-center rounded bg-gray-900 border-gray-700"
        title="Modificateur"
      />
      <span className="text-xs text-gray-400">Mod</span>
    </div>
  );
}
