"use client";

import { useParams, useRouter } from "next/navigation";
import { useLockToMJ } from "@/lib/useLockToMJ";
import { useCampagne } from "@/hooks/useCampagne";
import SectionCombatList from "@/components/campagnes/SectionCombatList";
import AddCombatForm from "@/components/campagnes/AddCombatForm";
import { Combat } from "@/types/combat";

export default function PageCampagne() {
  useLockToMJ();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  // Hook factorisé pour la campagne
  const { campagne, loading, error, setError, fetchCampagne, createCombat } =
    useCampagne(slug);

  if (loading) {
    return <div className="text-center text-lg mt-10">Chargement…</div>;
  }

  if (!campagne) {
    return (
      <div className="text-center text-lg mt-10">Campagne introuvable.</div>
    );
  }

  // Raccourcis
  const combatsEnCours = campagne.combats?.enCours || [];
  const combatsPreparation = campagne.combats?.preparation || [];
  const combatsArchive = campagne.combats?.archive || [];

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-900 text-white px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 select-none text-center">
        {campagne.nom}
      </h1>

      {/* Combats en cours */}
      <section className="w-full max-w-2xl mb-10">
        <h2 className="text-xl font-semibold mb-2">Combats en cours</h2>
        {combatsEnCours.length === 0 ? (
          <div className="text-gray-400 mb-4">Aucun combat en cours.</div>
        ) : (
          <SectionCombatList
            combats={combatsEnCours as Combat[]}
            color="blue"
            btnLabel="Gérer ce combat"
            onClickCombat={(id) => router.push(`/maitre/${slug}/combat/${id}`)}
          />
        )}
      </section>

      {/* Combats en préparation */}
      <section className="w-full max-w-2xl mb-10">
        <h2 className="text-xl font-semibold mb-2">Combats en préparation</h2>
        <div className="flex gap-2 mb-4">
          <AddCombatForm
            value=""
            error={error}
            loading={false}
            onSubmit={async (nom) => {
              setError("");
              await createCombat(nom);
              fetchCampagne();
            }}
          />
        </div>
        {combatsPreparation.length === 0 ? (
          <div className="text-gray-400 mt-2">Aucun combat en préparation.</div>
        ) : (
          <SectionCombatList
            combats={combatsPreparation as Combat[]}
            color="yellow"
            btnLabel="Préparer ce combat"
            onClickCombat={(id) => router.push(`/maitre/${slug}/combat/${id}`)}
          />
        )}
      </section>

      {/* Combats archivés */}
      <section className="w-full max-w-2xl mb-10">
        <h2 className="text-xl font-semibold mb-2">Combats archivés</h2>
        {combatsArchive.length === 0 ? (
          <div className="text-gray-400">Aucun combat archivé.</div>
        ) : (
          <SectionCombatList
            combats={combatsArchive as Combat[]}
            color="gray"
            btnLabel="Voir le combat"
            onClickCombat={(id) => router.push(`/maitre/${slug}/combat/${id}`)}
          />
        )}
      </section>
    </main>
  );
}
