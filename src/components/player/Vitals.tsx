import { Player } from "@/types/Player";
import { useState, useEffect } from "react";

type Props = {
  player: Player;
  onChange: (fields: Partial<Player>) => void;
};

export default function Vitals({ player, onChange }: Props) {
  // States locaux pour chaque champ éditable
  const [pv, setPv] = useState(player.pv);
  const [pvMax, setPvMax] = useState(player.pvMax);
  const [pvTemp, setPvTemp] = useState(player.pvTemp);
  const [ca, setCa] = useState(player.ca);
  const [bonusMaitrise, setBonusMaitrise] = useState(player.bonusMaitrise);
  const [xp, setXp] = useState(player.xp);
  const [initiativeMode, setInitiativeMode] = useState(player.initiative.mode);
  const [initiativeManu, setInitiativeManu] = useState(
    player.initiative.valeur
  );
  const [perceptionMode, setPerceptionMode] = useState(
    player.perceptionPassive.mode
  );
  const [perceptionManu, setPerceptionManu] = useState(
    player.perceptionPassive.valeur
  );
  const [vitesse, setVitesse] = useState(player.vitesse);
  const [desDeVie, setDesDeVie] = useState(player.desDeVie);
  const [jdsMort, setJdsMort] = useState(player.jdsMort);

  // Si le player change (ex: nouvelle fiche), reset les states locaux
  useEffect(() => {
    setPv(player.pv);
  }, [player.pv]);
  useEffect(() => {
    setPvMax(player.pvMax);
  }, [player.pvMax]);
  useEffect(() => {
    setPvTemp(player.pvTemp);
  }, [player.pvTemp]);
  useEffect(() => {
    setCa(player.ca);
  }, [player.ca]);
  useEffect(() => {
    setBonusMaitrise(player.bonusMaitrise);
  }, [player.bonusMaitrise]);
  useEffect(() => {
    setXp(player.xp);
  }, [player.xp]);
  useEffect(() => {
    setInitiativeMode(player.initiative.mode);
  }, [player.initiative.mode]);
  useEffect(() => {
    setInitiativeManu(player.initiative.valeur);
  }, [player.initiative.valeur]);
  useEffect(() => {
    setPerceptionMode(player.perceptionPassive.mode);
  }, [player.perceptionPassive.mode]);
  useEffect(() => {
    setPerceptionManu(player.perceptionPassive.valeur);
  }, [player.perceptionPassive.valeur]);
  useEffect(() => {
    setVitesse(player.vitesse);
  }, [player.vitesse]);
  useEffect(() => {
    setDesDeVie(player.desDeVie);
  }, [player.desDeVie]);
  useEffect(() => {
    setJdsMort(player.jdsMort);
  }, [player.jdsMort]);

  function calcInitiative() {
    return player.stats.dexterite.mod;
  }
  function calcPerceptionPassive() {
    let value = 10 + player.stats.sagesse.mod;
    const perception = player.competences.find((c) => c.nom === "Perception");
    if (perception?.maitrise) value += player.bonusMaitrise;
    if (perception?.expertise) value += player.bonusMaitrise;
    return value;
  }

  function handleLongRest() {
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
    setDesDeVie({ ...player.desDeVie, restants: player.desDeVie.total });
    setJdsMort({ reussites: 0, echecs: 0 });
  }

  // INITIATIVE & PERCEPTION => Save direct sur select
  function handleInitiative(val: number, mode: "auto" | "manuel") {
    setInitiativeMode(mode);
    if (mode === "auto") {
      onChange({ initiative: { mode: "auto", valeur: calcInitiative() } });
    } else {
      setInitiativeManu(val);
      onChange({ initiative: { mode: "manuel", valeur: val } });
    }
  }
  function handlePerceptionPassive(val: number, mode: "auto" | "manuel") {
    setPerceptionMode(mode);
    if (mode === "auto") {
      onChange({
        perceptionPassive: { mode: "auto", valeur: calcPerceptionPassive() },
      });
    } else {
      setPerceptionManu(val);
      onChange({ perceptionPassive: { mode: "manuel", valeur: val } });
    }
  }

  // Pour JdS contre la mort (avec cercles interactifs)
  function handleJdsMortChange<K extends keyof typeof jdsMort>(
    key: K,
    value: any
  ) {
    const updated = { ...jdsMort, [key]: value };
    setJdsMort(updated);
    onChange({ jdsMort: updated });
  }

  // Pour Dés de vie (save au blur)
  function handleDesDeVieChange<K extends keyof typeof desDeVie>(
    key: K,
    value: any
  ) {
    const updated = { ...desDeVie, [key]: value };
    setDesDeVie(updated);
  }
  function saveDesDeVie() {
    onChange({ desDeVie });
  }

  // --------- RENDU JSX ----------
  return (
    <section className="bg-gray-900 rounded-xl shadow p-3 w-full max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-orange-400">Infos Vitales</h2>
        <button
          className="bg-blue-600 hover:bg-blue-800 text-white rounded px-2 py-0.5 font-bold shadow transition"
          onClick={handleLongRest}
        >
          Long repos
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {/* PV groupé */}
        <div className="bg-gray-800 rounded p-1 flex flex-col items-center row-span-2">
          <span className="text-sm text-gray-400 font-semibold">
            Points de Vie
          </span>
          <input
            type="number"
            value={pv}
            min={0}
            max={pvMax}
            onChange={(e) => setPv(Number(e.target.value))}
            onBlur={() => onChange({ pv })}
            className="w-20 h-10 text-center rounded bg-gray-900 border border-gray-700 font-bold text-xl"
          />
          <div className="flex gap-1 mt-2.5">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400">Max</span>
              <input
                type="number"
                value={pvMax}
                min={1}
                onChange={(e) => setPvMax(Number(e.target.value))}
                onBlur={() => onChange({ pvMax })}
                className="w-14 text-center rounded bg-gray-900 border border-gray-700 text-xs"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-400">Temp</span>
              <input
                type="number"
                value={pvTemp}
                min={0}
                onChange={(e) => setPvTemp(Number(e.target.value))}
                onBlur={() => onChange({ pvTemp })}
                className="w-14 text-center rounded bg-gray-900 border border-gray-700 text-xs"
              />
            </div>
          </div>
        </div>
        {/* Ligne 1 à droite du PV */}
        <div className="bg-gray-800 rounded p-1 flex flex-col items-center">
          <span className="text-[10px] text-gray-400">CA</span>
          <input
            type="number"
            value={ca}
            min={1}
            onChange={(e) => setCa(Number(e.target.value))}
            onBlur={() => onChange({ ca })}
            className="w-14 text-center rounded bg-gray-900 border border-gray-700 font-bold text-sm"
          />
        </div>
        <div className="bg-gray-800 rounded p-1 flex flex-col items-center">
          <span className="text-[10px] text-gray-400">XP</span>
          <input
            type="number"
            value={xp}
            onChange={(e) => setXp(Number(e.target.value))}
            onBlur={() => onChange({ xp })}
            className="w-16 text-center rounded bg-gray-900 border border-gray-700 font-bold text-sm"
          />
        </div>
        <div className="bg-gray-800 rounded p-1 flex flex-col items-center">
          <span className="text-[10px] text-gray-400">Initiative</span>
          <input
            type="number"
            value={
              initiativeMode === "auto" ? calcInitiative() : initiativeManu
            }
            disabled={initiativeMode === "auto"}
            onChange={(e) => setInitiativeManu(Number(e.target.value))}
            onBlur={() =>
              initiativeMode === "manuel" &&
              onChange({
                initiative: { mode: "manuel", valeur: initiativeManu },
              })
            }
            className="w-14 text-center rounded bg-gray-900 border border-gray-700 font-bold text-sm"
          />
          <select
            value={initiativeMode}
            onChange={(e) =>
              handleInitiative(
                e.target.value === "auto" ? calcInitiative() : initiativeManu,
                e.target.value as "auto" | "manuel"
              )
            }
            className="mt-0.5 rounded px-1 py-0.5 text-[10px] w-full bg-gray-700 text-white"
          >
            <option value="auto">Auto</option>
            <option value="manuel">Manuel</option>
          </select>
        </div>
        {/* Ligne 2 à droite du PV */}
        <div className="bg-gray-800 rounded p-1 flex flex-col items-center">
          <span className="text-[10px] text-gray-400">Bonus Maîtrise</span>
          <input
            type="number"
            value={bonusMaitrise}
            onChange={(e) => setBonusMaitrise(Number(e.target.value))}
            onBlur={() => onChange({ bonusMaitrise })}
            className="w-14 text-center rounded bg-gray-900 border border-gray-700 font-bold text-sm"
          />
        </div>
        <div className="bg-gray-800 rounded p-1 flex flex-col items-center">
          <span className="text-[10px] text-gray-400">Vitesse (m)</span>
          <input
            type="number"
            value={vitesse}
            min={0}
            step={0.5}
            onChange={(e) => setVitesse(Number(e.target.value))}
            onBlur={() => onChange({ vitesse })}
            className="w-14 text-center rounded bg-gray-900 border border-gray-700 font-bold text-sm"
          />
        </div>
        <div className="bg-gray-800 rounded p-1 flex flex-col items-center">
          <span className="text-[10px] text-gray-400">Perception passive</span>
          <input
            type="number"
            value={
              perceptionMode === "auto"
                ? calcPerceptionPassive()
                : perceptionManu
            }
            disabled={perceptionMode === "auto"}
            onChange={(e) => setPerceptionManu(Number(e.target.value))}
            onBlur={() =>
              perceptionMode === "manuel" &&
              onChange({
                perceptionPassive: { mode: "manuel", valeur: perceptionManu },
              })
            }
            className="w-14 text-center rounded bg-gray-900 border border-gray-700 font-bold text-sm"
          />
          <select
            value={perceptionMode}
            onChange={(e) =>
              handlePerceptionPassive(
                e.target.value === "auto"
                  ? calcPerceptionPassive()
                  : perceptionManu,
                e.target.value as "auto" | "manuel"
              )
            }
            className="mt-0.5 rounded px-1 py-0.5 text-[10px] w-full bg-gray-700 text-white"
          >
            <option value="auto">Auto</option>
            <option value="manuel">Manuel</option>
          </select>
        </div>
      </div>
      {/* Ligne Dés de Vie & JdS */}
      <div className="grid grid-cols-2 gap-1 mt-1">
        <div className="bg-gray-800 rounded p-1 flex flex-col items-center">
          <span className="text-[10px] text-gray-400">Dés de Vie</span>
          <input
            type="text"
            value={desDeVie.type}
            onChange={(e) => setDesDeVie({ ...desDeVie, type: e.target.value })}
            onBlur={saveDesDeVie}
            className="w-16 text-center rounded bg-gray-900 border border-gray-700 font-bold text-sm"
          />
          <div className="flex gap-1 mt-0.5">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-gray-400">Total</span>
              <input
                type="number"
                value={desDeVie.total}
                min={0}
                onChange={(e) =>
                  setDesDeVie((ddv) => ({
                    ...ddv,
                    total: Number(e.target.value),
                  }))
                }
                onBlur={saveDesDeVie}
                className="w-10 text-center rounded bg-gray-900 border border-gray-700 text-xs"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-gray-400">Restants</span>
              <input
                type="number"
                value={desDeVie.restants}
                min={0}
                max={desDeVie.total}
                onChange={(e) =>
                  setDesDeVie((ddv) => ({
                    ...ddv,
                    restants: Number(e.target.value),
                  }))
                }
                onBlur={saveDesDeVie}
                className="w-10 text-center rounded bg-gray-900 border border-gray-700 text-xs"
              />
            </div>
          </div>
        </div>
        {/* JdS Contre la Mort */}
        <div className="bg-gray-800 rounded p-1 flex flex-col items-center">
          <span className="text-[10px] text-gray-400">JdS Contre la Mort</span>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-green-400">Réussites</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <button
                    key={`success-${i}`}
                    onClick={() =>
                      handleJdsMortChange(
                        "reussites",
                        i === jdsMort.reussites ? i - 1 : i
                      )
                    }
                    className={`w-5 h-5 rounded-full border ${
                      jdsMort.reussites >= i
                        ? "bg-green-400 border-green-500"
                        : "bg-gray-700 border-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-red-400">Échecs</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <button
                    key={`fail-${i}`}
                    onClick={() =>
                      handleJdsMortChange(
                        "echecs",
                        i === jdsMort.echecs ? i - 1 : i
                      )
                    }
                    className={`w-5 h-5 rounded-full border ${
                      jdsMort.echecs >= i
                        ? "bg-red-400 border-red-500"
                        : "bg-gray-700 border-gray-500"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
