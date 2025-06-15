"use client";
import { useState } from "react";
import { Campagne } from "@/types/campagne";

export function useCampagnes() {
  const [campagnes, setCampagnes] = useState<Campagne[]>([]);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function fetchCampagnes() {
    const res = await fetch("/api/campagnes");
    const data = await res.json();
    setCampagnes(data.campagnes || []);
  }

  async function createCampagne(nom: string) {
    setLoading(true);
    setErreur("");
    const res = await fetch("/api/campagnes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      fetchCampagnes();
      return true;
    } else {
      setErreur(data.error || "Erreur inconnue");
      return false;
    }
  }

  return {
    campagnes,
    loading,
    erreur,
    setErreur,
    fetchCampagnes,
    createCampagne,
  };
}
