
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Property } from "../../types/property";
import PropertyFilterSidebar from "../../components/Filters/PropertyFilterSidebar";
import { useNavigate } from "react-router-dom";
import StarRating from "../../components/common/StarRating";
import { FaStar } from "react-icons/fa";

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
    sortBy: "createdAt",
    sortOrder: "desc" as "asc" | "desc",
    limit: 6,
    category: "",
    facilities: [] as string[],
  });

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 1000);
    return () => clearTimeout(delay);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => ({ ...prev, category }));
    setPage(1);
  };

  const handleFacilitiesChange = (facilities: string[]) => {
    setFilters((prev) => ({ ...prev, facilities }));
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

  // if (isLoading)
  //   return (
  //     <div className="flex items-center justify-center min-h-[60vh]">
  //       <p className="text-gray-500 text-lg animate-pulse">Loading properties...</p>
  //     </div>
  //   );

  // if (error)
  //   return (
  //     <div className="flex items-center justify-center min-h-[60vh]">
  //       <p className="text-red-500 text-lg">{error}</p>
  //     </div>
  //   );

  const isFilterApplied =
    searchQuery.trim() !== "" ||
    filters.category !== "" ||
    filters.facilities.length > 0;

      if (isLoading && properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading properties...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── STICKY SEARCH + SORT BAR ── */}
      <div className="sticky top-16 z-40 bg-gray-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-11 pr-10 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-700 focus:border-transparent outline-none text-sm"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                ❌
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-gray-500 whitespace-nowrap">Sort:</span>
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
              className="border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm text-sm focus:ring-2 focus:ring-blue-700 outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="lowest">Price: Low → High</option>
              <option value="highest">Price: High → Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      {/* top-16 header + ~64px search bar ≈ top-32 for sticky sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">

          {/* ── SIDEBAR ── */}
          {/* <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
            <div className="sticky top-32"> */}
            <aside className="hidden lg:block w-56 xl:w-64 shrink-0 sticky top-32 self-start">
              <PropertyFilterSidebar
                onCategoryChange={handleCategoryChange}
                onFacilitiesChange={handleFacilitiesChange}
                selectedCategory={filters.category}
                selectedFacilities={filters.facilities}
              />
            {/* </div> */}
          </aside>

          {/* ── PROPERTY GRID ── */}
          <section className="flex-1 min-w-0">
            {properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🏠</div>
                {!isFilterApplied ? (
                  <>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                      No active properties available
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Properties will appear here once they are listed.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                      No results found
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">
                      Try changing or clearing your filters.
                    </p>
                    <button
                      onClick={handleClearSearch}
                      className="px-4 py-2 bg-blue-950 text-white rounded-lg text-sm hover:bg-blue-800 transition-colors"
                    >
                      Clear Search
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"> */}
                <div className="flex flex-col gap-6">
                  {/* {properties.map((property: Property) => (
                    <div
                      key={property.id}
                      onClick={() => navigate(`/user/properties/${property.id}`)}
                      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                    >
                   
                      <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
      
                        {property.images?.[0] && (
  <img
    src={property.images[0]}
    alt={property.title}
    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
  />
)}
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {property.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">
                          {property.city}, {property.district}, {property.state}
                        </p>

                        <div className="flex items-center gap-1">
                          {property.totalReviews > 0 ? (
                            <>
                              <StarRating rating={property.averageRating} />
                              <span className="text-xs text-gray-400">
                                ({property.totalReviews})
                              </span>
                            </>
                          ) : (
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="text-gray-200 text-xs" />
                              ))}
                            </div>
                          )}
                        </div>

                        <p className="text-sm font-bold text-blue-950">
                          ₹{property.pricePerMonth}
                          <span className="text-xs font-normal text-gray-400">/month</span>
                        </p>
                      </div>
                    </div>
                  ))} */}

                  {properties.map((property: Property) => (
  <div
    key={property.id}
    onClick={() => navigate(`/user/properties/${property.id}`)}
    // className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer overflow-hidden flex"
     className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col sm:flex-row"
  >
    
    {/* Property Image */}
    {/* <div className="w-64 h-48 bg-gray-100 shrink-0"> */}
    <div className="w-full sm:w-64 h-48 sm:h-auto bg-gray-100 shrink-0">
      {property.images?.[0] && (
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      )}
    </div>

    {/* Property Details */}
    {/* <div className="flex flex-col justify-between p-5 flex-1"> */}
     <div className="flex flex-col justify-between p-4 sm:p-5 flex-1">

      <div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900">
          {property.title}
        </h3>

        {/* Location */}
        <p className="text-sm text-gray-500 mb-2">
          {property.city}, {property.district}, {property.state}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          {property.totalReviews > 0 ? (
            <>
              <StarRating rating={property.averageRating} />
              <span className="text-sm text-gray-500">
                ({property.totalReviews})
              </span>
            </>
          ) : (
            <div className="flex text-gray-300">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
          )}
        </div>

        {/* Property Details */}
        <p className="text-sm text-gray-600">
          {property.bedrooms} Bedrooms • {property.bathrooms} Bathrooms • {property.maxGuests} Guests
        </p>

        {/* Lease Period */}
        <p className="text-sm text-gray-600 mt-1">
          Lease: {property.minLeasePeriod} - {property.maxLeasePeriod} months
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mt-2">
          {property.features.slice(0, 4).map((feature, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 px-2 py-1 rounded"
            >
              {feature}
            </span>
          ))}
        </div>

      </div>

      {/* Price */}
      {/* <div className="flex justify-end"> */}
       <div className="mt-3 sm:mt-0 flex justify-end">
        <p className="text-xl font-bold text-blue-950">
          ₹{property.pricePerMonth}
          <span className="text-sm text-gray-500 font-normal">
            {" "} / month
          </span>
        </p>
      </div>

    </div>
  </div>
))}
                </div>

                {/* ── PAGINATION ── */}
                <div className="flex items-center justify-center gap-4 mt-8 pb-4">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-blue-950 text-white rounded-lg text-sm disabled:opacity-40 hover:bg-blue-800 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-blue-950 text-white rounded-lg text-sm disabled:opacity-40 hover:bg-blue-800 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default ActivePropertiesUser;
