import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

// GET /api/joueurs/[id]
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  const filePath = path.join(process.cwd(), "data", "joueurs", `${id}.json`);
  try {
    const content = await fs.readFile(filePath, "utf8");
    return new Response(content, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Joueur non trouvé." }), {
      status: 404,
    });
  }
}

// PUT /api/joueurs/[id]
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params; // <-- Ajout du await ici !
  const filePath = path.join(process.cwd(), "data", "joueurs", `${id}.json`);
  try {
    const body = await req.json();
    await fs.writeFile(filePath, JSON.stringify(body, null, 2), "utf8");
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Erreur lors de l'écriture." }),
      { status: 500 }
    );
  }
}
