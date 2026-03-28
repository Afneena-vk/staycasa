

import { FC, useEffect } from "react";

type ConfirmModalProps = {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmModal: FC<ConfirmModalProps> = ({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 transition-opacity"
        onClick={onCancel}
      />

      {/* MODAL */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-7 transform transition-all duration-200 scale-100 opacity-100">
        
        {/* TITLE */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h2>

        {/* MESSAGE */}
        <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
          {message}
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          
          {/* CANCEL */}
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>

          {/* CONFIRM */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-blue-900 text-white font-medium hover:bg-blue-800 transition flex items-center justify-center gap-2"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;