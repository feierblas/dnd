import { Pieces } from "@/types/Player";

type Props = {
  pieces: Pieces;
  onChange: (pieces: Pieces) => void;
};

export default function PiecesSection({ pieces, onChange }: Props) {
  function updatePiece(type: keyof Pieces, value: number) {
    onChange({
      ...pieces,
      [type]: Math.max(0, value),
    });
  }

  return (
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">Pièces</h2>
      <div className="flex flex-wrap gap-6 items-center">
        {(
          [
            { key: "pp", label: "Platine" },
            { key: "po", label: "Or" },
            { key: "pa", label: "Argent" },
            { key: "pc", label: "Cuivre" },
          ] as const
        ).map(({ key, label }) => (
          <div key={key} className="flex flex-col items-center">
            <span className="font-bold text-orange-300">{label}</span>
            <div className="flex items-center gap-1 mt-1">
              <button
                className="px-2 py-0.5 rounded bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => updatePiece(key, (pieces[key] || 0) - 1)}
                disabled={pieces[key] <= 0}
                title={`-1 ${label}`}
              >
                -
              </button>
              <input
                type="number"
                value={pieces[key] || 0}
                onChange={(e) => updatePiece(key, Number(e.target.value))}
                className="w-16 text-center rounded bg-gray-800 border-gray-700"
                min={0}
              />
              <button
                className="px-2 py-0.5 rounded bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => updatePiece(key, (pieces[key] || 0) + 1)}
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
