"use client";
import { useState, useEffect } from "react";
import { DropdownEtat } from "@/components/dropdowns/DropdownEtat";
import { DropdownTypeCreature } from "@/components/dropdowns/DropdownTypeCreature";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

export function AddCreatureDrawer({
  open,
  onClose,
  onSubmit,
}: Readonly<Props>) {
  const [form, setForm] = useState({
    nom: "",
    type: "",
    pv: 1,
    ca: 10,
    vitesse: 30,
    ddSorts: 10,
    etat: "Aucun",
    concentration: false,
    initiative: 10,
    commentaire: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        nom: "",
        type: "",
        pv: 1,
        ca: 10,
        vitesse: 30,
        ddSorts: 10,
        etat: "Aucun",
        concentration: false,
        initiative: 10,
        commentaire: "",
      });
    }
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
        tabIndex={-1}
      />
      <div className="absolute top-0 right-0 w-full max-w-md bg-gray-900 shadow-lg h-full p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-4">Ajouter une créature</h2>
        <form
          className="flex flex-col gap-3 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(form);
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Nom</span>
            <input
              className="p-2 rounded bg-gray-800 text-white"
              required
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Type</span>
            <DropdownTypeCreature
              valeur={form.type}
              onChange={(type) => setForm((f) => ({ ...f, type }))}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Points de vie (PV)</span>
            <input
              className="p-2 rounded bg-gray-800 text-white"
              type="number"
              min={-99}
              value={form.pv}
              onChange={(e) =>
                setForm((f) => ({ ...f, pv: Number(e.target.value) }))
              }
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Classe d’armure (CA)</span>
            <input
              className="p-2 rounded bg-gray-800 text-white"
              type="number"
              value={form.ca}
              onChange={(e) =>
                setForm((f) => ({ ...f, ca: Number(e.target.value) }))
              }
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Vitesse</span>
            <input
              className="p-2 rounded bg-gray-800 text-white"
              type="number"
              value={form.vitesse}
              onChange={(e) =>
                setForm((f) => ({ ...f, vitesse: Number(e.target.value) }))
              }
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">DD Sorts</span>
            <input
              className="p-2 rounded bg-gray-800 text-white"
              type="number"
              value={form.ddSorts}
              onChange={(e) =>
                setForm((f) => ({ ...f, ddSorts: Number(e.target.value) }))
              }
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">État</span>
            <DropdownEtat
              valeur={form.etat}
              onChange={(etat) => setForm((f) => ({ ...f, etat }))}
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={form.concentration}
              onChange={(e) =>
                setForm((f) => ({ ...f, concentration: e.target.checked }))
              }
            />
            Concentration
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Initiative</span>
            <input
              className="p-2 rounded bg-gray-800 text-white"
              type="number"
              value={form.initiative}
              onChange={(e) =>
                setForm((f) => ({ ...f, initiative: Number(e.target.value) }))
              }
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Commentaire</span>
            <textarea
              className="p-2 rounded bg-gray-800 text-white"
              rows={2}
              value={form.commentaire}
              onChange={(e) =>
                setForm((f) => ({ ...f, commentaire: e.target.value }))
              }
            />
          </label>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="flex-1 bg-orange-600 rounded px-4 py-2 font-semibold hover:bg-orange-700"
              onClick={onClose}
            >
              Ajouter
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-700 rounded px-4 py-2 font-semibold hover:bg-gray-600"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
