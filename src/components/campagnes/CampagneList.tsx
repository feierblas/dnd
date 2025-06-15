"use client";
import Link from "next/link";
import { Campagne } from "@/types/campagne";

type Props = {
  campagnes: Campagne[];
};

export function CampagneList({ campagnes }: Readonly<Props>) {
  if (!campagnes.length) {
    return <div className="text-lg">Aucune campagne trouvée.</div>;
  }

  return (
    <ul className="space-y-4">
      {campagnes.map((c) => (
        <li key={c.slug}>
          <Link
            href={`/maitre/${c.slug}`}
            className="block px-5 py-4 bg-gray-800 rounded-xl shadow hover:scale-105 transition border border-gray-700"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold">{c.nom}</span>
              <span className="text-xs text-gray-400">
                Créée le {c.date_creation}
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
