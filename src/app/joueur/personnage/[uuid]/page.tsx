"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { usePlayer } from "@/hooks/usePlayer";
import StatsBlockSection from "@/components/player/StatsBlock";
import Competences from "@/components/player/Competences";
import JetsDeSauvegarde from "@/components/player/JetsDeSauvegarde";
import Vitals from "@/components/player/Vitals";
import SortsSection from "@/components/player/Sorts";
import EquipementSection from "@/components/player/EquipementSection";
import IdentitePerso from "@/components/player/IdentitePerso";
import CapacitesClasses from "@/components/player/CapacitesClasses";
import ListeCapacitesUtilisation from "@/components/player/ListeCapacitesUtilisation";
import PiecesSection from "@/components/player/PiecesSection";

import RGL, { WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import Maitrises from "@/components/player/MaitrisesSection";
import Armes from "@/components/player/Armes";
const ReactGridLayout = WidthProvider(RGL);

export default function PageFichePerso() {
  const params = useParams();
  const id = params.uuid as string;
  const { player, updatePlayer, loading, saving, error } = usePlayer(id);

  const defaultLayout = [
    { i: "stats", x: 0, y: 0, w: 9, h: 7, minW: 3, minH: 2 },
    { i: "saves", x: 0, y: 9, w: 9, h: 9, minW: 5, minH: 2 },
    { i: "competences", x: 0, y: 18, w: 9, h: 27, minW: 8, minH: 2 },

    { i: "vitals", x: 9, y: 0, w: 9, h: 10, minW: 8, minH: 2 },
    { i: "identite", x: 9, y: 10, w: 9, h: 14, minW: 9, minH: 2 },
    { i: "armes", x: 9, y: 24, w: 9, h: 5, minW: 7, minH: 2 },
    { i: "equipement", x: 9, y: 29, w: 9, h: 5, minW: 7, minH: 2 },
    { i: "maitrises", x: 9, y: 34, w: 9, h: 5, minW: 3, minH: 2 },
    { i: "pieces", x: 9, y: 39, w: 9, h: 5, minW: 3, minH: 2 },

    { i: "traits", x: 18, y: 0, w: 9, h: 4, minW: 6, minH: 2 },
    { i: "classes", x: 18, y: 4, w: 9, h: 16, minW: 8, minH: 2 },
    { i: "historique", x: 18, y: 20, w: 9, h: 4, minW: 6, minH: 2 },
    { i: "sorts", x: 18, y: 24, w: 9, h: 7, minW: 9, minH: 2 },
    { i: "dons", x: 18, y: 31, w: 9, h: 5, minW: 6, minH: 2 },
  ];

  const [editMode, setEditMode] = useState(false);
  const [layout, setLayout] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dnd-layout-" + id);
      if (saved) return JSON.parse(saved);
    }
    return defaultLayout;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dnd-layout-" + id, JSON.stringify(layout));
    }
  }, [layout, id]);

  if (loading)
    return <div className="p-8 text-center text-gray-300">Chargement…</div>;
  if (error || !player)
    return (
      <div className="p-8 text-center text-red-400">
        {error || "Fiche introuvable."}
      </div>
    );

  // Mapping : clé => composant fonction (pas JSX direct)
  const blockComponents = {
    vitals: () => (
      <Vitals
        player={player}
        onChange={(fields) =>
          Object.entries(fields).forEach(([k, v]) => updatePlayer(k as any, v))
        }
      />
    ),
    stats: () => (
      <StatsBlockSection
        stats={player.stats}
        onChange={(stats) => updatePlayer("stats", stats)}
      />
    ),
    saves: () => (
      <JetsDeSauvegarde
        player={player}
        onChange={(jdss) => updatePlayer("jetsDeSauvegarde", jdss)}
      />
    ),
    competences: () => (
      <Competences
        player={player}
        onChange={(competences) => updatePlayer("competences", competences)}
        onToggleToucheATout={(val) => updatePlayer("toucheATout", val)}
      />
    ),
    maitrises: () => (
      <Maitrises
        maitrises={player.maitrises}
        onChangeMaitrises={(m) => updatePlayer("maitrises", m)}
      />
    ),
    armes: () => (
      <Armes
        armes={player.armes}
        onChangeArmes={(a) => updatePlayer("armes", a)}
      />
    ),
    sorts: () => (
      <SortsSection
        sorts={player.sorts}
        onChange={(s) => updatePlayer("sorts", s)}
      />
    ),
    equipement: () => (
      <EquipementSection
        equipement={player.equipement}
        onChange={(eq) => updatePlayer("equipement", eq)}
      />
    ),
    identite: () => (
      <IdentitePerso
        player={player}
        onChange={(fields) =>
          Object.entries(fields).forEach(([k, v]) => updatePlayer(k as any, v))
        }
      />
    ),
    pieces: () => (
      <PiecesSection
        pieces={player.pieces}
        onChange={(p) => updatePlayer("pieces", p)}
      />
    ),
    classes: () => (
      <CapacitesClasses
        classes={player.classes}
        onChange={(classes) => updatePlayer("classes", classes)}
      />
    ),
    traits: () => (
      <ListeCapacitesUtilisation
        titre="Traits d'espèce"
        capacites={player.capacitesRaciales}
        onChange={(caps) => updatePlayer("capacitesRaciales", caps)}
      />
    ),
    dons: () => (
      <ListeCapacitesUtilisation
        titre="Dons"
        capacites={player.dons}
        onChange={(caps) => updatePlayer("dons", caps)}
      />
    ),
    historique: () => (
      <ListeCapacitesUtilisation
        titre="Trait historique"
        capacites={
          Array.isArray(player.capaciteHistorique)
            ? player.capaciteHistorique
            : []
        }
        onChange={(caps) => updatePlayer("capaciteHistorique", caps)}
      />
    ),
  } as const;

  type BlockKey = keyof typeof blockComponents;

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
          <div>
            <button
              className="ml-4 px-3 py-1 rounded bg-gray-800 text-orange-400 border border-orange-400 hover:bg-orange-950"
              onClick={() => setEditMode((v) => !v)}
            >
              {editMode ? "Terminer la disposition" : "✏️ Disposer les blocs"}
            </button>
            <button
              className="ml-2 px-3 py-1 rounded bg-gray-800 text-red-400 border border-red-400 hover:bg-red-950"
              onClick={() => setLayout(defaultLayout)}
            >
              Réinitialiser la disposition
            </button>
          </div>
        </div>
        {/* GRID */}
        <ReactGridLayout
          className="layout"
          layout={layout}
          cols={27}
          rowHeight={20}
          width={1500}
          isDraggable={editMode}
          isResizable={editMode}
          onLayoutChange={setLayout}
        >
          {layout.map((l) => {
            const Block = blockComponents[l.i as BlockKey];
            if (!Block) return null;
            return (
              <div
                key={l.i}
                className={`rounded-xl shadow bg-gray-900 ${
                  editMode
                    ? "border-dashed border-2 border-orange-400 hover:border-orange-300 cursor-move"
                    : ""
                }`}
                style={{ overflow: "hidden" }}
              >
                <Block />
              </div>
            );
          })}
        </ReactGridLayout>

        {/* Status de sauvegarde auto */}
        <div className="mt-8 text-center text-xs text-gray-400">
          {saving ? "Sauvegarde..." : "Modifications enregistrées"}
        </div>
      </div>
    </main>
  );
}
