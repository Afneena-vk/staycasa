import React from "react";

interface AlertMessageProps {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onClose }) => {
  const isSuccess = type === "success";

  const containerStyles = isSuccess
    ? "bg-green-50 border border-green-200 text-green-800"
    : "bg-red-50 border border-red-200 text-red-800";

  const iconStyles = isSuccess ? "text-green-500" : "text-red-500";
  const closeStyles = isSuccess
    ? "text-green-400 hover:text-green-700 hover:bg-green-100"
    : "text-red-400 hover:text-red-700 hover:bg-red-100";

  return (
    <div
      className={`flex items-start justify-between gap-3 px-4 py-3 rounded-lg text-sm ${containerStyles}`}
      role="alert"
    >
      <div className="flex items-center gap-2.5">
        {isSuccess ? (
          <svg className={`w-4 h-4 flex-shrink-0 ${iconStyles}`} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className={`w-4 h-4 flex-shrink-0 ${iconStyles}`} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        )}
        <span className="font-medium">{message}</span>
      </div>

      <button
        onClick={onClose}
        aria-label="Dismiss"
        className={`flex-shrink-0 p-1 rounded-md transition ${closeStyles}`}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default AlertMessage;