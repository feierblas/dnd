"use client";
type Props = {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

export function ConfirmModal({
  open,
  title = "Confirmation",
  message = "",
  onCancel,
  onConfirm,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
}: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-xl p-8 shadow-lg flex flex-col gap-4 min-w-[300px]">
        {title && (
          <div className="text-lg font-semibold text-center mb-2">{title}</div>
        )}
        {message && (
          <div className="text-gray-400 text-center text-sm mb-4">
            {message}
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 font-semibold"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-700 rounded hover:bg-red-800 font-semibold"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
