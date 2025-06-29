import { Arme } from "@/types/Player";
import { useState } from "react";

// Cellule éditable au blur
function EditableTextCell({
  value,
  onSave,
  ...props
}: {
  value: string;
  onSave: (newValue: string) => void;
  [key: string]: any;
}) {
  const [edit, setEdit] = useState(value);

  // Si la valeur parent change (par ex. reset), on sync.
  // (optionnel selon tes besoins)
  // useEffect(() => setEdit(value), [value]);

  return (
    <input
      {...props}
      value={edit}
      onChange={(e) => setEdit(e.target.value)}
      onBlur={() => {
        if (edit !== value) onSave(edit);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
      }}
    />
  );
}

type Props = {
  armes: Arme[];
  onChangeArmes: (a: Arme[]) => void;
};

export default function Armes({ armes, onChangeArmes }: Props) {
  function updateArme(i: number, patch: Partial<Arme>) {
    onChangeArmes(armes.map((a, idx) => (idx === i ? { ...a, ...patch } : a)));
  }
  function removeArme(i: number) {
    onChangeArmes(armes.filter((_, idx) => idx !== i));
  }
  function addArme() {
    onChangeArmes([
      ...armes,
      { nom: "", attaque: "", degats: "", proprietes: [] },
    ]);
  }

  return (
    <section className="bg-gray-900 rounded-xl shadow p-3 w-full max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-orange-400">Armes</h2>
        <button
          className="bg-green-700 hover:bg-green-800 px-3 py-1 rounded text-white"
          onClick={addArme}
        >
          + Ajouter une arme
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm mb-2">
          <thead>
            <tr className="text-orange-300 border-b border-gray-700">
              <th className="text-left px-2 py-1">Nom</th>
              <th className="text-center px-2 py-1">Attaque</th>
              <th className="text-center px-2 py-1">Dégâts</th>
              <th className="text-left px-2 py-1">Propriétés</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {armes.map((a, i) => (
              <tr
                key={i}
                className="border-b border-gray-800 hover:bg-gray-800 transition"
              >
                <td className="px-2 py-1">
                  <EditableTextCell
                    value={a.nom}
                    onSave={(nv) => updateArme(i, { nom: nv })}
                    className="w-full min-w-0 rounded bg-gray-700 border border-gray-600 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-2 py-1 text-center">
                  <EditableTextCell
                    value={a.attaque}
                    onSave={(nv) => updateArme(i, { attaque: nv })}
                    className="w-16 min-w-0 rounded bg-gray-700 border border-gray-600 text-center px-1 py-1 text-sm"
                  />
                </td>
                <td className="px-2 py-1 text-center">
                  <EditableTextCell
                    value={a.degats}
                    onSave={(nv) => updateArme(i, { degats: nv })}
                    className="w-20 min-w-0 rounded bg-gray-700 border border-gray-600 text-center px-1 py-1 text-sm"
                  />
                </td>
                <td className="px-2 py-1">
                  <EditableTextCell
                    value={a.proprietes?.join(", ") ?? ""}
                    onSave={(nv) =>
                      updateArme(i, {
                        proprietes: nv
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="w-full min-w-0 rounded bg-gray-700 border border-gray-600 px-2 py-1 text-sm"
                    placeholder="Finesse, Lancer…"
                  />
                </td>
                <td className="px-2 py-1 text-center">
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeArme(i)}
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
