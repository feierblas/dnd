// components/combat/EditableCell.tsx
import { useState, useEffect } from "react";

type EditableCellProps<T extends string | number> = {
  value: T;
  onSave: (val: T) => void;
  type?: "text" | "number";
  width?: string;
  disabled?: boolean;
};

export function EditableCell<T extends string | number>({
  value,
  onSave,
  type = "text",
  width = "w-32",
  disabled = false,
}: EditableCellProps<T>) {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState<T>(value);

  useEffect(() => setTempValue(value), [value]);

  function handleBlur() {
    setEditing(false);
    if (tempValue !== value) onSave(tempValue);
  }

  if (disabled)
    return (
      <span className={`block px-2 py-1 italic opacity-60 ${width}`}>
        {value === "" ? <span className="italic">-</span> : value}
      </span>
    );

  return editing ? (
    <input
      type={type}
      className={`bg-gray-900 border border-orange-500 rounded px-2 py-1 text-xs text-white ${width}`}
      autoFocus
      value={tempValue as any}
      onChange={(e) =>
        setTempValue(
          type === "number" ? (e.target.value as any) : (e.target.value as T)
        )
      }
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        if (e.key === "Escape") setEditing(false);
      }}
    />
  ) : (
    <span
      className={`block px-2 py-1 cursor-pointer hover:bg-orange-900 rounded transition ${width}`}
      onClick={() => setEditing(true)}
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? setEditing(true) : undefined)}
    >
      {value === "" ? <span className="opacity-40 italic">-</span> : value}
    </span>
  );
}
