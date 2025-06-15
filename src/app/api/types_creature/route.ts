import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const TYPES_PATH = path.join(process.cwd(), "data", "types_creature.json");

export async function GET() {
  try {
    const raw = await fs.readFile(TYPES_PATH, "utf-8");
    const types = JSON.parse(raw);
    return NextResponse.json({ types });
  } catch (e) {
    return NextResponse.json(
      { error: "Impossible de charger les types de créature." },
      { status: 500 }
    );
  }
}
