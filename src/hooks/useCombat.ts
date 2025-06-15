// hooks/useCombat.ts
"use client";
import { useState, useCallback } from "react";
import { Combat, EditableField } from "@/types/combat";

export function useCombat(slug: string, idCombat: string) {
  const [combat, setCombat] = useState<Combat | null>(null);
  const [etatCombat, setEtatCombat] = useState<
    "preparation" | "enCours" | "archive"
  >("preparation");
  const [loading, setLoading] = useState(true);

  // Fetch the combat
  const fetchCombat = useCallback(async () => {
    const res = await fetch(`/api/campagnes/${slug}`);
    const campagne = await res.json();
    let found: Combat | null = null;
    let etat: "preparation" | "enCours" | "archive" = "preparation";
    for (const type of ["enCours", "preparation", "archive"] as const) {
      if (campagne.combats?.[type]) {
        const temp = campagne.combats[type].find(
          (c: Combat) => c.id === idCombat
        );
        if (temp) {
          found = temp;
          etat = type;
          break;
        }
      }
    }
    setCombat(found || null);
    setEtatCombat(etat);
    setLoading(false);
  }, [slug, idCombat]);

  // Action handlers (edit, heal, damage, etc.)
  const patch = useCallback(
    async (body: object) => {
      return fetch(`/api/campagnes/${slug}/combat/${idCombat}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    [slug, idCombat]
  );

  const togglePublic = useCallback(
    async (value: boolean) => {
      await patch({ action: "setPublic", value });
      fetchCombat();
    },
    [patch, fetchCombat]
  );

  const edit = useCallback(
    async (creatureId: string, field: EditableField, value: any) => {
      await patch({ action: "updateChamp", creatureId, field, value });
      fetchCombat();
    },
    [patch, fetchCombat]
  );

  const addCreature = useCallback(
    async (data: any) => {
      await patch({ action: "addCreature", ...data });
      fetchCombat();
    },
    [patch, fetchCombat]
  );

  const deleteCreature = useCallback(
    async (creatureId: string) => {
      await patch({ action: "deleteCreature", creatureId });
      fetchCombat();
    },
    [patch, fetchCombat]
  );

  const heal = useCallback(
    async (creatureId: string, value: number) => {
      await patch({ action: "heal", creatureId, value });
      fetchCombat();
    },
    [patch, fetchCombat]
  );

  const damage = useCallback(
    async (creatureId: string, values: Record<string, number>) => {
      await patch({ action: "damage", creatureId, values });
      fetchCombat();
    },
    [patch, fetchCombat]
  );

  const updateResVuln = useCallback(
    async (
      creatureId: string,
      resistance: string[],
      vulnerabilite: string[]
    ) => {
      await patch({
        action: "updateResVuln",
        creatureId,
        resistance,
        vulnerabilite,
      });
      fetchCombat();
    },
    [patch, fetchCombat]
  );

  const undo = useCallback(async () => {
    await patch({ action: "undo" });
    fetchCombat();
  }, [patch, fetchCombat]);

  const changeEtatCombat = useCallback(
    async (action: "startCombat" | "archiveCombat") => {
      await patch({ action });
      fetchCombat();
    },
    [patch, fetchCombat]
  );

  const deleteCombat = useCallback(async () => {
    await patch({ action: "deleteCombat" });
    // fetchCombat(); // La page redirige (pas besoin de refresh ici)
  }, [patch]);

  return {
    combat,
    etatCombat,
    loading,
    fetchCombat,
    togglePublic,
    edit,
    addCreature,
    deleteCreature,
    heal,
    damage,
    updateResVuln,
    undo,
    changeEtatCombat,
    deleteCombat,
  };
}
