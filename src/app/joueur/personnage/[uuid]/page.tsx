// /pages/joueur/[uuid]/page.tsx

"use client";
import { useParams } from "next/navigation";
import { usePlayer } from "@/hooks/usePlayer";
import StatsBlockSection from "@/components/player/StatsBlock";
import Competences from "@/components/player/Competences";
import JetsDeSauvegarde from "@/components/player/JetsDeSauvegarde";
import Vitals from "@/components/player/Vitals";
import SortsSection from "@/components/player/Sorts";
import Equipement from "@/components/player/Equipement";
import IdentitePerso from "@/components/player/IdentitePerso";
import MaitrisesEtArmes from "@/components/player/MaitrisesEtArmes";
import CapacitesClasses from "@/components/player/CapacitesClasses";
import TraitsEspece from "@/components/player/ListeCapacitesUtilisation";
import ListeCapacites from "@/components/player/ListeCapacitesUtilisation";
import ListeTraitsEspece from "@/components/player/ListeTraitsEspece";
import EquipementSection from "@/components/player/EquipementSection";
import PiecesSection from "@/components/player/PiecesSection";
import CapaciteHistoriqueSection from "@/components/player/CapaciteHistoriqueSection";
import ListeCapacitesUtilisation from "@/components/player/ListeCapacitesUtilisation";

export default function PageFichePerso() {
  const params = useParams();
  const id = params.uuid as string;
  const { player, updatePlayer, loading, saving, error } = usePlayer(id);

  if (loading)
    return <div className="p-8 text-center text-gray-300">Chargement…</div>;
  if (error || !player)
    return (
      <div className="p-8 text-center text-red-400">
        {error || "Fiche introuvable."}
      </div>
    );

  return (
    <main className="min-h-screen w-full bg-gray-950 text-white flex flex-col items-center py-8 px-2">
      <div className="w-full mx-auto px-2 md:px-8">
        {/* Header général */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-orange-400">
              {player.name}
            </h1>
            <div className="text-gray-400 mt-2">
              {player.race.nom} —{" "}
              {player.classes
                .map(
                  (c) =>
                    `${c.nom} (niv. ${c.niveau}${
                      c.sousClasse ? ", " + c.sousClasse : ""
                    })`
                )
                .join(" / ")}
            </div>
          </div>
        </div>

        {/* Grid principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <div>
            <StatsBlockSection
              stats={player.stats}
              onChange={(stats) => updatePlayer("stats", stats)}
            />
            <JetsDeSauvegarde
              player={player}
              onChange={(jdss) => updatePlayer("jetsDeSauvegarde", jdss)}
            />
            <Competences
              player={player}
              onChange={(competences) =>
                updatePlayer("competences", competences)
              }
              onToggleToucheATout={(val) => updatePlayer("toucheATout", val)}
            />
            <MaitrisesEtArmes
              maitrises={player.maitrises}
              armes={player.armes}
              onChangeMaitrises={(m) => updatePlayer("maitrises", m)}
              onChangeArmes={(a) => updatePlayer("armes", a)}
            />
          </div>
          <div>
            <Vitals
              player={player}
              onChange={(fields) =>
                Object.entries(fields).forEach(([k, v]) =>
                  updatePlayer(k as any, v)
                )
              }
            />
            <EquipementSection
              equipement={player.equipement}
              onChange={(eq) => updatePlayer("equipement", eq)}
            />
            <IdentitePerso
              player={player}
              onChange={(fields) =>
                Object.entries(fields).forEach(([k, v]) =>
                  updatePlayer(k as any, v)
                )
              }
            />
            {/* Pièces */}
            <PiecesSection
              pieces={player.pieces}
              onChange={(p) => updatePlayer("pieces", p)}
            />
          </div>
          <div>
            <SortsSection
              sorts={player.sorts}
              onChange={(s) => updatePlayer("sorts", s)}
            />
            <CapacitesClasses
              classes={player.classes}
              onChange={(classes) => updatePlayer("classes", classes)}
            />
            <ListeCapacitesUtilisation
              titre="Traits d'espèce"
              capacites={player.capacitesRaciales}
              onChange={(caps) => updatePlayer("capacitesRaciales", caps)}
            />
            <ListeCapacitesUtilisation
              titre="Dons"
              capacites={player.dons}
              onChange={(caps) => updatePlayer("dons", caps)}
            />
            <ListeCapacitesUtilisation
              titre="Historique"
              capacites={player.capaciteHistorique}
              onChange={(caps) => updatePlayer("capaciteHistorique", caps)}
            />
          </div>
        </div>
        {/* Status de sauvegarde auto */}
        <div className="mt-8 text-center text-xs text-gray-400">
          {saving ? "Sauvegarde..." : "Modifications enregistrées"}
        </div>
      </div>
    </main>
  );
}
