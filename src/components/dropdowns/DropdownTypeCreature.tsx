"use client";
import { useEffect, useState } from "react";

type TypeCreature = {
  type: string;
  description: string;
};

type Props = {
  valeur: string;
  onChange: (val: string) => void;
  disabled?: boolean;
};

export function DropdownTypeCreature({
  valeur,
  onChange,
  disabled = false,
}: Props) {
  const [types, setTypes] = useState<TypeCreature[]>([]);
  const [hover, setHover] = useState(false);
  const [desc, setDesc] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/types_creature")
      .then((r) => r.json())
      .then((data) => setTypes(data.types || []));
  }, []);

  const selected = types.find((t) => t.type === valeur);

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
        {types.map((type) => (
          <option key={type.type} value={type.type} title={type.description}>
            {type.type}
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
