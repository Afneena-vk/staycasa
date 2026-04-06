

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const Destinations = () => {
  const destinations = useAuthStore((state) => state.destinations);
  const totalPages = useAuthStore((state) => state.totalPages);
  const currentPage = useAuthStore((state) => state.currentPage);
  const totalCount = useAuthStore((state) => state.totalCount);
  const isLoading = useAuthStore((state) => state.isLoading);
  const getDestinations = useAuthStore((state) => state.getDestinations);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setHasSearched(search.trim().length > 0);
    }, 1000);
    return () => clearTimeout(handler);
  }, [search]);

  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setHasSearched(false);
  };

  useEffect(() => {
    getDestinations({ search: debouncedSearch, page: 1, limit: 6 });
  }, [debouncedSearch]);

  const handleClick = (district: string) => {
    navigate(`/properties?destination=${encodeURIComponent(district)}`);
  };

  const handlePageChange = (page: number) => {
    getDestinations({ search: debouncedSearch, page, limit: 6 });
  };

  if (isLoading && destinations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-medium">Loading destinations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* SEARCH BAR */}
      <div className="sticky top-16 z-40 backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="relative flex-1 max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-2.5 pl-11 pr-10 rounded-full bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-700 outline-none text-sm transition"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ❌
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {totalCount} destination{totalCount !== 1 ? "s" : ""} found
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-950 to-blue-600 bg-clip-text text-transparent">
            Explore Destinations
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Find vacation homes in your favorite locations
          </p>
        </div>

        {destinations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4 animate-pulse">🌍</div>

            {!hasSearched ? (
              <>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No destinations available
                </h2>
                <p className="text-gray-400 text-sm">
                  Destinations will appear here once they are added.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No results found
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  No destinations match "{debouncedSearch}".
                </p>
                <button
                  onClick={handleClearSearch}
                  className="px-5 py-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg text-sm hover:opacity-90 transition"
                >
                  Clear Search
                </button>
              </>
            )}
          </div>
        ) : (
          <>

            {/* GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destinations.map((dest) => (
                <div
                  key={dest.district}
                  onClick={() => handleClick(dest.district)}
                  className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
                >

                  {/* IMAGE */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={dest.image || "/placeholder.jpg"}
                      alt={dest.district}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {dest.district}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {dest.propertyCount} home{dest.propertyCount !== 1 ? "s" : ""} available
                    </p>

                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-100 transition">
                        Explore →
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-5 py-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg text-sm disabled:opacity-40 hover:opacity-90 transition"
                >
                  Previous
                </button>

                <span className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-5 py-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg text-sm disabled:opacity-40 hover:opacity-90 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Destinations;
