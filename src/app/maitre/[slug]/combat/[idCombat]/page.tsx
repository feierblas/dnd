// pages/maitre/[slug]/combat/[idCombat]/page.tsx
"use client";
import { useLockToMJ } from "@/lib/useLockToMJ";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCombat } from "@/hooks/useCombat";
import { AddCreatureDrawer } from "@/components/combat/AddCreatureDrawer";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { DamageDrawer } from "@/components/campagnes/DamageDrawer";
import { ResVulnModal } from "@/components/combat/ResVulnModal";
import { CombatTable } from "@/components/combat/CombatTable";
import { CombatHeaderActions } from "@/components/combat/CombatHeaderActions";
import { CombatHistory } from "@/components/combat/CombatHistory";
import { toast } from "react-hot-toast";
import { HealModal } from "@/components/modals/HealModal";

export default function PageCombat() {
  useLockToMJ();
  const params = useParams();
  const router = useRouter();
  const { slug, idCombat } = params as { slug: string; idCombat: string };

  const {
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
  } = useCombat(slug, idCombat);

  // UI state
  const [openDrawer, setOpenDrawer] = useState(false);
  const [supprTarget, setSupprTarget] = useState<string | null>(null);
  const [healTarget, setHealTarget] = useState<string | null>(null);
  const [damageTarget, setDamageTarget] = useState<string | null>(null);
  const [resVulnTarget, setResVulnTarget] = useState<any | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    fetchCombat();
    // eslint-disable-next-line
  }, [slug, idCombat]);

  if (loading) {
    return <div className="text-center text-lg mt-10">Chargement…</div>;
  }
  if (!combat) {
    return <div className="text-center text-lg mt-10">Combat introuvable.</div>;
  }

  // Split vivants/morts
  const vivants = combat.creatures
    .filter((c) => c.pv >= 0)
    .sort((a, b) => b.initiative - a.initiative);
  const morts = combat.creatures
    .filter((c) => c.pv < 0)
    .sort((a, b) => b.initiative - a.initiative);

  // QR code logic
  const host =
    process.env.NEXT_PUBLIC_HOST_IP &&
    process.env.NEXT_PUBLIC_HOST_IP !== "localhost"
      ? process.env.NEXT_PUBLIC_HOST_IP
      : typeof window !== "undefined"
      ? window.location.hostname
      : "localhost";
  const urlJoueur = `http://${host}:3000/joueur/${slug}/combat/${idCombat}`;

  return (
    <main className="min-h-screen flex flex-col items-center bg-gray-900 text-white px-4 py-8">
      <h1 className="text-3xl font-bold select-none mb-2">{combat.nom}</h1>
      <CombatHeaderActions
        etatCombat={etatCombat}
        combat={combat}
        onStart={() => changeEtatCombat("startCombat")}
        onArchive={() => changeEtatCombat("archiveCombat")}
        onDelete={async () => {
          if (!confirm("Supprimer définitivement ce combat ?")) return;
          await deleteCombat();
          toast.success("Combat supprimé !");
          router.push(`/maitre/${slug}`);
        }}
        onTogglePublic={async () => {
          setPublishing(true);
          await togglePublic(!combat.public);
          setPublishing(false);
        }}
        onShowQR={() => setShowQR((b) => !b)}
        showQR={showQR}
        urlJoueur={urlJoueur}
        publishing={publishing}
        setShowQR={setShowQR}
      />

      <div className="flex gap-4">
        {etatCombat === "enCours" && (
          <button
            className="px-4 py-2 bg-green-700 rounded-xl hover:bg-green-800 font-semibold text-sm mb-4"
            onClick={async () => {
              const res = await fetch(
                `/api/campagnes/${slug}/combat/${idCombat}`,
                {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ action: "nextTurn" }),
                }
              );
              if (res.ok) {
                toast.success("Tour suivant !");
                fetchCombat();
              } else {
                toast.error("Aucun combattant valide");
              }
            }}
            title="Passer au tour suivant"
          >
            Tour suivant
          </button>
        )}
        {etatCombat !== "archive" && (
          <button
            className="px-4 py-2 bg-orange-600 rounded-xl hover:bg-orange-700 font-semibold text-sm mb-4"
            onClick={() => setOpenDrawer(true)}
          >
            + Ajouter une créature
          </button>
        )}
      </div>

      <AddCreatureDrawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
        onSubmit={addCreature}
        disabled={etatCombat === "archive"}
      />

      <CombatTable
        creatures={[...vivants, ...morts]}
        etatCombat={etatCombat}
        onEdit={edit}
        onHeal={(id) => setHealTarget(id)}
        onDamage={(id) => setDamageTarget(id)}
        onDelete={(id) => setSupprTarget(id)}
        onResVuln={(c) => setResVulnTarget(c)}
      />

      <div className="mt-6 text-sm text-gray-400">
        <span className="font-bold capitalize">{etatCombat}</span> –
        {etatCombat === "preparation"
          ? " préparez votre table avant de démarrer."
          : etatCombat === "enCours"
          ? " combat en cours, toutes les actions sont possibles."
          : " combat archivé, lecture seule."}
      </div>

      {/* Historique et undo */}
      {etatCombat !== "preparation" && (
        <CombatHistory
          historique={combat.historique}
          showUndo={etatCombat === "enCours"}
          onUndo={undo}
        />
      )}

      {/* Confirm suppression créature */}
      <ConfirmModal
        open={!!supprTarget}
        title="Supprimer cette créature ?"
        message="Cette action est définitive."
        onCancel={() => setSupprTarget(null)}
        onConfirm={() => {
          if (supprTarget) deleteCreature(supprTarget);
          setSupprTarget(null);
        }}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
      />
      {/* Heal modal */}
      <HealModal
        open={!!healTarget}
        onClose={() => setHealTarget(null)}
        onSubmit={(val) => {
          if (healTarget) heal(healTarget, val);
          setHealTarget(null);
        }}
      />
      {/* Damage drawer */}
      <DamageDrawer
        open={!!damageTarget}
        onClose={() => setDamageTarget(null)}
        onSubmit={(dmgObj) => {
          if (damageTarget) damage(damageTarget, dmgObj);
          setDamageTarget(null);
        }}
      />
      {/* Résistance/vulnérabilité */}
      <ResVulnModal
        open={!!resVulnTarget}
        resistance={resVulnTarget?.resistance || []}
        vulnerabilite={resVulnTarget?.vulnerabilite || []}
        onClose={() => setResVulnTarget(null)}
        onSave={(res, vuln) => {
          if (resVulnTarget) updateResVuln(resVulnTarget.id, res, vuln);
          setResVulnTarget(null);
        }}
      />
    </main>
  );
}
