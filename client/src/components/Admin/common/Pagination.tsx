import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  limit,
  itemLabel = "items",
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalCount);

  
  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-100">
      {/* Count label */}
      <p className="text-xs text-slate-500 font-medium">
        Showing{" "}
        <span className="text-slate-700 font-semibold">{start}</span>–
        <span className="text-slate-700 font-semibold">{end}</span>{" "}
        of{" "}
        <span className="text-slate-700 font-semibold">{totalCount}</span>{" "}
        {itemLabel}
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            flex items-center gap-1 px-3 py-1.5 text-xs font-medium
            border border-slate-200 rounded-lg
            text-slate-600 bg-white
            hover:bg-slate-50 hover:border-slate-300
            disabled:opacity-40 disabled:cursor-not-allowed
            transition duration-150
          "
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 py-1.5 text-xs text-slate-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`
                w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg border transition duration-150
                ${
                  currentPage === p
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-transparent shadow-sm shadow-blue-200"
                    : "border-slate-200 text-slate-600 bg-white hover:bg-slate-50 hover:border-slate-300"
                }
              `}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            flex items-center gap-1 px-3 py-1.5 text-xs font-medium
            border border-slate-200 rounded-lg
            text-slate-600 bg-white
            hover:bg-slate-50 hover:border-slate-300
            disabled:opacity-40 disabled:cursor-not-allowed
            transition duration-150
          "
        >
          Next
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;