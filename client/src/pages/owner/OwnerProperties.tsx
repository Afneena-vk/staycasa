

import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import PageHeader from "../../components/Admin/common/PageHeader";
import SearchInput from "../../components/Admin/common/SearchInput";
import FilterSelect from "../../components/Admin/common/FilterSelect";
import Pagination from "../../components/Admin/common/Pagination";

interface Property {
  id: string;
  title: string;
  type: string;
  description: string;
  city: string;
  state: string;
  pricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  status: "pending" | "active" | "blocked" | "booked" | "rejected";
  createdAt: Date;
}

const sortOptions = [
  { value: "createdAt-desc", label: "Newest" },
  { value: "createdAt-asc", label: "Oldest" },
  { value: "pricePerMonth-asc", label: "Price: Low → High" },
  { value: "pricePerMonth-desc", label: "Price: High → Low" },
];

const statusStyleMap: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
  booked: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const PropertyStatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
      statusStyleMap[status] ?? "bg-slate-50 text-slate-600 border-slate-200"
    }`}
  >
    {status || "Unknown"}
  </span>
);

const OwnerProperties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("createdAt-desc");
  const [localError, setLocalError] = useState<string | null>(null);

  const userData = useAuthStore((state) => state.userData);
  const getOwnerProperties = useAuthStore((state) => state.getOwnerProperties);
  const properties = useAuthStore((state) => state.properties);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const deleteProperty = useAuthStore((state) => state.deleteProperty);
  const totalPages = useAuthStore((state) => state.totalPages);
  const currentSubscription = useAuthStore((state) => state.currentSubscription);

  const subscriptionLoading = useAuthStore(
  (state) => state.subscriptionLoading
);

  const navigate = useNavigate();
  const location = useLocation();

  const isApproved = userData?.approvalStatus === "approved";
  const hasActiveSubscription =
    currentSubscription?.hasActiveSubscription === true;
    const maxProperties = currentSubscription?.subscription?.maxProperties || 0;
const usedProperties = currentSubscription?.subscription?.usedProperties || 0;

const propertyLimitReached = usedProperties >= maxProperties;

  const propertiesPerPage = 9;

 
  useEffect(() => {
    if (isApproved) {
      const [sortByField, sortOrderDir] = sortOption.split("-");
      const sortOrder = sortOrderDir === "asc" || sortOrderDir === "desc" ? sortOrderDir : undefined;
      getOwnerProperties({
        page: currentPage,
        limit: propertiesPerPage,
        search: debouncedSearch,
        sortBy: sortByField,
        // sortOrder: sortOrderDir,
        sortOrder,
      });
    }
  }, [isApproved, currentPage, debouncedSearch, sortOption]);

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);


  useEffect(() => {
    if (location.state?.success) {
      toast.success(location.state.success, {
        toastId: "property-update-success",
      });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, navigate]);


  const handleAddProperty = () => {
    try {
      if (isApproved) navigate("/owner/add-property");
    } catch (err) {
      console.error("Navigation error:", err);
      setLocalError("Navigation failed");
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteProperty(propertyId);
      toast.success("Property deleted successfully!");
    } catch (err) {
      console.error("Error deleting property:", err);
      toast.error("Failed to delete property.");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const safeProperties = Array.isArray(properties) ? properties : [];

  return (
    <div className="space-y-5">

      {/* ─ Header ─ */}
      <PageHeader title="My Properties">
        {/* ─ Approval / Subscription Messages ─ */}
{!isApproved && (
  <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg">
    <strong>Account Pending Approval:</strong>
    {userData?.approvalStatus === "pending" &&
      " Your account is under review. You cannot add properties until approved."}
    {userData?.approvalStatus === "rejected" &&
      " Your account has been rejected. Please contact support."}
  </div>
)}

{isApproved && !hasActiveSubscription && !subscriptionLoading && (
  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
    You don’t have an active subscription. Please subscribe to a plan to add properties.
  </div>
)}
{isApproved && hasActiveSubscription && propertyLimitReached && (
  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
    Property limit reached for your current plan.  
    Your plan allows <strong>{maxProperties}</strong> properties and you have already used all available slots.
  </div>
)}
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={handleClearSearch}
          placeholder="Search by title, location, type…"
          icon={<FaSearch size={13} />}
          className="w-full sm:w-72"
        />
        <FilterSelect
          value={sortOption}
          onChange={setSortOption}
          options={sortOptions}
          ariaLabel="Sort properties"
        />
        {/* Add property button */}
        <button
          onClick={handleAddProperty}
          disabled={!isApproved || !hasActiveSubscription || propertyLimitReached}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition ${
            isApproved && hasActiveSubscription
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-slate-200 cursor-not-allowed text-slate-400"
          }`}
        >
          <FaPlus size={12} />
          Add Property
        </button>
      </PageHeader>

      {/* ─ Error ─ */}
      {(error || localError) && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error || localError}
        </div>
      )}

      {/* ─ Initial loader ─ */}
      {isLoading && safeProperties.length === 0 && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">
              Loading properties…
            </p>
          </div>
        </div>
      )}

      {/* ─ Property Cards Grid ─ */}
      {!isLoading || safeProperties.length > 0 ? (
        <>
          {safeProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {safeProperties.map((property) => {
                const priceFormatted =
                  property.pricePerMonth?.toLocaleString() || "0";
                const isBooked = property.status === "booked";

                return (
                  <div
                    key={property.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition duration-200 group"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={
                          property.images?.[0] ||
                          "https://via.placeholder.com/300"
                        }
                        alt={property.title || "Property"}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/300";
                        }}
                      />
                      {/* Status badge overlay */}
                      <div className="absolute top-3 left-3">
                        <PropertyStatusBadge status={property.status} />
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="font-bold text-base text-slate-800 leading-snug line-clamp-1">
                          {property.title || "No Title"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          {property.type || "N/A"} •{" "}
                          {property.city}, {property.state}
                        </p>
                      </div>

                      {/* Price + actions */}
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-indigo-600">
                          ₹{priceFormatted}
                          <span className="text-xs font-medium text-slate-400">
                            /mo
                          </span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* View */}
                          <button
                            onClick={() =>
                              navigate(`/owner/properties/${property.id}`)
                            }
                            title="View"
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                          >
                            <FaEye size={13} />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() =>
                              navigate(
                                `/owner/properties/${property.id}/edit`
                              )
                            }
                            disabled={isBooked}
                            title="Edit"
                            className={`p-2 rounded-lg transition ${
                              !isBooked
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <FaEdit size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(property.id)}
                            disabled={isBooked}
                            title="Delete"
                            className={`p-2 rounded-lg transition ${
                              !isBooked
                                ? "bg-red-50 hover:bg-red-100 text-red-600"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg
                  className="w-14 h-14 text-slate-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 21V12h6v9"
                  />
                </svg>
                <p className="text-slate-500 font-medium text-sm">
                  {searchTerm
                    ? "No properties found matching your search"
                    : "No properties found"}
                </p>
              </div>
            )
          )}

          {/* ─ Pagination ─ */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={safeProperties.length}
            limit={propertiesPerPage}
            itemLabel="properties"
            onPageChange={setCurrentPage}
          />
        </>
      ) : null}
    </div>
  );
};

