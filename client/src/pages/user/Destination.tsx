
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
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
    getDestinations({ search: debouncedSearch, page: 1, limit: 10 });
  }, [debouncedSearch]);

  const handleClick = (district: string) => {
    navigate(`/properties?destination=${encodeURIComponent(district)}`);
  };

  const handlePageChange = (page: number) => {
    getDestinations({ search: debouncedSearch, page, limit: 10 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Heading + Description + Search in one compact section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-3">
            Explore Destinations
          </h1>
          <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
            Find vacation homes in your favorite locations
          </p>

          {/* Modern search bar */}
          <div className="relative w-full max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search destinations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-full bg-white shadow-md
                         focus:ring-2 focus:ring-blue-600 outline-none text-gray-700
                         transition-all duration-200 hover:shadow-lg"
            />
              {search && (
                 <button
                  // onClick={() => setSearch("")}
                     onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
             >
                ❌
               </button>
             )}
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500 mt-10">Loading destinations...</p>
        ) : 
        // destinations.length === 0 ? (
        //   <p className="text-center text-gray-500 mt-10">No destinations found.</p>
        // )
destinations.length === 0 ? (
  <div className="text-center text-gray-500 mt-10">
    {hasSearched ? (
      <>
        <p>No results found for "{debouncedSearch}"</p>
        <button
          // onClick={() => setSearch("")}
             onClick={handleClearSearch}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Clear Search
        </button>
      </>
    ) : (
      <p>No destinations available right now.</p>
    )}
  </div>
)



         : (
          <>
            {/* Destination Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {destinations.map((dest) => (
                <div
                  key={dest.district}
                  onClick={() => handleClick(dest.district)}
                  className="cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl
                             transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105 bg-white"
                >
                  <img
                    src={dest.image || "/placeholder.jpg"}
                    alt={dest.district}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-900">{dest.district}</h2>
                    <p className="text-gray-500 mt-1">{dest.propertyCount} homes available</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition
                             ${page === currentPage ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}
                             hover:bg-blue-500 hover:text-white`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Total districts */}
            <p className="text-center text-gray-500 mt-4">
              Total districts: {totalCount}
            </p>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Destinations;
