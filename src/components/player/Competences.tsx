import { useEffect, useState } from "react";
import { Player, Competence } from "@/types/Player";
import CompetenceItem from "./CompetenceItem";
import { autoFillCompetences } from "@/hooks/useCompetences";

type Props = {
  player: Player;
  onChange: (competences: Competence[]) => void;
  onToggleToucheATout?: (value: boolean) => void;
};

export default function Competences({
  player,
  onChange,
  onToggleToucheATout,
}: Props) {
  const [competences, setCompetences] = useState<Competence[]>(() =>
    autoFillCompetences(player)
  );

  useEffect(() => {
    setCompetences(autoFillCompetences(player));
  }, [player]);

  function handleChange(index: number, comp: Competence) {
    const next = competences.map((c, i) => (i === index ? comp : c));
    setCompetences(next);
    onChange(next);
  }

  // Pour le header de bloc
  let lastStat = "";

  return (
    <section className="bg-gray-900 rounded-xl shadow p-3 w-full max-w-5xl">
      <div className="flex items-center mb-2 gap-4">
        <h2 className="text-xl font-semibold text-orange-400">Compétences</h2>
        <label className="flex items-center gap-2 text-xs ml-6">
          <input
            type="checkbox"
            checked={!!player.toucheATout}
            onChange={(e) => onToggleToucheATout?.(e.target.checked)}
          />
          Touche-à-tout
          <span className="text-gray-400 ml-2">
            (moitié bonus maîtrise sur non maîtrisées)
          </span>
        </label>
      </div>
      <div>
        {competences.map((c, i) => {
          const showHeader = c.stat !== lastStat;
          lastStat = c.stat;
          return (
            <div key={c.nom}>
              {showHeader && (
                <div className="mt-2 mb-1 text-xs font-bold text-blue-300 uppercase tracking-wider">
                  {c.stat}
                </div>
              )}
              <CompetenceItem
                competence={c}
                onChange={(comp) => handleChange(i, comp)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
