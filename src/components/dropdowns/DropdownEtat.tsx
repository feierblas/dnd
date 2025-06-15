"use client";
import { useEffect, useState } from "react";

type Etat = {
  nom: string;
  description: string;
};

type Props = {
  valeur: string;
  onChange: (etat: string) => void;
  disabled?: boolean;
};

export function DropdownEtat({ valeur, onChange, disabled = false }: Props) {
  const [etats, setEtats] = useState<Etat[]>([]);
  const [hover, setHover] = useState(false);
  const [desc, setDesc] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/etats")
      .then((r) => r.json())
      .then((data) => setEtats(data.etats || []));
  }, []);

  const selected = etats.find((e) => e.nom === valeur);

  return (
    <div className="relative inline-block">
      <select
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-gray-600 rounded px-2 py-1 text-xs ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
        disabled={disabled}
        onMouseOver={() => {
          setHover(true);
          setDesc(selected?.description ?? null);
        }}
        onMouseOut={() => setHover(false)}
      >
        <option value="">- Aucun -</option>
        {etats.map((etat) => (
          <option key={etat.nom} value={etat.nom} title={etat.description}>
            {etat.nom}
          </option>
        ))}
      </select>
      {hover && desc && !disabled && (
        <div className="absolute z-10 bg-gray-700 text-xs p-2 rounded text-white shadow-lg left-0 top-7 max-w-xs">
          {desc}
        </div>
      )}
    </div>
  );
}
