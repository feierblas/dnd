"use client";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (dmgObj: Record<string, number>) => void;
};

export function DamageDrawer({ open, onClose, onSubmit }: Readonly<Props>) {
  const [damageTypes, setDamageTypes] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open) {
      fetch("/api/damage_types")
        .then((r) => r.json())
        .then((data) => {
          setDamageTypes(data.types ?? []);
          // Initialise tous les types à 0
          const init: Record<string, number> = {};
          (data.types ?? []).forEach((type: string) => (init[type] = 0));
          setValues(init);
        });
    }
  }, [open]);

  function handleChange(type: string, val: string) {
    setValues((v) => ({
      ...v,
      [type]: Math.max(0, Number(val) || 0),
    }));
  }

  function handleSubmit() {
    const filtered = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v > 0)
    );
    if (Object.keys(filtered).length === 0) return;
    onSubmit(filtered);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg flex flex-col gap-4 min-w-[320px] max-w-[95vw]">
        <h2 className="text-xl font-bold mb-2">Infliger des dégâts</h2>
        <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto mb-2">
          {damageTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm">
              <span className="w-32">{type}</span>
              <input
                type="number"
                min={0}
                max={999}
                value={values[type] || 0}
                className="p-1 rounded bg-gray-800 text-white w-20"
                onChange={(e) => handleChange(type, e.target.value)}
              />
            </label>
          ))}
        </div>
        <div className="flex gap-3 justify-center mt-2">
          <button
            onClick={handleSubmit}
            disabled={Object.values(values).every((v) => !v)}
            className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-700 font-semibold disabled:opacity-50"
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
