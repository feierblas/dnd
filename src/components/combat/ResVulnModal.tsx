"use client";
import { useEffect, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { toast } from "react-hot-toast";

type Props = {
  open: boolean;
  onClose: () => void;
  resistance: string[];
  vulnerabilite: string[];
  onSave: (res: string[], vuln: string[]) => void;
};

function DndTypeItem({
  id,
  label,
  color,
}: {
  id: string;
  label: string;
  color: string;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id,
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`select-none px-3 py-1 my-1 rounded font-semibold cursor-move shadow ${color}
        ${isDragging ? "opacity-40" : ""}`}
      style={{ transition: "opacity .18s" }}
    >
      {label}
    </div>
  );
}

function DndDropCol({
  id,
  label,
  children,
  bg,
  minH = 180,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  bg: string;
  minH?: number;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div className="flex-1 flex flex-col items-center">
      <h3 className="text-lg font-bold mb-2 select-none">{label}</h3>
      <div
        ref={setNodeRef}
        className={`${bg} min-h-[${minH}px] p-3 w-full rounded transition`}
        style={{
          border: isOver ? "2px solid #fdba74" : undefined,
          minHeight: minH,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function ResVulnModal({
  open,
  onClose,
  resistance,
  vulnerabilite,
  onSave,
}: Props) {
  const [damageTypes, setDamageTypes] = useState<string[]>([]);
  const [res, setRes] = useState<string[]>([]);
  const [vuln, setVuln] = useState<string[]>([]);
  const [pool, setPool] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      fetch("/api/damage_types")
        .then((r) => r.json())
        .then((data) => {
          setDamageTypes(data.types || []);
          setRes(resistance || []);
          setVuln(vulnerabilite || []);
          setPool(
            (data.types || []).filter(
              (t: string) =>
                !(resistance || []).includes(t) &&
                !(vulnerabilite || []).includes(t)
            )
          );
        });
    }
  }, [open, resistance, vulnerabilite]);

  // DND Kit setup
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const [fromList, fromVal] = active.id.toString().split(":");
    const [toList] = over.id.toString().split(":");
    if (fromList === toList) return; // pas de move
    // Remove from tous, puis add au bon
    setPool((p) => p.filter((t) => t !== fromVal));
    setRes((p) => p.filter((t) => t !== fromVal));
    setVuln((p) => p.filter((t) => t !== fromVal));
    if (toList === "pool") setPool((p) => [...p, fromVal]);
    if (toList === "res") setRes((p) => [...p, fromVal]);
    if (toList === "vuln") setVuln((p) => [...p, fromVal]);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col gap-4 min-w-[650px] max-w-[99vw]">
        <h2 className="text-xl font-bold text-center mb-2">
          Résistances & Vulnérabilités
        </h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 justify-center items-start">
            {/* Résistances */}
            <DndDropCol id="res" label="Résistances" bg="bg-green-950">
              {res.length > 0 ? (
                res.map((type) => (
                  <DndTypeItem
                    key={`res:${type}`}
                    id={`res:${type}`}
                    label={type}
                    color="bg-green-800 text-green-100"
                  />
                ))
              ) : (
                <div className="text-xs text-green-800">—</div>
              )}
            </DndDropCol>
            {/* Pool */}
            <DndDropCol id="pool" label="Types disponibles" bg="bg-gray-800">
              {pool.length > 0 ? (
                pool.map((type) => (
                  <DndTypeItem
                    key={`pool:${type}`}
                    id={`pool:${type}`}
                    label={type}
                    color="bg-gray-700 text-gray-100"
                  />
                ))
              ) : (
                <div className="text-xs text-gray-400">—</div>
              )}
            </DndDropCol>
            {/* Vulnérabilités */}
            <DndDropCol id="vuln" label="Vulnérabilités" bg="bg-red-950">
              {vuln.length > 0 ? (
                vuln.map((type) => (
                  <DndTypeItem
                    key={`vuln:${type}`}
                    id={`vuln:${type}`}
                    label={type}
                    color="bg-red-800 text-red-100"
                  />
                ))
              ) : (
                <div className="text-xs text-red-800">—</div>
              )}
            </DndDropCol>
          </div>
        </DndContext>
        <div className="flex gap-3 justify-center mt-2">
          <button
            onClick={() => onSave(res, vuln)}
            className="px-4 py-2 bg-orange-600 rounded hover:bg-orange-700 font-semibold"
          >
            Sauvegarder
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
