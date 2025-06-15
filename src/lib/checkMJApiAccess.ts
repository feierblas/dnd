import { NextResponse } from "next/server";

export function checkMJApiAccess(req: Request) {
  // Vérifie l'accès via l'host (localhost)
  const host = req.headers.get("host");
  if (host !== "localhost:3000" && host !== "127.0.0.1:3000") {
    return NextResponse.json(
      { error: "Accès refusé : réservé au MJ local" },
      { status: 403 }
    );
  }
  // Sinon, accès OK
  return null;
}
