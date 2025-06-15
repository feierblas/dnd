// components/combat/CombatTable.tsx
import { EditableField } from "@/types/combat";
import { EditableCell } from "./EditableCell";
import { DropdownEtat } from "@/components/dropdowns/DropdownEtat";
import { DropdownTypeCreature } from "@/components/dropdowns/DropdownTypeCreature";
import { Creature } from "@/types/creature";

type Props = {
  creatures: Creature[];
  etatCombat: "preparation" | "enCours" | "archive";
  onEdit: (creatureId: string, field: EditableField, value: any) => void;
  onHeal: (creatureId: string) => void;
  onDamage: (creatureId: string) => void;
  onDelete: (creatureId: string) => void;
  onResVuln: (creature: Creature) => void;
};

export function CombatTable({
  creatures,
  etatCombat,
  onEdit,
  onHeal,
  onDamage,
  onDelete,
  onResVuln,
}: Props) {
  return (
    <div className="w-full flex justify-center">
      <table className="w-full max-w-5xl min-w-[800px] border-collapse rounded-xl shadow">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-2 py-2 w-36">Créature</th>
            <th className="px-2 py-2 w-48">Type</th>
            <th className="px-2 py-2 w-20">PV</th>
            <th className="px-2 py-2 w-16">CA</th>
            <th className="px-2 py-2 w-16">Vitesse</th>
            <th className="px-2 py-2 w-16">DD Sorts</th>
            <th className="px-2 py-2">État</th>
            <th className="px-2 py-2">Concentration</th>
            <th className="px-2 py-2 w-16">Initiative</th>
            <th className="px-2 py-2 max-w-[200px]">Commentaire</th>
            <th className="px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {creatures.map((creature) => {
            const isMort = creature.pv < 0;
            const isTour = creature.tourActuel;
            let rowClass = "";
            if (isMort) rowClass = "bg-red-900 text-red-200";
            else if (isTour) rowClass = "bg-green-800 text-green-100";
            else rowClass = "bg-gray-800";

            const canEdit = etatCombat !== "archive";
            const canHeal = etatCombat === "enCours";
            const canDamage = etatCombat === "enCours";
            const canResVuln = etatCombat !== "archive";
            const canDelete = etatCombat !== "archive";

            return (
              <tr key={creature.id} className={`${rowClass} transition`}>
                <td className="px-2 py-2 font-bold flex items-center gap-2">
                  {isTour && (
                    <span className="inline-block bg-green-500 text-green-900 text-xs font-bold rounded px-2 py-1 mr-2">
                      Tour
                    </span>
                  )}
                  <EditableCell
                    value={creature.nom}
                    onSave={(val) => onEdit(creature.id, "nom", val)}
                    type="text"
                    width="w-36"
                    disabled={!canEdit}
                  />
                </td>
                <td className="px-2 py-2 w-48">
                  <DropdownTypeCreature
                    valeur={creature.type}
                    onChange={(newType) => onEdit(creature.id, "type", newType)}
                    disabled={!canEdit}
                  />
                </td>
                <td className="px-2 py-2 text-center w-20">
                  <EditableCell
                    value={creature.pv}
                    onSave={(val) => onEdit(creature.id, "pv", Number(val))}
                    type="number"
                    width="w-20"
                    disabled={!canEdit}
                  />
                </td>
                <td className="px-2 py-2 text-center w-16">
                  <EditableCell
                    value={creature.ca}
                    onSave={(val) => onEdit(creature.id, "ca", Number(val))}
                    type="number"
                    width="w-16"
                    disabled={!canEdit}
                  />
                </td>
                <td className="px-2 py-2 text-center w-16">
                  <EditableCell
                    value={creature.vitesse}
                    onSave={(val) =>
                      onEdit(creature.id, "vitesse", Number(val))
                    }
                    type="number"
                    width="w-16"
                    disabled={!canEdit}
                  />
                </td>
                <td className="px-2 py-2 text-center w-16">
                  <EditableCell
                    value={creature.ddSorts}
                    onSave={(val) =>
                      onEdit(creature.id, "ddSorts", Number(val))
                    }
                    type="number"
                    width="w-16"
                    disabled={!canEdit}
                  />
                </td>
                <td className="px-2 py-2">
                  <DropdownEtat
                    valeur={creature.etat}
                    onChange={(newEtat) => onEdit(creature.id, "etat", newEtat)}
                    disabled={!canEdit}
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={creature.concentration}
                    onChange={(e) =>
                      onEdit(creature.id, "concentration", e.target.checked)
                    }
                    className="accent-orange-500 cursor-pointer"
                    disabled={!canEdit}
                  />
                </td>
                <td className="px-2 py-2 text-center font-semibold w-16">
                  <EditableCell
                    value={creature.initiative}
                    onSave={(val) =>
                      onEdit(creature.id, "initiative", Number(val))
                    }
                    type="number"
                    width="w-16"
                    disabled={!canEdit}
                  />
                </td>
                <td className="px-2 py-2 max-w-[200px] whitespace-pre-line break-words">
                  <EditableCell
                    value={creature.commentaire}
                    onSave={(val) => onEdit(creature.id, "commentaire", val)}
                    type="text"
                    width="w-44"
                    disabled={!canEdit}
                  />
                </td>
                <td className="px-2 py-2 text-center flex gap-2 justify-center relative">
                  {/* Heal */}
                  <button
                    className={`text-green-400 hover:text-green-300 text-lg ${
                      !canHeal ? "opacity-40 pointer-events-none" : ""
                    }`}
                    title="Soigner"
                    disabled={!canHeal}
                    onClick={() => canHeal && onHeal(creature.id)}
                  >
                    ❤️
                  </button>
                  {/* Damage */}
                  <button
                    className={`text-red-400 hover:text-red-300 text-lg ${
                      !canDamage ? "opacity-40 pointer-events-none" : ""
                    }`}
                    title="Infliger des dégâts"
                    disabled={!canDamage}
                    onClick={() => canDamage && onDamage(creature.id)}
                  >
                    ⚔️
                  </button>
                  {/* Res/Vuln */}
                  <button
                    className={`hover:text-blue-400 text-xl ${
                      !canResVuln ? "opacity-40 pointer-events-none" : ""
                    }`}
                    title="Gérer résistances/vulnérabilités"
                    disabled={!canResVuln}
                    onClick={() => canResVuln && onResVuln(creature)}
                  >
                    🛡️
                  </button>
                  {/* Delete */}
                  <button
                    className={`hover:text-red-500 text-xl ${
                      !canDelete ? "opacity-40 pointer-events-none" : ""
                    }`}
                    title="Supprimer la créature"
                    disabled={!canDelete}
                    onClick={() => canDelete && onDelete(creature.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
