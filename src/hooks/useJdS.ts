// /hooks/useJdS.ts

import { JetDeSauvegarde, Player } from "@/types/Player";

const JDS: {
  nom: JetDeSauvegarde["nom"];
  stat: JetDeSauvegarde["sourceStat"];
}[] = [
  { nom: "FOR", stat: "force" },
  { nom: "DEX", stat: "dexterite" },
  { nom: "CON", stat: "constitution" },
  { nom: "INT", stat: "intelligence" },
  { nom: "SAG", stat: "sagesse" },
  { nom: "CHA", stat: "charisme" },
];

export function computeJdSValue(player: Player, jds: JetDeSauvegarde): number {
  const mod = player.stats[jds.sourceStat].mod;
  const bonus = jds.maitrise ? player.bonusMaitrise : 0;
  return mod + bonus;
}

export function autoFillJdS(player: Player): JetDeSauvegarde[] {
  return JDS.map(({ nom, stat }) => {
    const exist = player.jetsDeSauvegarde.find((j) => j.nom === nom);
    const maitrise = exist?.maitrise ?? false;
    const valeur =
      exist?.mode === "manuel"
        ? exist.valeur
        : computeJdSValue(player, {
            nom,
            maitrise,
            valeur: 0,
            sourceStat: stat,
            mode: "auto",
          });
    const mode = exist?.mode ?? "auto";
    return { nom, maitrise, valeur, sourceStat: stat, mode };
  });
}
