// src/app/api/campagnes/[slug]/route.ts

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { checkMJApiAccess } from "@/lib/checkMJApiAccess";

const DATA_DIR = path.join(process.cwd(), "data", "campagnes");

// Simple générateur d’ID unique
function generateId() {
  return "xxxx-xxxx-4xxx-yxxx-xxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// GET : Récupérer le contenu de la campagne
export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  const deny = checkMJApiAccess(req);
  if (deny) return deny;
  const { params } = context;
  const { slug } = await params;
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: "Campagne introuvable." },
      { status: 404 }
    );
  }
}

// PATCH : Ajouter un combat (en préparation)
export async function PATCH(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  const deny = checkMJApiAccess(req);
  if (deny) return deny;
  const { params } = context;
  const { slug } = await params;
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw);
    const body = await req.json();

    if (body.action === "ajouterCombat") {
      if (
        !body.nomCombat ||
        typeof body.nomCombat !== "string" ||
        !body.nomCombat.trim()
      ) {
        return NextResponse.json(
          { error: "Le nom du combat est obligatoire." },
          { status: 400 }
        );
      }
      // Assure la bonne structure
      data.combats = data.combats || {
        enCours: [],
        preparation: [],
        archive: [],
      };
      const id = generateId();
      const nouveauCombat = {
        id,
        nom: body.nomCombat,
        enCours: false,
        creation: new Date().toISOString(),
        // Pour plus tard :
        // debut: null,
        // archive: null,
        creatures: [],
      };
      data.combats.preparation.push(nouveauCombat);
      data.historique = data.historique || [];
      data.historique.push({
        type: "creation_combat",
        date: nouveauCombat.creation,
        details: {
          nom: nouveauCombat.nom,
          id: id,
        },
      });
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      return NextResponse.json({ ok: true, data: nouveauCombat });
    }

    // Autres actions (démarrer, archiver) à faire plus tard...

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ ok: true, data });
  } catch (e) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour." },
      { status: 500 }
    );
  }
}
