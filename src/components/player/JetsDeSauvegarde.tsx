import { useEffect, useState } from "react";
import { Player, JetDeSauvegarde } from "@/types/Player";
import JetDeSauvegardeItem from "./JetDeSauvegardeItem";
import { autoFillJdS } from "@/hooks/useJdS";

type Props = {
  player: Player;
  onChange: (jdss: JetDeSauvegarde[]) => void;
};

export default function JetsDeSauvegarde({ player, onChange }: Props) {
  const [jdss, setJdss] = useState<JetDeSauvegarde[]>([]);

  // Initialisation seulement quand player change (externe)
  useEffect(() => {
    setJdss(autoFillJdS(player));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player]); // <-- Important : pas [jdss] ni [onChange]

  function handleChange(index: number, jds: JetDeSauvegarde) {
    const next = jdss.map((item, i) => (i === index ? jds : item));
    setJdss(next);
    onChange(next); // Ici uniquement
  }

  return (
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
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
