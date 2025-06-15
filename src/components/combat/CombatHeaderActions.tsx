// components/combat/CombatHeaderActions.tsx
import { QRCodeSVG } from "qrcode.react";

export function CombatHeaderActions({
  etatCombat,
  combat,
  onStart,
  onArchive,
  onDelete,
  onTogglePublic,
  onShowQR,
  showQR,
  urlJoueur,
  publishing,
  setShowQR,
}: {
  etatCombat: "preparation" | "enCours" | "archive";
  combat: any;
  onStart: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onTogglePublic: () => void;
  onShowQR: () => void;
  showQR: boolean;
  urlJoueur: string;
  publishing: boolean;
  setShowQR: (b: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 mb-4">
      {etatCombat === "preparation" && (
        <button
          className="px-4 py-2 bg-green-600 rounded-xl hover:bg-green-700 font-semibold text-sm"
          onClick={onStart}
        >
          DÉBUTER LE COMBAT
        </button>
      )}
      {etatCombat === "enCours" && (
        <button
          className="px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 font-semibold text-sm"
          onClick={onArchive}
        >
          ARCHIVER LE COMBAT
        </button>
      )}
      <button
        className="px-4 py-2 bg-red-600 rounded-xl hover:bg-red-700 font-semibold text-sm"
        onClick={onDelete}
      >
        Supprimer le combat
      </button>
      {etatCombat === "enCours" && (
        <>
          <button
            onClick={onTogglePublic}
            disabled={publishing}
            // className="px-4 py-2 bg-green-600 rounded-xl hover:bg-green-700 font-semibold text-sm"
            className={
              "px-4 py-2 rounded-xl font-semibold transition text-sm " +
              (combat?.public
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-600 hover:bg-gray-700")
            }
          >
            {combat?.public ? "Combat PUBLIC" : "Combat PRIVÉ"}
          </button>
          {combat?.public && (
            <>
              <button
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 font-semibold text-sm"
                onClick={() => setShowQR((b) => !b)}
              >
                {showQR ? "Cacher QR code" : "QR code mode Joueur"}
              </button>
              {showQR && (
                <div className="flex flex-col items-center mt-2">
                  <QRCodeSVG
                    value={urlJoueur}
                    size={192}
                    bgColor="#222"
                    fgColor="#ffbe7b"
                  />
                  <div className="mt-2 text-sm text-orange-200 select-all">
                    {urlJoueur}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Les joueurs doivent être sur le même réseau WiFi.
                    <br />
                    Scannez le QR code ou ouvrez l’URL.
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
