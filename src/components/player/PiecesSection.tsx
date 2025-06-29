import { useState, useEffect } from "react";
import { Pieces } from "@/types/Player";

type Props = {
  pieces: Pieces;
  onChange: (pieces: Pieces) => void;
};

const PIECE_TYPES = [
  { key: "pp", label: "Platine" },
  { key: "po", label: "Or" },
  { key: "pa", label: "Argent" },
  { key: "pc", label: "Cuivre" },
] as const;

export default function PiecesSection({ pieces, onChange }: Props) {
  // State local pour édition fluide des valeurs (un state par pièce)
  const [local, setLocal] = useState<Record<string, number>>(() =>
    Object.fromEntries(PIECE_TYPES.map(({ key }) => [key, pieces[key] || 0]))
  );
  const [dirty, setDirty] = useState<Record<string, boolean>>({});

  // Sync local <-> prop si le parent change (sauf si champ en édition)
  useEffect(() => {
    setLocal((old) => {
      const next = { ...old };
      for (const { key } of PIECE_TYPES) {
        if (!dirty[key]) next[key] = pieces[key] || 0;
      }
      return next;
    });
    // eslint-disable-next-line
  }, [pieces]);

  function handleChange(key: string, val: number) {
    setLocal((prev) => ({ ...prev, [key]: val }));
    setDirty((prev) => ({ ...prev, [key]: true }));
  }

  function handleBlur(key: string) {
    setDirty((prev) => ({ ...prev, [key]: false }));
    if (local[key] !== (pieces[key] || 0)) {
      onChange({ ...pieces, [key]: Math.max(0, local[key]) });
    }
  }

  function handleDelta(key: string, delta: number) {
    const next = Math.max(0, (pieces[key] || 0) + delta);
    setLocal((prev) => ({ ...prev, [key]: next }));
    setDirty((prev) => ({ ...prev, [key]: false }));
    onChange({ ...pieces, [key]: next });
  }

  return (
    <section className="bg-gray-900 rounded-xl shadow p-3 w-full max-w-5xl">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">Pièces</h2>
      <div className="flex flex-wrap gap-6 items-center">
        {PIECE_TYPES.map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center">
            <span className="font-bold text-orange-300">{label}</span>
            <div className="flex items-center gap-1 mt-1">
              <button
                className="px-2 py-0.5 rounded bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => handleDelta(key, -1)}
                disabled={pieces[key] <= 0}
                title={`-1 ${label}`}
              >
                -
              </button>
              <input
                type="number"
                value={local[key] ?? 0}
                min={0}
                onChange={(e) => handleChange(key, Number(e.target.value))}
                onBlur={() => handleBlur(key)}
                className="w-16 text-center rounded bg-gray-800 border-gray-700"
              />
              <button
                className="px-2 py-0.5 rounded bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => handleDelta(key, 1)}
                title={`+1 ${label}`}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
