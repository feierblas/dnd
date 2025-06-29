import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const joueursDir = path.join(process.cwd(), "data", "joueurs");

// Fonction valeurs par défaut pour un nouveau perso
function getDefaultPerso(id: string, name: string) {
  return {
    id,
    name,
    race: {
      nom: "",
      traits: [],
    },
    classes: [],
    historique: "",
    alignement: "",
    xp: 0,
    stats: {
      force: { score: 10, mod: 0 },
      dexterite: { score: 10, mod: 0 },
      constitution: { score: 10, mod: 0 },
      intelligence: { score: 10, mod: 0 },
      sagesse: { score: 10, mod: 0 },
      charisme: { score: 10, mod: 0 },
    },
    bonusMaitrise: 2,
    perceptionPassive: {
      mode: "auto",
      valeur: 10,
    },
    ca: 10,
    initiative: {
      mode: "auto",
      valeur: 0,
    },
    vitesse: 9,
    pv: 10,
    pvMax: 10,
    pvTemp: 0,
    desDeVie: {
      type: "d6",
      total: 1,
      restants: 1,
    },
    jdsMort: {
      reussites: 0,
      echecs: 0,
    },
    jetsDeSauvegarde: [
      {
        nom: "FOR",
        maitrise: false,
        valeur: 0,
        sourceStat: "force",
        mode: "auto",
      },
      {
        nom: "DEX",
        maitrise: false,
        valeur: 0,
        sourceStat: "dexterite",
        mode: "auto",
      },
      {
        nom: "CON",
        maitrise: false,
        valeur: 0,
        sourceStat: "constitution",
        mode: "auto",
      },
      {
        nom: "INT",
        maitrise: false,
        valeur: 0,
        sourceStat: "intelligence",
        mode: "auto",
      },
      {
        nom: "SAG",
        maitrise: false,
        valeur: 0,
        sourceStat: "sagesse",
        mode: "auto",
      },
      {
        nom: "CHA",
        maitrise: false,
        valeur: 0,
        sourceStat: "charisme",
        mode: "auto",
      },
    ],
    competences: [
      {
        nom: "Athlétisme",
        stat: "force",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Acrobaties",
        stat: "dexterite",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Discrétion",
        stat: "dexterite",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Escamotage",
        stat: "dexterite",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Arcanes",
        stat: "intelligence",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Histoire",
        stat: "intelligence",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Investigation",
        stat: "intelligence",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Nature",
        stat: "intelligence",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Religion",
        stat: "intelligence",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Dressage",
        stat: "sagesse",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Intuition",
        stat: "sagesse",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Médecine",
        stat: "sagesse",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Perception",
        stat: "sagesse",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Survie",
        stat: "sagesse",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Tromperie",
        stat: "charisme",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Intimidation",
        stat: "charisme",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Persuasion",
        stat: "charisme",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
      {
        nom: "Représentation",
        stat: "charisme",
        maitrise: false,
        expertise: false,
        valeur: 0,
        mode: "auto",
      },
    ],
    maitrises: {
      armures: [],
      armes: [],
      outils: [],
    },
    armes: [],
    sorts: {
      caracteristiqueIncantation: "",
      modificateurIncantation: 0,
      ddSort: 0,
      bonusAttaqueSort: 0,
      emplacements: [],
      connus: [],
    },
    capacitesRaciales: [],
    dons: [],
    apparence: {
      age: "",
      taille: "",
      poids: "",
      couleurYeux: "",
      description: "",
    },
    histoire: "",
    personnalite: "",
    langues: [],
    equipement: [],
    pieces: {
      po: 0,
      pa: 0,
      pc: 0,
      pp: 0,
    },
    toucheATout: false,
    capaciteHistorique: [],
    archived: false,
  };
}

// GET et POST
export async function GET() {
  try {
    const files = await fs.readdir(joueursDir);
    const persos = [];
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      const id = file.replace(/\.json$/, "");
      const content = await fs.readFile(path.join(joueursDir, file), "utf8");
      const data = JSON.parse(content);
      persos.push({
        id,
        name: data.name || "Inconnu",
        archived: !!data.archived,
      });
    }
    return Response.json(persos);
  } catch (e) {
    return new Response("Erreur lecture joueurs", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = body.name?.trim() || "Sans nom";
    const id = randomUUID();

    const defaultPerso = getDefaultPerso(id, name);

    const filePath = path.join(joueursDir, `${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(defaultPerso, null, 2), "utf8");
    return Response.json({ success: true, id });
  } catch (e) {
    return new Response("Erreur création joueur", { status: 500 });
  }
}
