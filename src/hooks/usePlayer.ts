// /hooks/usePlayer.ts

import { useEffect, useState, useCallback } from "react";
import { Player } from "@/types/Player";

// Pour debounce la sauvegarde auto (évite de spam l'API)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function usePlayer(id: string) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Chargement initial
  useEffect(() => {
    fetch(`/api/joueurs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayer(data);
        setLoading(false);
      })
      .catch((e) => {
        setError("Impossible de charger la fiche.");
        setLoading(false);
      });
  }, [id]);

  // Edition/patch de la fiche en mémoire
  const updatePlayer = useCallback(
    <K extends keyof Player>(key: K, value: Player[K]) => {
      setPlayer((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    []
  );

  // Sauvegarde auto (debounced)
  const debouncedPlayer = useDebounce(player, 500);

  useEffect(() => {
    if (!debouncedPlayer) return;
    setSaving(true);
    fetch(`/api/joueurs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(debouncedPlayer),
    })
      .then(() => setSaving(false))
      .catch(() => setSaving(false));
  }, [debouncedPlayer, id]);

  return {
    player,
    setPlayer,
    loading,
    saving,
    error,
    updatePlayer,
  };
}
