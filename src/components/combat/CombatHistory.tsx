// components/combat/CombatHistory.tsx
import { ActionCombat } from "@/types/combat";

export function CombatHistory({
  historique,
  showUndo,
  onUndo,
}: {
  historique: ActionCombat[];
  showUndo: boolean;
  onUndo: () => void;
}) {
  return (
    <section className="w-full max-w-5xl mt-6">
      <div className="flex items-center mb-2">
        <h2 className="font-semibold text-lg flex-1">Historique des actions</h2>
        {showUndo && (
          <button
            onClick={onUndo}
            className="px-3 py-1 bg-orange-600 hover:bg-orange-700 rounded text-xs font-semibold ml-3"
            title="Annuler la dernière action"
          >
            Undo
          </button>
        )}
      </div>
      <div
        className="bg-gray-800 rounded-lg p-3"
        style={{ maxHeight: 340, overflowY: "auto" }}
      >
        <ol className="space-y-1">
          {historique
            ?.slice()
            .reverse()
            .map((action, i) => (
              <li
                key={i}
                className="text-xs px-2 py-1 bg-gray-900 rounded flex items-center gap-2"
              >
                <span
                  className={
                    action.type === "heal"
                      ? "text-green-400"
                      : action.type === "damage"
                      ? "text-red-400"
                      : action.type === "add"
                      ? "text-blue-400"
                      : action.type === "delete"
                      ? "text-pink-400"
                      : action.type === "resvuln"
                      ? "text-amber-400"
                      : "text-gray-300"
                  }
                >
                  {action.type.toUpperCase()}
                </span>
                <span>{action.details}</span>
                <span className="ml-auto text-gray-500">
                  {new Date(action.date).toLocaleTimeString()}
                </span>
              </li>
            ))}
          {!historique?.length && (
            <li className="text-gray-500 italic">
              Aucune action pour ce combat.
            </li>
          )}
        </ol>
      </div>
    </section>
  );
}
