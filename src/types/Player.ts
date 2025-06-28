// /types/Player.ts

export interface Player {
  id: string;
  name: string;
  race: Race;
  classes: Classe[];
  historique: string;
  alignement: string;
  xp: number;
  stats: StatsBlock;
  bonusMaitrise: number;
  perceptionPassive: ModeValue;
  ca: number;
  initiative: ModeValue;
  vitesse: number;
  pv: number;
  pvMax: number;
  pvTemp: number;
  desDeVie: DesDeVie;
  jdsMort: JdsMort;
  jetsDeSauvegarde: JetDeSauvegarde[];
  competences: Competence[];
  maitrises: Maitrises;
  armes: Arme[];
  sorts: Sorts;
  capacitesRaciales: Capacite[];
  dons: Capacite[];
  apparence: Apparence;
  histoire: string;
  capaciteHistorique: Capacite[];
  personnalite: string;
  langues: string[];
  equipement: EquipementItem[];
  pieces: Pieces;
  toucheATout?: boolean;
}

export interface Race {
  nom: string;
  traits: Capacite[];
}

export interface Classe {
  nom: string;
  niveau: number;
  sousClasse?: string;
  capacites?: Capacite[];
}

export interface Capacite {
  nom: string;
  description: string;
  utilisationsMax?: number;
  utilisationsRestantes?: number;
}

export interface StatsBlock {
  force: Stat;
  dexterite: Stat;
  constitution: Stat;
  intelligence: Stat;
  sagesse: Stat;
  charisme: Stat;
}

export interface Stat {
  score: number;
  mod: number;
}

export interface ModeValue {
  mode: "auto" | "manuel";
  valeur: number;
}

export interface DesDeVie {
  type: string; // "d8", "d10", etc. ou "d6/d8" pour multiclassé
  total: number;
  restants: number;
}

export interface JdsMort {
  reussites: number;
  echecs: number;
}

export interface JetDeSauvegarde {
  nom: string; // "FOR", "DEX", etc.
  maitrise: boolean;
  valeur: number;
  sourceStat: keyof StatsBlock;
  mode: "auto" | "manuel";
}

export interface Competence {
  nom: string;
  stat: keyof StatsBlock;
  maitrise: boolean;
  expertise: boolean;
  valeur: number;
  mode: "auto" | "manuel";
}

export interface Maitrises {
  armures: string[];
  armes: string[];
  outils: string[];
}

export interface Arme {
  nom: string;
  attaque: string;
  degats: string;
  proprietes?: string[];
}

export interface Sorts {
  caracteristiqueIncantation: keyof StatsBlock;
  modificateurIncantation: number;
  ddSort: number;
  bonusAttaqueSort: number;
  emplacements: EmplacementSort[];
  connus: SortComplet[];
}

export interface EmplacementSort {
  niveau: number;
  total: number;
  restants: number;
}

export interface SortComplet {
  nom: string;
  niveau: number;
  ecole: string;
  description: string;
  concentration: boolean;
  rituel: boolean;
  prepare: boolean;
  portee: string;
  duree: string;
  tempsIncantation: string;
  composantes: string[];
  source?: string;
}

export interface Apparence {
  age?: number;
  taille?: string;
  poids?: string;
  couleurYeux?: string;
  description?: string;
}

export interface EquipementItem {
  nom: string;
  description?: string;
  quantite?: number;
  magique?: boolean;
  lien?: boolean;
  rarete?: string;
}

export interface Pieces {
  po: number;
  pa: number;
  pc: number;
  pp: number;
}
