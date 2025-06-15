import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { checkMJApiAccess } from "@/lib/checkMJApiAccess";

const DATA_DIR = path.join(process.cwd(), "data", "campagnes");

async function getCampagne(slug: string) {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  const raw = await fs.readFile(filePath, "utf-8");
  return { data: JSON.parse(raw), filePath };
}

export async function GET(
  req: NextRequest,
  context: { params: { slug: string; idCombat: string } }
) {
  const { slug, idCombat } = await context.params;
  try {
    const { data: campagne } = await getCampagne(slug);
    // Cherche le combat
    let combat = null;
    for (const type of ["enCours", "preparation", "archive"]) {
      combat = campagne.combats[type]?.find((c) => c.id === idCombat);
      if (combat) break;
    }
    if (!combat)
      return NextResponse.json(
        { error: "Combat introuvable." },
        { status: 404 }
      );
    // On ne retourne pas de données si privé
    if (!combat.public) {
      return NextResponse.json(
        { error: "Ce combat n'est pas en accès public." },
        { status: 403 }
      );
    }
    return NextResponse.json(combat);
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

function generateId() {
  return "xxxx-xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
function nowISO() {
  return new Date().toISOString();
}

function setTourByCreatureId(combat, creatureId) {
  combat.tourIndex = combat.creatures.findIndex((c) => c.id === creatureId);
  combat.creatures.forEach((c) => {
    c.tourActuel = c.id === creatureId;
  });
}

// Renvoie l'id du prochain combattant vivant (trié par initiative)
function getNextCreatureId(combat, currentId) {
  const creatures = [...combat.creatures].sort(
    (a, b) => b.initiative - a.initiative
  );
  if (creatures.length === 0) return null;
  let idx = creatures.findIndex((c) => c.id === currentId);
  for (let i = 1; i <= creatures.length; ++i) {
    let nextIdx = (idx + i) % creatures.length;
    const c = creatures[nextIdx];
    if (c.pv >= 0 && (!c.etat || c.etat.toLowerCase() !== "inconscient")) {
      return c.id;
    }
  }
  return null;
}

export async function PATCH(
  req: NextRequest,
  context: { params: { slug: string; idCombat: string } }
) {
  const deny = checkMJApiAccess(req);
  if (deny) return deny;
  const { slug, idCombat } = await context.params;
  try {
    const { data: campagne, filePath } = await getCampagne(slug);

    // Récupère le combat
    let combat = null;
    for (const type of ["enCours", "preparation", "archive"]) {
      combat = campagne.combats[type]?.find((c) => c.id === idCombat);
      if (combat) break;
    }
    if (!combat)
      return NextResponse.json(
        { error: "Combat introuvable." },
        { status: 404 }
      );
    combat.historique = combat.historique || [];

    const body = await req.json();
    const action = body.action;

    function pushActionHist(entry) {
      combat.historique.push({ ...entry, date: nowISO() });
    }

    // --- Ajout d'une créature ---
    if (action === "addCreature") {
      const newCreature = {
        id: generateId(),
        nom: body.nom,
        type: body.type,
        pv: Number(body.pv),
        ca: Number(body.ca),
        vitesse: Number(body.vitesse),
        ddSorts: Number(body.ddSorts),
        etat: body.etat || "",
        concentration: !!body.concentration,
        initiative: Number(body.initiative),
        commentaire: body.commentaire || "",
        vulnerabilite: [],
        resistance: [],
        tourActuel: false,
      };
      combat.creatures = combat.creatures || [];
      combat.creatures.push(newCreature);
      pushActionHist({
        type: "add",
        creature: { ...newCreature },
        details: `Ajout de ${newCreature.nom}`,
        after: { ...newCreature },
      });
      await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
      return NextResponse.json({ ok: true, newCreature });
    }

    // --- Edition d'un champ ---
    if (action === "updateChamp") {
      const { creatureId, field, value } = body;
      const idx = combat.creatures.findIndex((c) => c.id === creatureId);
      if (idx === -1)
        return NextResponse.json(
          { error: "Créature introuvable." },
          { status: 404 }
        );
      const before = { ...combat.creatures[idx] };
      combat.creatures[idx][field] = value;
      pushActionHist({
        type: "edit",
        creatureId,
        field,
        before: { [field]: before[field] },
        after: { [field]: value },
        details: `Modif ${field} ${before[field]}→${value} sur ${before.nom}`,
      });
      // Si PV ou état modifié, vérifier validité du tour (uniquement : si la créature active devient morte/inconsciente, passer au suivant)
      if (["pv", "etat"].includes(field)) {
        const curIdx = combat.tourIndex;
        const cur = combat.creatures[curIdx];
        if (
          cur &&
          (cur.pv < 0 || (cur.etat && cur.etat.toLowerCase() === "inconscient"))
        ) {
          const nextId = getNextCreatureId(combat, cur.id);
          if (nextId) setTourByCreatureId(combat, nextId);
          else setTourByCreatureId(combat, null);
        }
      }
      await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
      return NextResponse.json({ ok: true });
    }

    // --- Suppression de créature ---
    // --- Suppression de créature ---
    if (action === "deleteCreature") {
      const idx = combat.creatures.findIndex((c) => c.id === body.creatureId);
      if (idx === -1)
        return NextResponse.json(
          { error: "Créature introuvable." },
          { status: 404 }
        );
      const before = { ...combat.creatures[idx] };
      const wasTour = combat.creatures[idx].tourActuel;
      // Sauvegarde l'ID de la créature supprimée ET l'ordre du tri d'initiative
      const sorted = [...combat.creatures].sort(
        (a, b) => b.initiative - a.initiative
      );
      const orderIdx = sorted.findIndex((c) => c.id === body.creatureId);

      combat.creatures.splice(idx, 1);
      pushActionHist({
        type: "delete",
        creature: { ...before },
        details: `Suppression de ${before.nom}`,
        before,
      });

      if (wasTour && combat.creatures.length) {
        // On retrouve la prochaine créature d'après dans le tri d'initiative
        const newSorted = [...combat.creatures].sort(
          (a, b) => b.initiative - a.initiative
        );
        let nextIdx = orderIdx % newSorted.length; // Si supprimé le dernier, revient au premier
        const next = newSorted[nextIdx];
        setTourByCreatureId(combat, next.id);
      }
      await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
      return NextResponse.json({ ok: true });
    }

    // --- Heal rapide ---
    if (action === "heal") {
      const { creatureId, value } = body;
      const idx = combat.creatures.findIndex((c) => c.id === creatureId);
      if (idx === -1)
        return NextResponse.json(
          { error: "Créature introuvable." },
          { status: 404 }
        );
      const before = combat.creatures[idx].pv;
      combat.creatures[idx].pv += Number(value);
      pushActionHist({
        type: "heal",
        creatureId,
        before: { pv: before },
        after: { pv: combat.creatures[idx].pv },
        details: `Heal +${value} PV (${before}→${combat.creatures[idx].pv}) sur ${combat.creatures[idx].nom}`,
      });
      await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
      return NextResponse.json({ ok: true });
    }

    // --- Dégâts (types dynamiques) ---
    if (action === "damage") {
      const { creatureId, values } = body;
      const idx = combat.creatures.findIndex((c) => c.id === creatureId);
      if (idx === -1)
        return NextResponse.json(
          { error: "Créature introuvable." },
          { status: 404 }
        );
      let total = 0;
      for (const [type, val] of Object.entries(values || {})) {
        let mult = 1;
        if (combat.creatures[idx].vulnerabilite?.includes(type)) mult = 2;
        if (combat.creatures[idx].resistance?.includes(type)) mult = 0.5;
        total += val * mult;
      }
      const before = combat.creatures[idx].pv;
      combat.creatures[idx].pv -= Math.round(total);
      pushActionHist({
        type: "damage",
        creatureId,
        before: { pv: before },
        after: { pv: combat.creatures[idx].pv },
        values,
        total,
        details: `Dégâts -${Math.round(total)} PV sur ${
          combat.creatures[idx].nom
        }`,
      });
      // Si la créature du tour meurt/inconscient, passer au suivant
      const curIdx = combat.tourIndex;
      const cur = combat.creatures[curIdx];
      if (
        cur &&
        (cur.pv < 0 || (cur.etat && cur.etat.toLowerCase() === "inconscient"))
      ) {
        const nextId = getNextCreatureId(combat, cur.id);
        if (nextId) setTourByCreatureId(combat, nextId);
        else setTourByCreatureId(combat, null);
      }
      await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
      return NextResponse.json({ ok: true });
    }

    // --- Maj rés/vuln ---
    if (action === "updateResVuln") {
      const { creatureId, resistance, vulnerabilite } = body;
      const idx = combat.creatures.findIndex((c) => c.id === creatureId);
      if (idx === -1)
        return NextResponse.json(
          { error: "Créature introuvable." },
          { status: 404 }
        );
      const before = {
        resistance: [...(combat.creatures[idx].resistance || [])],
        vulnerabilite: [...(combat.creatures[idx].vulnerabilite || [])],
      };
      combat.creatures[idx].resistance = resistance;
      combat.creatures[idx].vulnerabilite = vulnerabilite;
      pushActionHist({
        type: "resvuln",
        creatureId,
        before,
        after: { resistance, vulnerabilite },
        details: `Maj rés/vuln sur ${combat.creatures[idx].nom}`,
      });
      await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
      return NextResponse.json({ ok: true });
    }

    // --- Tour suivant (next turn, manuel seulement) ---
    if (action === "nextTurn") {
      const currentId = combat.creatures[combat.tourIndex]?.id;
      const nextId = getNextCreatureId(combat, currentId);
      if (!nextId)
        return NextResponse.json(
          { error: "Aucune créature valide pour le tour." },
          { status: 400 }
        );
      setTourByCreatureId(combat, nextId);
      await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
      return NextResponse.json({ ok: true });
    }

    // --- Undo (jamais de gestion du tour ici !) ---
    if (action === "undo") {
      if (!combat.historique.length)
        return NextResponse.json(
          { error: "Aucune action à annuler." },
          { status: 400 }
        );
      const last = combat.historique.pop();

      if (last.type === "add") {
        combat.creatures = combat.creatures.filter(
          (c) => c.id !== last.creature.id
        );
      } else if (last.type === "delete") {
        // On restaure la créature, mais on FORÇE tourActuel à false (même si elle l’avait à l’origine)
        const creature = { ...last.creature, tourActuel: false };
        combat.creatures.push(creature);
        // Pas de gestion du tour ici
      } else if (last.type === "edit") {
        const idx = combat.creatures.findIndex((c) => c.id === last.creatureId);
        if (idx !== -1) {
          Object.assign(combat.creatures[idx], last.before);
        }
      } else if (last.type === "heal" || last.type === "damage") {
        const idx = combat.creatures.findIndex((c) => c.id === last.creatureId);
        if (idx !== -1) {
          combat.creatures[idx].pv = last.before.pv;
        }
      } else if (last.type === "resvuln") {
        const idx = combat.creatures.findIndex((c) => c.id === last.creatureId);
        if (idx !== -1) {
          combat.creatures[idx].resistance = last.before.resistance;
          combat.creatures[idx].vulnerabilite = last.before.vulnerabilite;
        }
      }
      await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
      return NextResponse.json({ ok: true });
    }
    if (body.action === "setPublic") {
      combat.public = !!body.value;
      await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
      return NextResponse.json({ ok: true });
    }
    // --- Débuter le combat (préparation → enCours) ---
    if (body.action === "startCombat") {
      const preps = campagne.combats.preparation || [];
      const idx = preps.findIndex((c) => c.id === idCombat);
      if (idx !== -1) {
        const combat = preps.splice(idx, 1)[0];
        combat.date_debut = new Date().toISOString();
        campagne.combats.enCours = campagne.combats.enCours || [];
        campagne.combats.enCours.push(combat);
        await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json(
        { error: "Combat non trouvé en préparation." },
        { status: 404 }
      );
    }

    // --- Archiver le combat (enCours → archive) ---
    if (body.action === "archiveCombat") {
      const cours = campagne.combats.enCours || [];
      const idx = cours.findIndex((c) => c.id === idCombat);
      if (idx !== -1) {
        const combat = cours.splice(idx, 1)[0];
        combat.date_archive = new Date().toISOString();
        campagne.combats.archive = campagne.combats.archive || [];
        campagne.combats.archive.push(combat);
        await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json(
        { error: "Combat non trouvé en cours." },
        { status: 404 }
      );
    }

    // --- Suppression de combat (dans tous les états) ---
    if (body.action === "deleteCombat") {
      let found = false;
      for (const etat of ["preparation", "enCours", "archive"]) {
        const arr = campagne.combats[etat];
        const idx = arr?.findIndex((c) => c.id === idCombat);
        if (idx !== undefined && idx >= 0) {
          arr.splice(idx, 1);
          found = true;
        }
      }
      if (found) {
        await fs.writeFile(filePath, JSON.stringify(campagne, null, 2));
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json(
        { error: "Combat introuvable à supprimer." },
        { status: 404 }
      );
    }

    return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
