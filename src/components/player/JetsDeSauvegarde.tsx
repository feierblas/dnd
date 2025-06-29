import { useEffect, useState } from "react";
import { Player, JetDeSauvegarde } from "@/types/Player";
import JetDeSauvegardeItem from "./JetDeSauvegardeItem";
import { autoFillJdS } from "@/hooks/useJdS";

type Props = {
  player: Player;
  onChange: (jdss: JetDeSauvegarde[]) => void;
};

export default function JetsDeSauvegarde({ player, onChange }: Props) {
  // 1. INIT à la création (et si player change)
  const [jdss, setJdss] = useState<JetDeSauvegarde[]>(() =>
    autoFillJdS(player)
  );

  useEffect(() => {
    setJdss(autoFillJdS(player));
  }, [player]); // jamais de [jdss] ni [onChange] ici !

  // 2. Edition locale
  function handleChange(index: number, jds: JetDeSauvegarde) {
    const next = jdss.map((item, i) => (i === index ? jds : item));
    setJdss(next);
    onChange(next); // On push au parent, mais on garde notre état local
  }

  return (
    <section className="bg-gray-900 rounded-xl shadow p-3 w-full max-w-5xl">
      <h2 className="text-xl font-semibold mb-2 text-orange-400">
        Jets de sauvegarde
      </h2>
      <div>
        {jdss.map((j, i) => (
          <JetDeSauvegardeItem
            key={j.nom}
            jds={j}
            onChange={(jds) => handleChange(i, jds)}
          />
        ))}
      </div>
    </section>
  );
}
