// /components/player/MaitrisesEtArmes.tsx

import { Maitrises, Arme } from "@/types/Player";

type Props = {
  maitrises: Maitrises;
  armes: Arme[];
  onChangeMaitrises: (m: Maitrises) => void;
  onChangeArmes: (a: Arme[]) => void;
};

export default function MaitrisesEtArmes({
  maitrises,
  armes,
  onChangeMaitrises,
  onChangeArmes,
}: Props) {
  // Pour l’UI, simple array editor + table
  function updateArray(list: string[], i: number, v: string) {
    return list.map((item, idx) => (idx === i ? v : item));
  }
  function removeArray(list: string[], i: number) {
    return list.filter((_, idx) => idx !== i);
  }
  function addArray(list: string[]) {
    return [...list, ""];
  }

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
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">
        Maîtrises & armes
      </h2>
      <div className="flex flex-wrap gap-8 mb-4">
        {/* Maîtrises */}
        <div>
          <div className="font-semibold text-gray-300 mb-1">Armures</div>
          {maitrises.armures.map((v, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input
                type="text"
                value={v}
                onChange={(e) =>
                  onChangeMaitrises({
                    ...maitrises,
                    armures: updateArray(maitrises.armures, i, e.target.value),
                  })
                }
                className="rounded bg-gray-800 border-gray-700 px-2 py-1"
              />
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() =>
                  onChangeMaitrises({
                    ...maitrises,
                    armures: removeArray(maitrises.armures, i),
                  })
                }
              >
                ✕
              </button>
            </div>
          ))}
          <button
            className="text-green-600 font-bold"
            onClick={() =>
              onChangeMaitrises({
                ...maitrises,
                armures: addArray(maitrises.armures),
              })
            }
          >
            + Armure
          </button>
        </div>
        <div>
          <div className="font-semibold text-gray-300 mb-1">Armes</div>
          {maitrises.armes.map((v, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input
                type="text"
                value={v}
                onChange={(e) =>
                  onChangeMaitrises({
                    ...maitrises,
                    armes: updateArray(maitrises.armes, i, e.target.value),
                  })
                }
                className="rounded bg-gray-800 border-gray-700 px-2 py-1"
              />
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() =>
                  onChangeMaitrises({
                    ...maitrises,
                    armes: removeArray(maitrises.armes, i),
                  })
                }
              >
                ✕
              </button>
            </div>
          ))}
          <button
            className="text-green-600 font-bold"
            onClick={() =>
              onChangeMaitrises({
                ...maitrises,
                armes: addArray(maitrises.armes),
              })
            }
          >
            + Arme
          </button>
        </div>
        <div>
          <div className="font-semibold text-gray-300 mb-1">Outils</div>
          {maitrises.outils.map((v, i) => (
            <div key={i} className="flex gap-2 mb-1">
              <input
                type="text"
                value={v}
                onChange={(e) =>
                  onChangeMaitrises({
                    ...maitrises,
                    outils: updateArray(maitrises.outils, i, e.target.value),
                  })
                }
                className="rounded bg-gray-800 border-gray-700 px-2 py-1"
              />
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() =>
                  onChangeMaitrises({
                    ...maitrises,
                    outils: removeArray(maitrises.outils, i),
                  })
                }
              >
                ✕
              </button>
            </div>
          ))}
          <button
            className="text-green-600 font-bold"
            onClick={() =>
              onChangeMaitrises({
                ...maitrises,
                outils: addArray(maitrises.outils),
              })
            }
          >
            + Outil
          </button>
        </div>
      </div>
      {/* Table des armes */}
      <div className="mt-4">
        <div className="font-semibold text-gray-300 mb-1">Armes</div>
        <table className="w-full text-sm mb-2">
          <thead>
            <tr className="text-orange-300 border-b border-gray-700">
              <th>Nom</th>
              <th>Attaque</th>
              <th>Dégâts</th>
              <th>Propriétés</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {armes.map((a, i) => (
              <tr key={i} className="border-b border-gray-800">
                <td>
                  <input
                    type="text"
                    value={a.nom}
                    onChange={(e) => updateArme(i, { nom: e.target.value })}
                    className="w-full rounded bg-gray-800 border-gray-700 px-2"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={a.attaque}
                    onChange={(e) => updateArme(i, { attaque: e.target.value })}
                    className="w-20 rounded bg-gray-800 border-gray-700 text-center"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={a.degats}
                    onChange={(e) => updateArme(i, { degats: e.target.value })}
                    className="w-20 rounded bg-gray-800 border-gray-700 text-center"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={a.proprietes?.join(", ") ?? ""}
                    onChange={(e) =>
                      updateArme(i, {
                        proprietes: e.target.value
                          .split(",")
                          .map((s) => s.trim()),
                      })
                    }
                    className="w-24 rounded bg-gray-800 border-gray-700"
                    placeholder="Finesse, Lancer…"
                  />
                </td>
                <td>
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
        <button
          className="bg-green-700 hover:bg-green-800 px-3 py-1 rounded text-white"
          onClick={addArme}
        >
          + Ajouter une arme
        </button>
      </div>
    </section>
  );
}
