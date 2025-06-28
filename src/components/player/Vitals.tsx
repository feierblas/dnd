// /components/player/Vitals.tsx

import { Player } from "@/types/Player";
import { useEffect, useState } from "react";

type Props = {
  player: Player;
  onChange: (fields: Partial<Player>) => void;
};

export default function Vitals({ player, onChange }: Props) {
  const [pv, setPv] = useState(player.pv);
  const [pvMax, setPvMax] = useState(player.pvMax);
  const [pvTemp, setPvTemp] = useState(player.pvTemp);
  const [ca, setCa] = useState(player.ca);
  const [initiative, setInitiative] = useState(player.initiative.valeur);
  const [initiativeMode, setInitiativeMode] = useState(player.initiative.mode);
  const [perceptionPassive, setPerceptionPassive] = useState(
    player.perceptionPassive.valeur
  );
  const [perceptionMode, setPerceptionMode] = useState(
    player.perceptionPassive.mode
  );
  const [vitesse, setVitesse] = useState(player.vitesse);
  const [desDeVie, setDesDeVie] = useState(player.desDeVie);
  const [jdsMort, setJdsMort] = useState(player.jdsMort);

  useEffect(() => {
    if (initiativeMode === "auto") {
      const autoVal = player.stats.dexterite.mod;
      setInitiative(autoVal);
      onChange({ initiative: { mode: "auto", valeur: autoVal } });
    }
    // eslint-disable-next-line
  }, [player.stats.dexterite.mod, initiativeMode]);

  useEffect(() => {
    if (perceptionMode === "auto") {
      const autoVal = 10 + player.stats.sagesse.mod;
      setPerceptionPassive(autoVal);
      onChange({ perceptionPassive: { mode: "auto", valeur: autoVal } });
    }
    // eslint-disable-next-line
  }, [player.stats.sagesse.mod, perceptionMode]);
  // Auto calc pour initiative
  function calcInitiative() {
    return player.stats.dexterite.mod;
  }
  // Auto calc pour perception passive
  function calcPerceptionPassive() {
    // 10 + Sagesse mod + bonus maîtrise si compétence perception maîtrisée
    let value = 10 + player.stats.sagesse.mod;
    const perception = player.competences.find((c) => c.nom === "Perception");
    if (perception?.maitrise) value += player.bonusMaitrise;
    if (perception?.expertise) value += player.bonusMaitrise; // Si expertise, double bonus
    return value;
  }
  // Handlers
  function handleUpdate(field: keyof Player, value: any) {
    onChange({ [field]: value });
  }

  // Handler pour les dés de vie
  function handleDesDeVieChange<K extends keyof typeof desDeVie>(
    key: K,
    value: any
  ) {
    const updated = { ...desDeVie, [key]: value };
    setDesDeVie(updated);
    handleUpdate("desDeVie", updated);
  }

  // Handler pour JdS contre la mort
  function handleJdsMortChange<K extends keyof typeof jdsMort>(
    key: K,
    value: any
  ) {
    const updated = { ...jdsMort, [key]: value };
    setJdsMort(updated);
    handleUpdate("jdsMort", updated);
  }

  function handleInitiative(val: number, mode: "auto" | "manuel") {
    if (mode === "auto") {
      const autoVal = calcInitiative();
      setInitiative(autoVal);
      setInitiativeMode("auto");
      onChange({ initiative: { mode: "auto", valeur: autoVal } });
    } else {
      setInitiative(val);
      setInitiativeMode("manuel");
      onChange({ initiative: { mode: "manuel", valeur: val } });
    }
  }

  function handlePerceptionPassive(val: number, mode: "auto" | "manuel") {
    if (mode === "auto") {
      const autoVal = calcPerceptionPassive();
      setPerceptionPassive(autoVal);
      setPerceptionMode("auto");
      onChange({ perceptionPassive: { mode: "auto", valeur: autoVal } });
    } else {
      setPerceptionPassive(val);
      setPerceptionMode("manuel");
      onChange({ perceptionPassive: { mode: "manuel", valeur: val } });
    }
  }

  return (
    <section className="bg-gray-900 p-4 rounded-xl shadow my-4">
      <h2 className="text-xl font-semibold mb-4 text-orange-400 flex items-center">
        Infos Vitales
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white rounded px-3 py-1 ml-4"
          onClick={() => {
            onChange({
              pv: pvMax,
              pvTemp: 0,
              desDeVie: { ...player.desDeVie, restants: player.desDeVie.total },
              jdsMort: { reussites: 0, echecs: 0 },
              sorts: {
                ...player.sorts,
                emplacements: player.sorts.emplacements.map((e) => ({
                  ...e,
                  restants: e.total,
                })),
              },
            });
            setPv(pvMax);
            setPvTemp(0);
            setDesDeVie({
              ...player.desDeVie,
              restants: player.desDeVie.total,
            });
            setJdsMort({ reussites: 0, echecs: 0 });
          }}
        >
          Long repos
        </button>
      </h2>
      <div className="flex flex-wrap gap-8 justify-between">
        {/* PV et Max */}
        <div className="flex flex-col items-center">
          <label className="text-gray-300">PV</label>
          <input
            type="number"
            value={pv}
            min={0}
            max={pvMax}
            onChange={(e) => {
              setPv(Number(e.target.value));
              handleUpdate("pv", Number(e.target.value));
            }}
            className="w-20 text-center rounded bg-gray-800 border-gray-700 font-bold"
          />
          <label className="text-gray-400 text-xs mt-1">Max</label>
          <input
            type="number"
            value={pvMax}
            min={1}
            onChange={(e) => {
              setPvMax(Number(e.target.value));
              handleUpdate("pvMax", Number(e.target.value));
            }}
            className="w-20 text-center rounded bg-gray-800 border-gray-700"
          />
          <label className="text-gray-400 text-xs mt-1">Temp</label>
          <input
            type="number"
            value={pvTemp}
            min={0}
            onChange={(e) => {
              setPvTemp(Number(e.target.value));
              handleUpdate("pvTemp", Number(e.target.value));
            }}
            className="w-20 text-center rounded bg-gray-800 border-gray-700"
          />
        </div>

        {/* CA */}
        <div className="flex flex-col items-center">
          <label className="text-gray-300">CA</label>
          <input
            type="number"
            value={ca}
            min={1}
            onChange={(e) => {
              setCa(Number(e.target.value));
              handleUpdate("ca", Number(e.target.value));
            }}
            className="w-20 text-center rounded bg-gray-800 border-gray-700 font-bold"
          />
        </div>

        {/* XP */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">XP</span>
          <input
            type="number"
            value={player.xp}
            onChange={(e) => onChange({ xp: Number(e.target.value) })}
            className="w-24 text-center rounded bg-gray-800 border-gray-700 px-2"
          />
        </div>

        {/* BM */}
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-400">Bonus maîtrise</span>
          <input
            type="number"
            value={player.bonusMaitrise}
            onChange={(e) =>
              onChange({ bonusMaitrise: Number(e.target.value) })
            }
            className="w-16 text-center rounded bg-gray-800 border-gray-700 px-2"
          />
        </div>

        {/* Initiative */}
        <div className="flex flex-col items-center">
          <label className="text-gray-300">Initiative</label>
          <input
            type="number"
            value={initiative}
            disabled={initiativeMode === "auto"}
            onChange={(e) => handleInitiative(Number(e.target.value), "manuel")}
            className="w-20 text-center rounded bg-gray-800 border-gray-700"
          />
          <select
            value={initiativeMode}
            onChange={(e) =>
              handleInitiative(
                e.target.value === "auto" ? 0 : initiative,
                e.target.value as "auto" | "manuel"
              )
            }
            className="mt-1 rounded px-1 py-0.5 text-xs"
          >
            <option value="auto">Auto</option>
            <option value="manuel">Manuel</option>
          </select>
        </div>

        {/* Perception passive */}
        <div className="flex flex-col items-center">
          <label className="text-gray-300">Perception passive</label>
          <input
            type="number"
            value={perceptionPassive}
            disabled={perceptionMode === "auto"}
            onChange={(e) =>
              handlePerceptionPassive(Number(e.target.value), "manuel")
            }
            className="w-20 text-center rounded bg-gray-800 border-gray-700"
          />
          <select
            value={perceptionMode}
            onChange={(e) =>
              handlePerceptionPassive(
                e.target.value === "auto" ? 0 : perceptionPassive,
                e.target.value as "auto" | "manuel"
              )
            }
            className="mt-1 rounded px-1 py-0.5 text-xs"
          >
            <option value="auto">Auto</option>
            <option value="manuel">Manuel</option>
          </select>
        </div>
        {/* Vitesse */}
        <div className="flex flex-col items-center">
          <label className="text-gray-300">Vitesse (m)</label>
          <input
            type="number"
            value={vitesse}
            min={0}
            step={0.5}
            onChange={(e) => {
              setVitesse(Number(e.target.value));
              handleUpdate("vitesse", Number(e.target.value));
            }}
            className="w-20 text-center rounded bg-gray-800 border-gray-700"
          />
        </div>

        {/* Dés de vie */}
        <div className="flex flex-col items-center">
          <label className="text-gray-300">Dés de Vie</label>
          <input
            type="text"
            value={desDeVie.type}
            onChange={(e) => handleDesDeVieChange("type", e.target.value)}
            className="w-20 text-center rounded bg-gray-800 border-gray-700"
          />
          <label className="text-gray-400 text-xs mt-1">Total</label>
          <input
            type="number"
            value={desDeVie.total}
            min={0}
            onChange={(e) =>
              handleDesDeVieChange("total", Number(e.target.value))
            }
            className="w-20 text-center rounded bg-gray-800 border-gray-700"
          />
          <label className="text-gray-400 text-xs mt-1">Restants</label>
          <input
            type="number"
            value={desDeVie.restants}
            min={0}
            max={desDeVie.total}
            onChange={(e) =>
              handleDesDeVieChange("restants", Number(e.target.value))
            }
            className="w-20 text-center rounded bg-gray-800 border-gray-700"
          />
        </div>

        {/* JdS contre la mort */}
        <div className="flex flex-col items-center">
          <label className="text-gray-300">JdS Contre la Mort</label>
          <div className="flex gap-2 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-xs text-green-400">Réussites</span>
              <input
                type="number"
                value={jdsMort.reussites}
                min={0}
                max={3}
                onChange={(e) =>
                  handleJdsMortChange("reussites", Number(e.target.value))
                }
                className="w-10 text-center rounded bg-gray-800 border-gray-700"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-red-400">Échecs</span>
              <input
                type="number"
                value={jdsMort.echecs}
                min={0}
                max={3}
                onChange={(e) =>
                  handleJdsMortChange("echecs", Number(e.target.value))
                }
                className="w-10 text-center rounded bg-gray-800 border-gray-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
