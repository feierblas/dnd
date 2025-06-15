export type Creature = {
  id: string;
  nom: string;
  type: string;
  pv: number;
  ca: number;
  vitesse: number;
  ddSorts: number;
  etat: string;
  concentration: boolean;
  initiative: number;
  commentaire: string;
  vulnerabilite: string[];
  resistance: string[];
  tourActuel?: boolean;
};
