import { Creature } from "./creature";

export type EditableField =
  | "nom"
  | "type"
  | "pv"
  | "ca"
  | "vitesse"
  | "ddSorts"
  | "initiative"
  | "commentaire"
  | "concentration"
  | "etat";

export type ActionCombat = {
  type: string;
  date: string;
  details?: string;
  [key: string]: any;
};

export type Combat = {
  id: string;
  nom: string;
  creation: string;
  public?: boolean;
  creatures: Creature[];
  historique: ActionCombat[];
  date_debut?: string;
  date_archive?: string;
  tourIndex?: number;
  etat?: "enCours" | "preparation" | "archive";
};

export type CombatsByType = {
  enCours: Combat[];
  preparation: Combat[];
  archive: Combat[];
};
