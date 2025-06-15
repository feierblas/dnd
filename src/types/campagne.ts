import { CombatsByType } from "./combat";

export type Campagne = {
  nom: string;
  slug: string;
  date_creation: string;
  dernier_acces: string;
  combats: CombatsByType;
  historique?: any[];
};
