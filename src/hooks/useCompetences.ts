// /hooks/useCompetences.ts

import { Competence, Player } from "@/types/Player";

const COMPETENCES: {
  nom: Competence["nom"];
  stat: Competence["stat"];
}[] = [
  { nom: "Athlétisme", stat: "force" },
  { nom: "Acrobaties", stat: "dexterite" },
  { nom: "Discrétion", stat: "dexterite" },
  { nom: "Escamotage", stat: "dexterite" },
  { nom: "Arcanes", stat: "intelligence" },
  { nom: "Histoire", stat: "intelligence" },
  { nom: "Investigation", stat: "intelligence" },
  { nom: "Nature", stat: "intelligence" },
  { nom: "Religion", stat: "intelligence" },
  { nom: "Dressage", stat: "sagesse" },
  { nom: "Intuition", stat: "sagesse" },
  { nom: "Médecine", stat: "sagesse" },
  { nom: "Perception", stat: "sagesse" },
  { nom: "Survie", stat: "sagesse" },
  { nom: "Tromperie", stat: "charisme" },
  { nom: "Intimidation", stat: "charisme" },
  { nom: "Persuasion", stat: "charisme" },
  { nom: "Représentation", stat: "charisme" },
];

export function computeCompetenceValue(
  player: Player,
  comp: Competence
): number {
  // base = mod stat
  const mod = player.stats[comp.stat].mod;
  // bonus maîtrise
  const bonus = comp.maitrise
    ? (comp.expertise ? 2 : 1) * player.bonusMaitrise
    : 0;

  const toucheATout =
    player.toucheATout && !comp.maitrise && !comp.expertise
      ? Math.floor(player.bonusMaitrise / 2)
      : 0;

  return mod + bonus + toucheATout;
}

// Pour reset toutes les compétences en auto
export function autoFillCompetences(player: Player): Competence[] {
  return COMPETENCES.map(({ nom, stat }) => {
    const exist = player.competences.find((c) => c.nom === nom);
    const maitrise = exist?.maitrise ?? false;
    const expertise = exist?.expertise ?? false;
    const valeur =
      exist?.mode === "manuel"
        ? exist.valeur
        : computeCompetenceValue(player, {
            nom,
            stat,
            maitrise,
            expertise,
            valeur: 0,
            mode: "auto",
          });
    const mode = exist?.mode ?? "auto";
    return { nom, stat, maitrise, expertise, valeur, mode };
  });
}
