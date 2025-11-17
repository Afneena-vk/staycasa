// src/components/Filters/PropertyFilterSidebar.tsx

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
  selectedFacilities
}) => { 
    
 
//  const handleFacilityToggle = (facility: string) => {
//     let updatedFacilities;
//     if (selectedFacilities.includes(facility)) {
//       updatedFacilities = selectedFacilities.filter((f) => f !== facility);
//     } else {
//       updatedFacilities = [...selectedFacilities, facility];
//     }
//     onFacilitiesChange(updatedFacilities);
//   };
const handleCategoryChange = (cat: string) => {
    onCategoryChange(selectedCategory === cat ? "" : cat);
  };

  const handleFacilityChange = (fac: string) => {
    const updated = selectedFacilities.includes(fac)
      ? selectedFacilities.filter((f) => f !== fac)
      : [...selectedFacilities, fac];
    onFacilitiesChange(updated);
  };
//   return (
//     <div className="w-full sm:w-64 bg-white shadow-md rounded-xl p-6 h-fit sticky top-24">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">Filter By</h2>

//       {/* Categories */}
//       <div className="mb-8">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
//         <div className="space-y-3">
//           {categories.map((cat, index) => (
//             <label key={index} className="flex items-center space-x-3 cursor-pointer group">
//               <input
//                 type="checkbox"
//                 onChange={() => handleFilter("type", cat)}
//                 className="w-4 h-4 rounded border-gray-400 focus:ring-0 focus:outline-none"
//               />
//               <span className="text-gray-600 group-hover:text-gray-900 transition">
//                 {cat}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Facilities */}
//       <div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Facilities</h3>
//         <div className="space-y-3">
//           {facilities.map((fac, index) => (
//             <label key={index} className="flex items-center space-x-3 cursor-pointer group">
//               <input
//                 type="checkbox"
//                 className="w-4 h-4 rounded border-gray-400 focus:ring-0 focus:outline-none"
//               />
//               <span className="text-gray-600 group-hover:text-gray-900 transition">
//                 {fac}
//               </span>
//             </label>
//           ))}
//         </div>
//       </div>
//     </div>
//   );  


//   return (
//     <div className="bg-white shadow-md rounded-xl p-6 h-fit sticky top-24">
//       <h2 className="text-2xl font-semibold text-gray-800 mb-6">Filter By</h2>

//       {/* Category Filter */}
//       <div className="mb-8">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
//         <div className="space-y-3">
//           {categories.map((cat) => (
//             <label key={cat} className="flex items-center space-x-3 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={selectedCategory === cat}
//                 onChange={() => onCategoryChange(cat)}
//               />
//               <span>{cat}</span>
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Facilities */}
//       <div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">Facilities</h3>
//         <div className="space-y-3">
//           {facilities.map((fac) => (
//             <label key={fac} className="flex items-center space-x-3 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={selectedFacilities.includes(fac)}
//                 onChange={() => handleFacilityToggle(fac)}
//               />
//               <span>{fac}</span>
//             </label>
//           ))}
//         </div>
//       </div>
//     </div>
//   ); 
return (
    <div className="w-full sm:w-64 bg-white shadow-md rounded-xl p-6 h-fit sticky top-24">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Filter By</h2>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Categories</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCategory === cat}
                onChange={() => handleCategoryChange(cat)}
                className="w-4 h-4 rounded border-gray-400"
              />
              <span className="text-gray-600 group-hover:text-gray-900">
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
          {facilities.map((fac) => (
            <label key={fac} className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(fac)}
                onChange={() => handleFacilityChange(fac)}
                className="w-4 h-4 rounded border-gray-400"
              />
              <span className="text-gray-600 group-hover:text-gray-900">
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
