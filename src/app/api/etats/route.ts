// src/app/api/etats/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ETATS_PATH = path.join(process.cwd(), "data", "etats.json");

export async function GET() {
  try {
    const raw = await fs.readFile(ETATS_PATH, "utf-8");
    const etats = JSON.parse(raw);
    return NextResponse.json({ etats });
  } catch (e) {
    return NextResponse.json(
      { error: "Impossible de charger les états." },
      { status: 500 }
    );
  }
}