export default OwnerProperties;



// import { useEffect, useState } from "react";
// import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
// import { useAuthStore } from "../../stores/authStore";
// import { useNavigate, useLocation } from "react-router-dom";
// import { toast } from "react-toastify";

// interface Property {
//   id: string;
//   title: string;
//   type: string;
//   description: string;
//   city: string;
//   state: string;
//   pricePerMonth: number;
//   bedrooms: number;
//   bathrooms: number;
//   images: string[];
//   status: "pending" | "active" | "blocked" | "booked" | "rejected";
//   createdAt: Date;
// }

// const OwnerProperties = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortOption, setSortOption] = useState("createdAt-desc");
//   const [localError, setLocalError] = useState<string | null>(null);

//   const userData = useAuthStore((state) => state.userData);
//   const getOwnerProperties = useAuthStore((state) => state.getOwnerProperties);
//   const properties = useAuthStore((state) => state.properties);
//   const isLoading = useAuthStore((state) => state.isLoading);
//   const error = useAuthStore((state) => state.error);
//   const deleteProperty = useAuthStore((state) => state.deleteProperty);
//   const totalPages = useAuthStore((state) => state.totalPages);
//   const currentSubscription = useAuthStore(
//     (state) => state.currentSubscription
//   );
//   const subscriptionLoading = useAuthStore(
//     (state) => state.subscriptionLoading
//   );

//   const navigate = useNavigate();
//   const location = useLocation();

//   const isApproved = userData?.approvalStatus === "approved";
//   const hasActiveSubscription = currentSubscription?.hasActiveSubscription === true;

  
//   useEffect(() => {
//     if (isApproved) {
//       const [sortByField, sortOrderDir] = sortOption.split("-");
//       getOwnerProperties({
//         page: currentPage,
//         limit: 10,
//         search: debouncedSearch,
//         sortBy: sortByField,
//         sortOrder: sortOrderDir,
//       });
//     }
//   }, [isApproved, currentPage, debouncedSearch, sortOption]);

  
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//       setCurrentPage(1);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [searchTerm]);

  
//   useEffect(() => {
//     if (location.state?.success) {
//       toast.success(location.state.success, { toastId: "property-update-success" });
//       navigate(location.pathname, { replace: true, state: null });
//     }
//   }, [location.state, navigate]);

//   const handleAddProperty = () => {
//     try {
//       if (isApproved) navigate("/owner/add-property");
//     } catch (err) {
//       console.error("Navigation error:", err);
//       setLocalError("Navigation failed");
//     }
//   };

