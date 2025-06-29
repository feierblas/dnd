import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

const joueursDir = path.join(process.cwd(), "data", "joueurs");

// GET /api/joueurs/[id]
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  const filePath = path.join(joueursDir, `${id}.json`);
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
  const { id } = await context.params;
  const filePath = path.join(joueursDir, `${id}.json`);
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

// PATCH /api/joueurs/[id] (pour archiver/activer seulement)
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  const filePath = path.join(joueursDir, `${id}.json`);
  try {
    // Vérifie d'abord si le fichier existe
    let perso = {};
    try {
      const content = await fs.readFile(filePath, "utf8");
      perso = JSON.parse(content);
    } catch {
      // S'il n'existe pas, refuse le PATCH !
      return new Response(JSON.stringify({ error: "Perso inexistant." }), {
        status: 404,
      });
    }
    const body = await req.json();

    // On merge à plat (shallow)
    const updated = { ...perso, ...body };

    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf8");
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Erreur lors de l'update." }), {
      status: 500,
    });
  }
}

// DELETE /api/joueurs/[id]
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  const filePath = path.join(joueursDir, `${id}.json`);
  try {
    await fs.unlink(filePath);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Erreur suppression." }), {
      status: 500,
    });
  }
}
