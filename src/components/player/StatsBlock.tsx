// /components/player/StatsBlock.tsx

import { StatsBlock, Stat } from "@/types/Player";
import StatItem from "./StatItem";

type Props = {
  stats: StatsBlock;
  onChange: (stats: StatsBlock) => void;
};

const labels: { key: keyof StatsBlock; label: string }[] = [
  { key: "force", label: "FOR" },
  { key: "dexterite", label: "DEX" },
  { key: "constitution", label: "CON" },
  { key: "intelligence", label: "INT" },
  { key: "sagesse", label: "SAG" },
  { key: "charisme", label: "CHA" },
];

export default function StatsBlockSection({ stats, onChange }: Props) {
  function handleStatChange(key: keyof StatsBlock, value: Stat) {
    onChange({ ...stats, [key]: value });
  }

  return (
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">
        Caractéristiques
      </h2>
      <div className="flex flex-wrap gap-4 justify-between">
        {labels.map(({ key, label }) => (
          <StatItem
            key={key}
            label={label}
            value={stats[key]}
            onChange={(value) => handleStatChange(key, value)}
          />
        ))}
      </div>
    </section>
  );
}
