// components/combat/HealModal.tsx
import { useEffect, useState } from "react";

export function HealModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (val: number) => void;
}) {
  const [value, setValue] = useState(1);
  useEffect(() => {
    if (open) setValue(1);
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg flex flex-col gap-4 min-w-[200px]">
        <h2 className="text-xl font-bold mb-2">Soigner des PV</h2>
        <label className="flex flex-col gap-1 mb-2">
          <span className="text-sm font-semibold">Valeur de soin</span>
          <input
            className="p-2 rounded bg-gray-800 text-white w-24"
            type="number"
            min={1}
            max={999}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmit(value);
              if (e.key === "Escape") onClose();
            }}
          />
        </label>
        <div className="flex gap-3 justify-center mt-2">
          <button
            onClick={() => onSubmit(value)}
            className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-700 font-semibold"
          >
            Valider
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 font-semibold"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
