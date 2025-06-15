import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DAMAGE_PATH = path.join(process.cwd(), "data", "damage_types.json");

export async function GET() {
  try {
    const raw = await fs.readFile(DAMAGE_PATH, "utf-8");
    const types = JSON.parse(raw);
    return NextResponse.json({ types });
  } catch (e) {
    return NextResponse.json(
      { error: "Impossible de charger les types de dégâts." },
      { status: 500 }
    );
  }
}
