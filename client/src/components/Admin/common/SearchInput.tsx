import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = "Search...",
  className = "",
  icon,
}) => {
  return (
    <div className={`relative w-full sm:w-64 ${className}`}>
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          {icon}
        </span>
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full py-2 px-4 text-sm
          bg-white border border-slate-200
          rounded-lg shadow-sm
          text-slate-700 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
          transition duration-150
          ${icon ? "pl-9" : ""}
          ${value ? "pr-8" : ""}
        `}
      />
      {value && (
        <button
          onClick={onClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;