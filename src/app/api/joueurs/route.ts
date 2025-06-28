// src/app/api/players/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const playersDir = path.join(process.cwd(), "data/players");
  let players = [];

  // Si le dossier n'existe pas encore
  if (!fs.existsSync(playersDir)) {
    return NextResponse.json([]); // => retourne tableau vide
  }

  const files = fs.readdirSync(playersDir);
  for (const file of files) {
    if (file.endsWith(".json")) {
      const data = JSON.parse(
        fs.readFileSync(path.join(playersDir, file), "utf8")
      );
      players.push({
        id: path.basename(file, ".json"),
        name: data.name,
        classe: data.classe,
        niveau: data.niveau,
      });
    }
  }
  return NextResponse.json(players);
}
