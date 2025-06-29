import { Player } from "@/types/Player";
import { useState, useEffect, useRef, useLayoutEffect } from "react";

// Hook pour textarea auto-height
function useAutosizeTextArea(value: string) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return ref;
}

type Props = {
  player: Player;
  onChange: (fields: Partial<Player>) => void;
};

export default function IdentitePerso({ player, onChange }: Props) {
  // CHAMPS LOCAUX + DIRTY
  // Infos racine
  const [race, setRace] = useState(player.race.nom);
  const [dirtyRace, setDirtyRace] = useState(false);
  const [historique, setHistorique] = useState(player.historique ?? "");
  const [dirtyHistorique, setDirtyHistorique] = useState(false);
  const [alignement, setAlignement] = useState(player.alignement ?? "");
  const [dirtyAlignement, setDirtyAlignement] = useState(false);

  // Apparence
  const [age, setAge] = useState(player.apparence.age ?? "");
  const [dirtyAge, setDirtyAge] = useState(false);
  const [taille, setTaille] = useState(player.apparence.taille ?? "");
  const [dirtyTaille, setDirtyTaille] = useState(false);
  const [poids, setPoids] = useState(player.apparence.poids ?? "");
  const [dirtyPoids, setDirtyPoids] = useState(false);
  const [yeux, setYeux] = useState(player.apparence.couleurYeux ?? "");
  const [dirtyYeux, setDirtyYeux] = useState(false);
  const [desc, setDesc] = useState(player.apparence.description ?? "");
  const [dirtyDesc, setDirtyDesc] = useState(false);

  // Textareas
  const [histoire, setHistoire] = useState(player.histoire ?? "");
  const [dirtyHistoire, setDirtyHistoire] = useState(false);
  const [personnalite, setPersonnalite] = useState(player.personnalite ?? "");
  const [dirtyPersonnalite, setDirtyPersonnalite] = useState(false);

  // Sync : si parent change (nouveau player), remet à jour tous les non-dirty
  useEffect(() => {
    if (!dirtyRace) setRace(player.race.nom);
    if (!dirtyHistorique) setHistorique(player.historique ?? "");
    if (!dirtyAlignement) setAlignement(player.alignement ?? "");
    if (!dirtyAge) setAge(player.apparence.age ?? "");
    if (!dirtyTaille) setTaille(player.apparence.taille ?? "");
    if (!dirtyPoids) setPoids(player.apparence.poids ?? "");
    if (!dirtyYeux) setYeux(player.apparence.couleurYeux ?? "");
    if (!dirtyDesc) setDesc(player.apparence.description ?? "");
    if (!dirtyHistoire) setHistoire(player.histoire ?? "");
    if (!dirtyPersonnalite) setPersonnalite(player.personnalite ?? "");
    // eslint-disable-next-line
  }, [player]);

  // Refs auto-resize pour textarea
  const descRef = useAutosizeTextArea(desc);
  const histRef = useAutosizeTextArea(histoire);
  const persRef = useAutosizeTextArea(personnalite);

  // Handle blur pour sync parent
  function pushRace() {
    setDirtyRace(false);
    onChange({ race: { ...player.race, nom: race } });
  }
  function pushHistorique() {
    setDirtyHistorique(false);
    onChange({ historique });
  }
  function pushAlignement() {
    setDirtyAlignement(false);
    onChange({ alignement });
  }
  function pushAge() {
    setDirtyAge(false);
    onChange({ apparence: { ...player.apparence, age } });
  }
  function pushTaille() {
    setDirtyTaille(false);
    onChange({ apparence: { ...player.apparence, taille } });
  }
  function pushPoids() {
    setDirtyPoids(false);
    onChange({ apparence: { ...player.apparence, poids } });
  }
  function pushYeux() {
    setDirtyYeux(false);
    onChange({ apparence: { ...player.apparence, couleurYeux: yeux } });
  }
  function pushDesc() {
    setDirtyDesc(false);
    onChange({ apparence: { ...player.apparence, description: desc } });
  }
  function pushHistoire() {
    setDirtyHistoire(false);
    onChange({ histoire });
  }
  function pushPersonnalite() {
    setDirtyPersonnalite(false);
    onChange({ personnalite });
  }

  // Ajout langues (instantané)
  function addLangue(val: string) {
    if (val && !player.langues.includes(val)) {
      onChange({ langues: [...player.langues, val] });
    }
  }

  return (
    <section className="bg-gray-900 rounded-xl shadow p-3 w-full max-w-5xl">
      <h2 className="text-xl font-semibold mb-2 text-orange-400">
        Identité et histoire
      </h2>
      <div className="flex flex-wrap gap-4 mb-2">
        <div>
          <label className="block text-xs text-gray-400 mb-0.5">Race</label>
          <input
            type="text"
            value={race}
            onChange={(e) => {
              setRace(e.target.value);
              setDirtyRace(true);
            }}
            onBlur={pushRace}
            className="rounded bg-gray-800 border-gray-700 px-2 py-1 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-0.5">
            Historique
          </label>
          <input
            type="text"
            value={historique}
            onChange={(e) => {
              setHistorique(e.target.value);
              setDirtyHistorique(true);
            }}
            onBlur={pushHistorique}
            className="rounded bg-gray-800 border-gray-700 px-2 py-1 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-0.5">
            Alignement
          </label>
          <input
            type="text"
            value={alignement}
            onChange={(e) => {
              setAlignement(e.target.value);
              setDirtyAlignement(true);
            }}
            onBlur={pushAlignement}
            className="rounded bg-gray-800 border-gray-700 px-2 py-1 text-xs"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-2">
        <div>
          <label className="block text-xs text-gray-400 mb-0.5">Âge</label>
          <input
            type="number"
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              setDirtyAge(true);
            }}
            onBlur={pushAge}
            className="w-20 rounded bg-gray-800 border-gray-700 px-2 py-1 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-0.5">Taille</label>
          <input
            type="text"
            value={taille}
            onChange={(e) => {
              setTaille(e.target.value);
              setDirtyTaille(true);
            }}
            onBlur={pushTaille}
            className="w-20 rounded bg-gray-800 border-gray-700 px-2 py-1 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-0.5">Poids</label>
          <input
            type="text"
            value={poids}
            onChange={(e) => {
              setPoids(e.target.value);
              setDirtyPoids(true);
            }}
            onBlur={pushPoids}
            className="w-20 rounded bg-gray-800 border-gray-700 px-2 py-1 text-xs"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-0.5">Yeux</label>
          <input
            type="text"
            value={yeux}
            onChange={(e) => {
              setYeux(e.target.value);
              setDirtyYeux(true);
            }}
            onBlur={pushYeux}
            className="w-24 rounded bg-gray-800 border-gray-700 px-2 py-1 text-xs"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-0.5">
          Description physique
        </label>
        <textarea
          ref={descRef}
          value={desc}
          onChange={(e) => {
            setDesc(e.target.value);
            setDirtyDesc(true);
          }}
          onBlur={pushDesc}
          className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1 mb-2 resize-y text-xs"
          rows={1}
          placeholder="Description physique"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-0.5">Histoire</label>
        <textarea
          ref={histRef}
          value={histoire}
          onChange={(e) => {
            setHistoire(e.target.value);
            setDirtyHistoire(true);
          }}
          onBlur={pushHistoire}
          className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1 mb-2 resize-y text-xs"
          rows={1}
          placeholder="Histoire du personnage"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-400 mb-0.5">
          Personnalité
        </label>
        <textarea
          ref={persRef}
          value={personnalite}
          onChange={(e) => {
            setPersonnalite(e.target.value);
            setDirtyPersonnalite(true);
          }}
          onBlur={pushPersonnalite}
          className="w-full rounded bg-gray-800 border-gray-700 px-2 py-1 resize-y text-xs"
          rows={1}
          placeholder="Personnalité, traits, motivations"
        />
      </div>
      <div className="mt-2">
        <label className="block text-xs text-gray-400 mb-1">Langues</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {player.langues.map((langue, i) => (
            <div
              key={i}
              className="flex items-center gap-1 bg-gray-800 rounded px-2 py-1"
            >
              <span>{langue}</span>
              <button
                className="text-red-400 hover:text-red-700 text-xs"
                onClick={() =>
                  onChange({
                    langues: player.langues.filter((_, j) => j !== i),
                  })
                }
                title="Supprimer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Nouvelle langue"
          className="rounded bg-gray-800 border-gray-700 px-2 py-1 w-48 mr-2 text-xs"
          onKeyDown={(e) => {
            const value = (e.target as HTMLInputElement).value.trim();
            if (e.key === "Enter" && value) {
              addLangue(value);
              (e.target as HTMLInputElement).value = "";
            }
          }}
        />
        <span className="text-gray-400 text-xs">
          (Appuyez sur Entrée pour ajouter)
        </span>
      </div>
    </section>
  );
}
