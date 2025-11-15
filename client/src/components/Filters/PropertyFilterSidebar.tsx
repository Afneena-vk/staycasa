// src/components/Filters/PropertyFilterSidebar.tsx

import React from "react";

const categories = ["Apartment", "Villa", "Cottage", "Homestay"];
const facilities = ["WiFi", "AC", "Parking", "Kitchen", "TV", "Pool"];

const PropertyFilterSidebar: React.FC = () => {
  return (
    <div className="w-full sm:w-64 bg-white shadow-md rounded-xl p-6 h-fit sticky top-24">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Filter By</h2>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((cat, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-400 focus:ring-0 focus:outline-none"
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Facilities */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Facilities</h3>
        <div className="space-y-3">
          {facilities.map((fac, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-400 focus:ring-0 focus:outline-none"
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition">
                {fac}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilterSidebar;
