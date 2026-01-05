
import React, { useEffect, useState} from "react";
import { useAuthStore } from "../../stores/authStore";
//import { Property } from "../../stores/slices/propertySlice";
import { Property } from "../../types/property";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import PropertyFilterSidebar from "../../components/Filters/PropertyFilterSidebar";
import { useNavigate } from "react-router-dom";

const ActivePropertiesUser: React.FC = () => {
  const properties = useAuthStore((state) => state.properties);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();
  const getActivePropertiesForUser = useAuthStore(
    (state) => state.getActivePropertiesForUser
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);  
   const [page, setPage] = useState(1);
   const totalPages = useAuthStore((state) => state.totalPages);
  



  const [filters, setFilters] = React.useState({
  // search: "",
  sortBy: "createdAt",
  sortOrder: "desc" as "asc" | "desc",
  // page: 1,
  limit:6,
  category: "", 
  facilities: [] as string[]
});

useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); 
    }, 1000);

    return () => clearTimeout(delay);
  }, [searchQuery]);
  
  const handlePageChange = (newPage: number) => {
  setFilters((prev) => ({ ...prev, page: newPage }));
};

const handleCategoryChange = (category: string) => {
  setFilters((prev) => ({ 
    ...prev, 
    category, 
    // page: 1 
  }));
   setPage(1);  
};








const handleFacilitiesChange = (facilities: string[]) => {
  setFilters((prev) => ({ 
    ...prev, 
    facilities, 
    // page: 1 
  }));
   setPage(1);
};


  useEffect(() => {
    const query = {
      search: debouncedSearch,
      page,
      limit: filters.limit,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      category: filters.category,
      facilities: filters.facilities,
    };   
    console.log("Fetching properties with:", query);
    getActivePropertiesForUser(query);
  }, [debouncedSearch, page, filters]);

useEffect(() => {
  return () => {
    useAuthStore.getState().resetProperties();
  };
}, []);



const handleSort = (sortBy: string, sortOrder: "asc" | "desc") => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }));
    setPage(1);
  };




  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <p>Loading active properties...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );

  if (!properties || properties.length === 0)
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
          No active properties found.
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      

      <div className="max-w-7xl mx-auto px-4 mt-10 py-10">
        
       
      
 


<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

  {/* SEARCH BAR */}
  <div className="relative w-full md:w-1/2">
    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
      🔍
    </span>

    <input
      type="text"
      placeholder="Search for your perfect stay..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full py-3 pl-12 pr-4 rounded-full bg-white shadow-md focus:ring-2 focus:ring-blue-700 outline-none text-gray-700"
    />
  </div>

  {/* SORT DROPDOWN */}
  <div className="flex items-center gap-2">
    <label className="text-gray-700 font-medium">Sort:</label>

    <select
      value={
        filters.sortBy === "pricePerMonth" && filters.sortOrder === "asc"
          ? "lowest"
          : filters.sortBy === "pricePerMonth" && filters.sortOrder === "desc"
          ? "highest"
          : filters.sortBy === "createdAt" && filters.sortOrder === "asc"
          ? "oldest"
          : "newest"
      }
      onChange={(e) => {
        const value = e.target.value;
        if (value === "lowest") handleSort("pricePerMonth", "asc");
        else if (value === "highest") handleSort("pricePerMonth", "desc");
        else if (value === "oldest") handleSort("createdAt", "asc");
        else handleSort("createdAt", "desc");
      }}
      className="border px-3 py-2 rounded-lg shadow-sm bg-white"
    >
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="lowest">Price: Low → High</option>
      <option value="highest">Price: High → Low</option>
    </select>
  </div>
</div>



         <div className="flex flex-col lg:flex-row gap-8">
           <div className="w-full lg:w-1/4">
            <PropertyFilterSidebar 
  onCategoryChange={handleCategoryChange}
  onFacilitiesChange={handleFacilitiesChange}
  selectedCategory={filters.category}
  selectedFacilities={filters.facilities}
/>

          </div>

           <div className="w-full lg:w-3/4">
            {(!properties || properties.length === 0) ? (
              <p className="text-gray-500 text-center">No active properties found.</p>
            ) : (

         <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property: Property) => (
            <div
               onClick={() => navigate(`/user/properties/${property.id}`)}
              key={property.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5"
            >
              {/* Images */}
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {property.title}
              </h3>

              {/* <p className="text-gray-600 mb-1">{property.type}</p> */}

              <p className="text-gray-500 text-sm mb-2">
                {property.city}, {property.district}, {property.state}
              </p>

              <p className="text-gray-900 font-bold text-lg mb-3">
                ₹{property.pricePerMonth}/month
              </p>
              

              

              

              
            </div>
          ))}
            </div>
            {/* After the property grid */}
{/* {properties.length > 0 && (
  <div className="flex justify-center items-center gap-4 mt-8">
    <button
      onClick={() => handlePageChange(filters.page - 1)}
      disabled={filters.page === 1}
      className="px-4 py-2 bg-blue-950 text-white rounded disabled:opacity-50"
    >
      Previous
    </button>
    <span className="text-gray-700">
      Page {filters.page} of {useAuthStore.getState().totalPages}
    </span>
    <button
      onClick={() => handlePageChange(filters.page + 1)}
      disabled={filters.page >= useAuthStore.getState().totalPages}
      className="px-4 py-2 bg-blue-950 text-white rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
)} */}
<div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-blue-950 text-white rounded disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span>Page {page} of {totalPages}</span>

                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-blue-950 text-white rounded disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
</>


            )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActivePropertiesUser;
