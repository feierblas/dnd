"use client";
import { useRef, useEffect, useState } from "react";

type Props = {
  open: boolean;
  type: "heal" | "dmg";
  onSubmit: (val: number) => void;
  onClose: () => void;
};

export function HealDamagePopover({
  open,
  type,
  onSubmit,
  onClose,
}: Readonly<Props>) {
  const [val, setVal] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setVal(1);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="absolute z-30 left-1/2 -translate-x-1/2 top-10 bg-gray-800 border border-orange-500 rounded-lg p-3 shadow-xl flex flex-col items-center min-w-[120px]">
      <div className="mb-2 text-sm">
        {type === "heal" ? "Ajouter des PV" : "Infliger des dégâts"}
      </div>
      <input
        ref={inputRef}
        className="p-1 mb-2 w-16 rounded bg-gray-900 text-center text-white border border-gray-600"
        type="number"
        min={1}
        max={999}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit(val);
          if (e.key === "Escape") onClose();
        }}
      />
      <div className="flex gap-2">
        <button
          onClick={() => onSubmit(val)}
          className="px-2 py-1 bg-orange-600 rounded hover:bg-orange-700 text-xs font-semibold"
        >
          OK
        </button>
        <button
          onClick={onClose}
          className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-700 text-xs"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
