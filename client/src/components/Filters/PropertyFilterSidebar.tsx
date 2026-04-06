

import React from "react";

interface SidebarProps {
  onCategoryChange: (category: string) => void;
  onFacilitiesChange: (facilities: string[]) => void;
  selectedCategory: string;
  selectedFacilities: string[];
}

const categories = ["Apartment", "Villa", "Cottage", "Homestay"];
const facilities = ["WiFi", "AC", "Parking", "Kitchen", "TV", "Pool"];

const PropertyFilterSidebar: React.FC<SidebarProps> = ({
  onCategoryChange,
  onFacilitiesChange,
  selectedCategory,
  selectedFacilities,
}) => {
  const handleCategoryChange = (cat: string) => {
    onCategoryChange(selectedCategory === cat ? "" : cat);
  };

  const handleFacilityChange = (fac: string) => {
    const updated = selectedFacilities.includes(fac)
      ? selectedFacilities.filter((f) => f !== fac)
      : [...selectedFacilities, fac];
    onFacilitiesChange(updated);
  };

  return (
    // <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-6">
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-5 space-y-6">
      <h2 className="text-base font-semibold text-gray-800">Filter By</h2>

      {/* Categories */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            // <li key={cat} className="flex items-center gap-2 cursor-pointer group" onClick={() => handleCategoryChange(cat)}>
              <li key={cat} className="flex items-center gap-2 cursor-pointer group hover:scale-105 transition-transform duration-200" onClick={() => handleCategoryChange(cat)}>
              <input
                type="checkbox"
                checked={selectedCategory === cat}
                readOnly
                className="w-4 h-4 rounded border-gray-300 accent-blue-700 cursor-pointer"
              />
              {/* <span className={`text-sm transition-colors ${selectedCategory === cat ? "text-blue-700 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>
                {cat}
              </span> */}
<span
  className={`px-3 py-1 rounded-full cursor-pointer text-sm font-medium transition ${
    selectedCategory === cat
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
  }`}
>
  {cat}
</span>

            </li>
          ))}
        </ul>
      </div>

      {/* Facilities */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Facilities</h3>
        <ul className="space-y-2">
          {facilities.map((fac) => (
            <li key={fac} className="flex items-center gap-2 cursor-pointer group hover:scale-105 transition-transform duration-200" onClick={() => handleFacilityChange(fac)}>
              <input
                type="checkbox"
                checked={selectedFacilities.includes(fac)}
                readOnly
                className="w-4 h-4 rounded border-gray-300 accent-blue-700 cursor-pointer"
              />
              <span className={`text-sm transition-colors ${selectedFacilities.includes(fac) ? "text-blue-700 font-medium" : "text-gray-600 group-hover:text-gray-900"}`}>
                {fac}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PropertyFilterSidebar;
