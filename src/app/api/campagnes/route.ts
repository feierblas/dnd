// src/app/api/campagnes/route.ts

import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { checkMJApiAccess } from "@/lib/checkMJApiAccess";

const DATA_DIR = path.join(process.cwd(), "data", "campagnes");

export async function GET(req: NextRequest) {
  try {
    const deny = checkMJApiAccess(req);
    if (deny) return deny;
    const files = await fs.readdir(DATA_DIR);
    const campagnes = [];

    for (const file of files) {
      if (file.endsWith(".json")) {
        const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
        const data = JSON.parse(raw);
        campagnes.push({
          nom: data.nom,
          slug: file.replace(".json", ""),
          date_creation: data.date_creation,
          dernier_acces: data.dernier_acces,
        });
      }
    }

    return NextResponse.json({ campagnes });
  } catch (e) {
    // Si le dossier n’existe pas encore, on le crée
    if ((e as any).code === "ENOENT") {
      await fs.mkdir(DATA_DIR, { recursive: true });
      return NextResponse.json({ campagnes: [] });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const deny = checkMJApiAccess(req);
  if (deny) return deny;
  try {
    const { nom } = await req.json();
    if (!nom || typeof nom !== "string") {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }
    const slug = nom
      .toLowerCase()
      .replace(/[^\w\d]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const filePath = path.join(DATA_DIR, `${slug}.json`);
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { error: "Une campagne avec ce nom existe déjà." },
        { status: 409 }
      );
    } catch {
      // OK
    }

    const now = new Date().toISOString().split("T")[0];
    const data = {
      nom,
      date_creation: now,
      dernier_acces: now,
      combats: {
        enCours: [],
        preparation: [],
        archive: [],
      },
      historique: [],
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ ok: true, slug });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
