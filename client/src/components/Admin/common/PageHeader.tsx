import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode; 
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2">
      <div className="space-y-0.5">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-slate-500 font-medium">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default PageHeader;