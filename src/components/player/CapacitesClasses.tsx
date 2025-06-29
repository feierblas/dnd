import { Classe, Capacite } from "@/types/Player";
import { useState } from "react";
import CapaciteModalVoir from "@/components/modals/CapaciteModalVoir";
import CapaciteModalAdd from "@/components/modals/CapaciteModalAdd";
import ListeCapacitesUtilisation from "./ListeCapacitesUtilisation";

type Props = {
  classes: Classe[];
  onChange: (classes: Classe[]) => void;
};

function ClasseLine({
  classe,
  index,
  onUpdate,
  onRemove,
  onChangeCapacites,
}: {
  classe: Classe;
  index: number;
  onUpdate: (patch: Partial<Classe>) => void;
  onRemove: () => void;
  onChangeCapacites: (caps: Capacite[]) => void;
}) {
  // Edition différée (local)
  const [niveauEdit, setNiveauEdit] = useState(classe.niveau);
  const [sousClasseEdit, setSousClasseEdit] = useState(classe.sousClasse || "");

  return (
    <div className="mb-6 bg-gray-800 rounded-xl p-3">
      <div className="flex gap-4 items-center mb-2">
        <span className="font-semibold text-orange-300">
          {classe.nom} (Niv. {classe.niveau}
          {classe.sousClasse ? ", " + classe.sousClasse : ""})
        </span>
        <button
          className="text-red-500 hover:text-red-700 text-xs"
          onClick={onRemove}
          title="Supprimer cette classe"
        >
          ✕
        </button>
        {/* Edition différée niveau */}
        <input
          type="number"
          min={1}
          value={niveauEdit}
          onChange={(e) => setNiveauEdit(Number(e.target.value))}
          onBlur={() => {
            if (classe.niveau !== niveauEdit) onUpdate({ niveau: niveauEdit });
          }}
          className="w-16 rounded bg-gray-900 border-gray-700 px-2 py-1 ml-4"
          title="Niveau"
        />
        {/* Edition différée sous-classe */}
        <input
          type="text"
          value={sousClasseEdit}
          onChange={(e) => setSousClasseEdit(e.target.value)}
          onBlur={() => {
            if ((classe.sousClasse || "") !== sousClasseEdit)
              onUpdate({ sousClasse: sousClasseEdit });
          }}
          className="w-40 rounded bg-gray-900 border-gray-700 px-2 py-1"
          placeholder="Sous-classe"
          title="Sous-classe"
        />
      </div>
      <div>
        <ListeCapacitesUtilisation
          titre="Capacités de classe"
          capacites={classe.capacites || []}
          onChange={onChangeCapacites}
        />
      </div>
    </div>
  );
}

export default function CapacitesClasses({ classes, onChange }: Props) {
  // Edition classe
  const [nouvelleClasse, setNouvelleClasse] = useState<{
    nom: string;
    niveau: number;
    sousClasse?: string;
  }>({
    nom: "",
    niveau: 1,
    sousClasse: "",
  });

  // Modal voir/ajout capacité
  const [modalVoir, setModalVoir] = useState<{
    classeIdx: number;
    capIdx: number;
  } | null>(null);
  const [modalAdd, setModalAdd] = useState<number | null>(null); // index de la classe

  function addClasse() {
    if (!nouvelleClasse.nom.trim() || nouvelleClasse.niveau < 1) return;
    onChange([...classes, { ...nouvelleClasse, capacites: [] }]);
    setNouvelleClasse({ nom: "", niveau: 1, sousClasse: "" });
  }

  function updateClasse(i: number, patch: Partial<Classe>) {
    onChange(classes.map((c, idx) => (i === idx ? { ...c, ...patch } : c)));
  }

  function removeClasse(i: number) {
    onChange(classes.filter((_, idx) => idx !== i));
  }

  function addCapacite(classIdx: number, cap: Capacite) {
    const c = classes[classIdx];
    if (!c) return;
    const capacites = [...(c.capacites || []), cap];
    updateClasse(classIdx, { capacites });
  }

  return (
    <section className="bg-gray-900 rounded-xl shadow p-3 w-full max-w-5xl">
      <h2 className="text-xl font-semibold mb-4 text-orange-400">
        Capacités de classe
      </h2>
      <div className="mb-6 flex gap-3 items-end flex-wrap">
        <input
          type="text"
          placeholder="Nom de classe"
          className="rounded bg-gray-800 border-gray-700 px-2 py-1"
          value={nouvelleClasse.nom}
          onChange={(e) =>
            setNouvelleClasse((nc) => ({ ...nc, nom: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Niveau"
          min={1}
          className="w-20 rounded bg-gray-800 border-gray-700 px-2 py-1"
          value={nouvelleClasse.niveau}
          onChange={(e) =>
            setNouvelleClasse((nc) => ({
              ...nc,
              niveau: Number(e.target.value),
            }))
          }
        />
        <input
          type="text"
          placeholder="Sous-classe (option)"
          className="rounded bg-gray-800 border-gray-700 px-2 py-1"
          value={nouvelleClasse.sousClasse}
          onChange={(e) =>
            setNouvelleClasse((nc) => ({ ...nc, sousClasse: e.target.value }))
          }
        />
        <button
          className="bg-green-700 hover:bg-green-800 text-white px-3 py-1 rounded"
          onClick={addClasse}
        >
          + Ajouter classe
        </button>
      </div>
      {classes.map((classe, i) => (
        <ClasseLine
          key={i}
          classe={classe}
          index={i}
          onUpdate={(patch) => updateClasse(i, patch)}
          onRemove={() => removeClasse(i)}
          onChangeCapacites={(caps) =>
            onChange(
              classes.map((c, idx) =>
                idx === i ? { ...c, capacites: caps } : c
              )
            )
          }
        />
      ))}

      {/* Modals éventuels */}
      {modalVoir && (
        <CapaciteModalVoir
          capacite={
            classes[modalVoir.classeIdx]?.capacites?.[modalVoir.capIdx] ?? {
              nom: "",
              description: "",
            }
          }
          onClose={() => setModalVoir(null)}
        />
      )}
      {modalAdd !== null && (
        <CapaciteModalAdd
          onAdd={(cap) => {
            addCapacite(modalAdd, cap);
            setModalAdd(null);
          }}
          onClose={() => setModalAdd(null)}
        />
      )}
    </section>
  );
}