//   const handleDelete = async (propertyId: string) => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this property?");
//     if (!confirmDelete) return;

//     try {
//       await deleteProperty(propertyId);
//       toast.success("Property deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting property:", err);
//       toast.error("Failed to delete property.");
//     }
//   };

//   const getStatusInfo = (status: string) => {
//     switch (status) {
//       case "active": return { text: "Active", color: "bg-green-100 text-green-600" };
//       case "pending": return { text: "Pending", color: "bg-yellow-100 text-yellow-600" };
//       case "blocked": return { text: "Blocked", color: "bg-red-100 text-red-600" };
//       case "booked": return { text: "Booked", color: "bg-blue-100 text-blue-600" };
//       case "rejected": return { text: "Rejected", color: "bg-red-100 text-red-600" };
//       default: return { text: status || "Unknown", color: "bg-gray-100 text-gray-600" };
//     }
//   };

//   const safeProperties = Array.isArray(properties) ? properties : [];

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Properties</h1>
//         <button
//           onClick={handleAddProperty}
//           disabled={!isApproved || !hasActiveSubscription}
//           className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition ${
//             isApproved && hasActiveSubscription
//               ? "bg-blue-600 hover:bg-blue-700 text-white"
//               : "bg-gray-400 cursor-not-allowed text-gray-200"
//           }`}
//         >
//           <FaPlus />
//           Add New Property
//         </button>
//       </div>

//       {/* Search + Sort */}
//       <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
//         <div className="relative w-full max-w-sm">
//           <FaSearch className="absolute left-3 top-3 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by title, location, type, or status..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm("")}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//             >
//               ❌
//             </button>
//           )}
//         </div>
//         <select
//           value={sortOption}
//           onChange={(e) => setSortOption(e.target.value)}
//           className="px-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700"
//         >
//           <option value="createdAt-desc">Newest</option>
//           <option value="createdAt-asc">Oldest</option>
//           <option value="pricePerMonth-asc">Price: Low → High</option>
//           <option value="pricePerMonth-desc">Price: High → Low</option>
//         </select>
//       </div>

//       {/* Error */}
//       {(error || localError) && (
//         <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
//           <p className="text-red-700">{error || localError}</p>
//         </div>
//       )}

//       {/* Properties Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {safeProperties.length > 0 ? (
//           safeProperties.map((property) => {
//             const statusInfo = getStatusInfo(property.status);
//             const priceFormatted = property.pricePerMonth?.toLocaleString() || "0";

//             return (
//               <div
//                 key={property.id}
//                 className="bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden flex flex-col"
//               >
//                 <img
//                   src={property.images?.[0] || "https://via.placeholder.com/300"}
//                   alt={property.title || "Property"}
//                   className="h-40 w-full object-cover"
//                   onError={(e) => {
//                     const target = e.target as HTMLImageElement;
//                     target.src = "https://via.placeholder.com/300";
//                   }}
//                 />
//                 <div className="p-4 flex-1 flex flex-col justify-between">
//                   <div className="mb-2">
//                     <h2 className="font-bold text-lg text-slate-800 dark:text-white">
//                       {property.title || "No Title"}
//                     </h2>
//                     <p className="text-sm text-slate-500 dark:text-gray-300">
//                       {property.type || "N/A"} • {property.city}, {property.state}
//                     </p>
//                     <p className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${statusInfo.color}`}>
//                       {statusInfo.text}
//                     </p>
//                   </div>

//                   <div className="mt-4 flex justify-between items-center">
//                     <span className="font-bold text-blue-600 dark:text-blue-400">
//                       ₹{priceFormatted}/month
//                     </span>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => navigate(`/owner/properties/${property.id}`)}
//                         className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
//                         title="View"
//                       >
//                         <FaEye size={14} />
//                       </button>
//                       <button
//                         onClick={() => navigate(`/owner/properties/${property.id}/edit`)}
//                         disabled={property.status === "booked"}
//                         className={`p-2 rounded-lg ${
//                           property.status !== "booked"
//                             ? "bg-green-500 hover:bg-green-600 text-white"
//                             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                         }`}
//                         title="Edit"
//                       >
//                         <FaEdit size={14} />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(property.id)}
//                         disabled={property.status === "booked"}
//                         className={`p-2 rounded-lg ${
//                           property.status !== "booked"
//                             ? "bg-red-500 hover:bg-red-600 text-white"
//                             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                         }`}
//                         title="Delete"
//                       >
//                         <FaTrash size={14} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         ) : (
//           !isLoading && (
//             <p className="col-span-full text-center text-gray-500 py-20">
//               {searchTerm ? "No properties found matching your search" : "No properties found"}
//             </p>
//           )
//         )}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex justify-center items-center gap-2 mt-6">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(currentPage - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i}
//               onClick={() => setCurrentPage(i + 1)}
//               className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-blue-500 text-white" : ""}`}
//             >
//               {i + 1}
//             </button>
//           ))}
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(currentPage + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OwnerProperties;
