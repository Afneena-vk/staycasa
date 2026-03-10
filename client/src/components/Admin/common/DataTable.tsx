import React from "react";

interface DataTableProps {
  children: React.ReactNode;       // <thead> + <tbody> go here
  loading?: boolean;               // shows "Updating..." overlay when refetching
  isEmpty?: boolean;               // triggers empty state row
  emptyMessage?: string;
  colSpan?: number;                // number of columns for empty state cell
}

const DataTable: React.FC<DataTableProps> = ({
  children,
  loading = false,
  isEmpty = false,
  emptyMessage = "No data found.",
  colSpan = 6,
}) => {
  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Soft "Updating..." badge — only shown during background refetches */}
      {loading && (
        <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Updating…
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-slate-700">
          {isEmpty ? (
            <>
              {/* Render thead from children even when empty so headers show */}
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child) && (child as React.ReactElement).type === "thead") {
                  return child;
                }
                return null;
              })}
              <tbody>
                <tr>
                  <td
                    colSpan={colSpan}
                    className="px-6 py-16 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="w-10 h-10 text-slate-300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m8-4v4m0 0l-2-2m2 2l2-2"
                        />
                      </svg>
                      <span className="text-sm font-medium">{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </>
          ) : (
            children
          )}
        </table>
      </div>
    </div>
  );
};

export default DataTable;