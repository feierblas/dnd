import { useEffect, useState, useCallback } from "react";
import { Player } from "@/types/Player";

// Debounce pour sauvegarde auto
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

  // Chargement initial (une seule fois à l'id)
  useEffect(() => {
    setLoading(true);
    fetch(`/api/joueurs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setPlayer(data);
        setError(null);
      })
      .catch(() => {
        setPlayer(null);
        setError("Impossible de charger la fiche.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // PATCH en mémoire
  const updatePlayer = useCallback(
    <K extends keyof Player>(key: K, value: Player[K]) => {
      setPlayer((prev) => (prev ? { ...prev, [key]: value } : prev));
    },
    []
  );

  // Sauvegarde auto (debounced), uniquement si player est défini et qu’on a fini de charger
  const debouncedPlayer = useDebounce(player, 500);

  useEffect(() => {
    if (!debouncedPlayer || loading) return; // PROTECTION SUPPLÉMENTAIRE
    setSaving(true);
    fetch(`/api/joueurs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(debouncedPlayer),
    })
      .then(() => setSaving(false))
      .catch(() => setSaving(false));
    // NE PAS mettre [loading] dans les dépendances, sinon boucle.
    // Juste [debouncedPlayer, id] !
    // Surtout PAS [player] ou [saving].
  }, [debouncedPlayer, id, loading]);

  return {
    player,
    setPlayer,
    loading,
    saving,
    error,
    updatePlayer,
  };
}
