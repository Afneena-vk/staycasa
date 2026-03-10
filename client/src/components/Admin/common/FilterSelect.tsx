import React from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
  ariaLabel?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  className = "",
  ariaLabel,
}) => {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="
          appearance-none
          w-full py-2 pl-3 pr-8 text-sm
          bg-white border border-slate-200
          rounded-lg shadow-sm
          text-slate-700
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
          transition duration-150
          cursor-pointer
        "
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom chevron */}
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
};

export default FilterSelect;