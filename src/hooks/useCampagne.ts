"use client";
import { useState, useCallback, useEffect } from "react";
import { Campagne } from "@/types/campagne";

/**
 * Hook pour charger une campagne, gérer l'ajout de combats, etc.
 */
export function useCampagne(slug: string) {
  const [campagne, setCampagne] = useState<Campagne | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Charge la campagne au mount ou si slug change
  const fetchCampagne = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/campagnes/${slug}`);
      if (!res.ok) throw new Error("Campagne introuvable.");
      const data = await res.json();
      setCampagne(data);
    } catch (e: any) {
      setError(e.message || "Erreur inconnue");
      setCampagne(null);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchCampagne();
  }, [fetchCampagne]);

  // Crée un nouveau combat dans la campagne
  const createCombat = useCallback(
    async (nom: string) => {
      setError("");
      if (!nom.trim()) {
        setError("Le nom du combat est obligatoire.");
        return false;
      }
      setLoading(true);
      const res = await fetch(`/api/campagnes/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ajouterCombat",
          nomCombat: nom,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.ok) {
        await fetchCampagne();
        return true;
      } else {
        setError(data.error || "Erreur inconnue");
        return false;
      }
    },
    [slug, fetchCampagne]
  );

  return {
    campagne,
    loading,
    error,
    setError,
    fetchCampagne,
    createCombat,
  };
}
