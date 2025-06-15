"use client";
import React from "react";
import { Combat } from "@/types/combat";

type SectionCombatListProps = {
  title?: string;
  combats: Combat[];
  color: "blue" | "yellow" | "gray";
  btnLabel: string;
  onClickCombat: (id: string) => void;
};

export default function SectionCombatList({
  title,
  combats,
  color,
  btnLabel,
  onClickCombat,
}: Readonly<SectionCombatListProps>) {
  if (!combats.length) return null;
  const btnColor =
    color === "blue"
      ? "bg-blue-700 hover:bg-blue-800"
      : color === "yellow"
      ? "bg-yellow-700 hover:bg-yellow-800"
      : "bg-gray-700 hover:bg-gray-800";
  return (
    <section className="w-full max-w-3xl mx-auto mb-10">
      {title && (
        <h2 className="text-2xl font-semibold mb-4 text-left">{title}</h2>
      )}
      <ul className="w-full max-w-3xl mx-auto space-y-6">
        {combats.map((combat) => (
          <li
            key={combat.id}
            className="bg-gray-800 rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow"
          >
            <div>
              <div className="text-xl font-semibold mb-1">{combat.nom}</div>
              <div className="text-xs text-gray-400">
                Créé le {new Date(combat.creation).toLocaleString("fr-FR")}
              </div>
            </div>
            <button
              className={`mt-3 sm:mt-0 px-6 py-3 text-base font-bold rounded-xl text-white ${btnColor}`}
              onClick={() => onClickCombat(combat.id)}
            >
              {btnLabel}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
