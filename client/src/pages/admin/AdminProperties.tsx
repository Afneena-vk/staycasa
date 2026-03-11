
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Eye, CheckCircle, XCircle, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


import PageHeader from "../../components/Admin/common/PageHeader";
import SearchInput from "../../components/Admin/common/SearchInput";
import FilterSelect from "../../components/Admin/common/FilterSelect";
import Pagination from "../../components/Admin/common/Pagination";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  // { value: "booked", label: "Booked" },
  { value: "rejected", label: "Rejected" },
];

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

function AdminProperties() {
  const {
    getAllPropertiesAdmin,
    properties,
    isLoading,
    error,
    approveProperty,
    rejectProperty,
    blockPropertyByAdmin,
    unblockPropertyByAdmin,
    totalPages,
  } = useAuthStore();

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("createdAt-desc");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const propertiesPerPage = 9;

  useEffect(() => {
    const [sortByField, sortOrderDir] = sortOption.split("-");
    getAllPropertiesAdmin({
      page: currentPage,
      limit: propertiesPerPage,
      search: debouncedSearch,
      sortBy: sortByField,
      sortOrder: sortOrderDir,
      status: statusFilter,
    });
  }, [currentPage, debouncedSearch, sortOption,  statusFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/admin/properties/${propertyId}`);
  };

  const handleApprove = async (propertyId: string) => {
    if (!window.confirm("Do you want to approve the property")) return;
    try {
      await approveProperty(propertyId);
      toast.success("Property approved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to approve property");
    }
  };

  const handleReject = async (propertyId: string) => {
    if (!window.confirm("Do you want to reject the property")) return;
    try {
      await rejectProperty(propertyId);
      toast.success("Property rejected successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to reject property");
    }
  };

  const handleBlock = async (propertyId: string) => {
    if (!window.confirm("Do you want to block the property")) return;
    try {
      await blockPropertyByAdmin(propertyId);
      toast.success("Property blocked successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to block property");
    }
  };

  const handleUnblock = async (propertyId: string) => {
    if (!window.confirm("Do you want to unblock property")) return;
    try {
      await unblockPropertyByAdmin(propertyId);
      toast.success("Property unblocked successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to unblock property");
    }
  };
  if (isLoading && properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">
            Loading properties…
          </p>
        </div>
      </div>
    );
  }

  const safeProperties = Array.isArray(properties) ? properties : [];

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <PageHeader title="Property Management">
        <SearchInput
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          onClear={handleClearSearch}
          placeholder="Search properties…"
        />
        <FilterSelect
          value={sortOption}
          onChange={setSortOption}
          options={sortOptions}
          ariaLabel="Sort properties"
        />

          <FilterSelect
           value={statusFilter}
           onChange={(val) => {
           setStatusFilter(val);
           setCurrentPage(1);
          }}
           options={statusOptions}
           ariaLabel="Filter by status"
         />
      </PageHeader>

      {/* ─ Error ─ */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* ─ Soft updating indicator ─ */}
      {isLoading && safeProperties.length > 0 && (
        <div className="flex justify-end">
          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Updating…
          </span>
        </div>
      )}

      {/* ─ Property Cards Grid ─ */}
      {safeProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {safeProperties.map((p) => {
            const priceFormatted = p.pricePerMonth?.toLocaleString() || "0";

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition duration-200 group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  {p.images?.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/300";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      No image
                    </div>
                  )}

                  {/* Status badge overlay */}
                  <div className="absolute top-3 left-3">
                    <PropertyStatusBadge status={p.status} />
                  </div>

                  {/* Created date overlay */}
                  <div className="absolute bottom-3 right-3">
                    <span className="text-xs bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-bold text-base text-slate-800 leading-snug line-clamp-1">
                      {p.title || "No Title"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {p.district}, {p.state}
                    </p>
                  </div>

                 
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-blue-600">
                      ₹{priceFormatted}
                      <span className="text-xs font-medium text-slate-400">
                        /mo
                      </span>
                    </span>

                   
                    <div className="flex items-center gap-1.5">
                      {/* Approve — only when pending */}
                      {p.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(p.id)}
                            title="Approve"
                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => handleReject(p.id)}
                            title="Reject"
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition"
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}

                      {/* Block — only when active */}
                      {p.status === "active" && (
                        <button
                          onClick={() => handleBlock(p.id)}
                          title="Block"
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition"
                        >
                          <Ban size={14} />
                        </button>
                      )}

                      {/* Unblock — only when blocked */}
                      {p.status === "blocked" && (
                        <button
                          onClick={() => handleUnblock(p.id)}
                          title="Unblock"
                          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition"
                        >
                          <Ban size={14} />
                        </button>
                      )}

                      {/* View — always shown */}
                      <button
                        onClick={() => handleViewProperty(p.id)}
                        title="View Details"
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                      >
                        <Eye size={14} />
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
              No properties found.
            </p>
          </div>
        )
      )}

      {/* ─ Pagination ─ */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        // totalCount={safeProperties.length}
        totalCount={safeProperties.length}
        limit={propertiesPerPage}
        itemLabel="properties"
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default AdminProperties;


// import React, { useEffect, useState } from "react";
// import { useAuthStore } from "../../stores/authStore";
// import { Eye, CheckCircle, XCircle, Ban } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";


// import PageHeader from "../../components/Admin/common/PageHeader";
// import SearchInput from "../../components/Admin/common/SearchInput";
// import FilterSelect from "../../components/Admin/common/FilterSelect";
// import DataTable from "../../components/Admin/common/DataTable";
// import Pagination from "../../components/Admin/common/Pagination";

// const sortOptions = [
//   { value: "createdAt-desc", label: "Newest" },
//   { value: "createdAt-asc", label: "Oldest" },
//   { value: "pricePerMonth-asc", label: "Price: Low → High" },
//   { value: "pricePerMonth-desc", label: "Price: High → Low" },
// ];

// // ─ Status badge (inline — no external StatusBadge import needed)
// const PropertyStatusBadge: React.FC<{ status: string }> = ({ status }) => {
//   const styles: Record<string, string> = {
//     active: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     pending: "bg-amber-50 text-amber-700 border-amber-200",
//     blocked: "bg-red-50 text-red-700 border-red-200",
//     booked: "bg-blue-50 text-blue-700 border-blue-200",
//     rejected: "bg-red-50 text-red-700 border-red-200",
//   };
//   return (
//     <span
//       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
//         styles[status] ?? "bg-slate-50 text-slate-600 border-slate-200"
//       }`}
//     >
//       {status}
//     </span>
//   );
// };

// function AdminProperties() {
//   const {
//     getAllPropertiesAdmin,
//     properties,
//     isLoading,
//     error,
//     approveProperty,
//     rejectProperty,
//     blockPropertyByAdmin,
//     unblockPropertyByAdmin,
//     totalPages,
//   } = useAuthStore();

//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortOption, setSortOption] = useState("createdAt-desc");

//   const propertiesPerPage = 10;

//   // ─ Fetch
//   useEffect(() => {
//     const [sortByField, sortOrderDir] = sortOption.split("-");
//     getAllPropertiesAdmin({
//       page: currentPage,
//       limit: propertiesPerPage,
//       search: debouncedSearch,
//       sortBy: sortByField,
//       sortOrder: sortOrderDir,
//     });
//   }, [currentPage, debouncedSearch, sortOption]);

//   // ─ Debounce
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [searchQuery]);

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setDebouncedSearch("");
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number) => setCurrentPage(page);

//   const handleViewProperty = (propertyId: string) => {
//     navigate(`/admin/properties/${propertyId}`);
//   };

//   // ─ Actions
//   const handleApprove = async (propertyId: string) => {
//     if (!window.confirm("Do you want to approve the property")) return;
//     try {
//       await approveProperty(propertyId);
//       toast.success("Property approved successfully!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to approve property");
//     }
//   };

//   const handleReject = async (propertyId: string) => {
//     if (!window.confirm("Do you want to reject the property")) return;
//     try {
//       await rejectProperty(propertyId);
//       toast.success("Property rejected successfully!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to reject property");
//     }
//   };

//   const handleBlock = async (propertyId: string) => {
//     if (!window.confirm("Do you want to block the property")) return;
//     try {
//       await blockPropertyByAdmin(propertyId);
//       toast.success("Property blocked successfully!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to block property");
//     }
//   };

//   const handleUnblock = async (propertyId: string) => {
//     if (!window.confirm("Do you want to unblock property")) return;
//     try {
//       await unblockPropertyByAdmin(propertyId);
//       toast.success("Property unblocked successfully!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to unblock property");
//     }
//   };

  
//   if (isLoading && properties.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="flex flex-col items-center gap-3">
//           <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
//           <p className="text-sm text-slate-500 font-medium">Loading properties…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-5">
//       {/* ── Header ── */}
//       <PageHeader title="Property Management">
//         <SearchInput
//           value={searchQuery}
//           onChange={(val) => {
//             setSearchQuery(val);
//             setCurrentPage(1);
//           }}
//           onClear={handleClearSearch}
//           placeholder="Search properties…"
//         />
//         <FilterSelect
//           value={sortOption}
//           onChange={setSortOption}
//           options={sortOptions}
//           ariaLabel="Sort properties"
//         />
//       </PageHeader>

//       {/* ── Error ── */}
//       {error && (
//         <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
//           {error}
//         </div>
//       )}

//       {/* ── Table ── */}
//       <DataTable
//         loading={isLoading && properties.length > 0}
//         isEmpty={properties.length === 0 && !isLoading}
//         emptyMessage="No properties found."
//         colSpan={7}
//       >
//         <thead className="bg-slate-50 border-b border-slate-100">
//           <tr>
//             {["Image", "Title", "Location", "Price / Month", "Status", "Created At", "Actions"].map(
//               (h) => (
//                 <th
//                   key={h}
//                   className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
//                 >
//                   {h}
//                 </th>
//               )
//             )}
//           </tr>
//         </thead>

//         <tbody className="divide-y divide-slate-50">
//           {properties.map((p) => (
//             <tr key={p.id} className="hover:bg-slate-50/70 transition duration-100">
//               {/* Image */}
//               <td className="px-5 py-4">
//                 {p.images?.length > 0 ? (
//                   <img
//                     src={p.images[0]}
//                     alt={p.title}
//                     className="w-16 h-14 object-cover rounded-lg border border-slate-100"
//                   />
//                 ) : (
//                   <div className="w-16 h-14 bg-slate-100 flex items-center justify-center text-slate-400 rounded-lg text-xs">
//                     No image
//                   </div>
//                 )}
//               </td>

//               {/* Title */}
//               <td className="px-5 py-4 text-sm font-semibold text-slate-800">{p.title}</td>

//               {/* Location */}
//               <td className="px-5 py-4 text-sm text-slate-600">
//                 {p.district}, {p.state}
//               </td>

//               {/* Price */}
//               <td className="px-5 py-4 text-sm font-medium text-slate-700">₹{p.pricePerMonth}</td>

//               {/* Status */}
//               <td className="px-5 py-4">
//                 <PropertyStatusBadge status={p.status} />
//               </td>

//               {/* Created At */}
//               <td className="px-5 py-4 text-sm text-slate-500">
//                 {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "N/A"}
//               </td>

//               {/* Actions */}
//               <td className="px-5 py-4">
//                 <div className="flex items-center gap-2">
//                   {p.status === "pending" && (
//                     <>
//                       <button
//                         onClick={() => handleApprove(p.id)}
//                         title="Approve"
//                         className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
//                       >
//                         <CheckCircle size={17} />
//                       </button>
//                       <button
//                         onClick={() => handleReject(p.id)}
//                         title="Reject"
//                         className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
//                       >
//                         <XCircle size={17} />
//                       </button>
//                     </>
//                   )}

//                   {p.status === "active" && (
//                     <button
//                       onClick={() => handleBlock(p.id)}
//                       title="Block"
//                       className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
//                     >
//                       <Ban size={17} />
//                     </button>
//                   )}

//                   {p.status === "blocked" && (
//                     <button
//                       onClick={() => handleUnblock(p.id)}
//                       title="Unblock"
//                       className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
//                     >
//                       <Ban size={17} />
//                     </button>
//                   )}

//                   <button
//                     onClick={() => handleViewProperty(p.id)}
//                     title="View Details"
//                     className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
//                   >
//                     <Eye size={17} />
//                   </button>
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </DataTable>

//       {/* ── Pagination ── */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         totalCount={properties.length}
//         limit={propertiesPerPage}
//         itemLabel="properties"
//         onPageChange={handlePageChange}
//       />
//     </div>
//   );
// }

// export default AdminProperties;


// import React, { useEffect, useState } from "react";
// import { useAuthStore } from "../../stores/authStore";
// //import AdminLayout from "../../layouts/admin/AdminLayout";
// import { Eye, CheckCircle, XCircle, Ban } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// function AdminProperties() {
//   const {
//     getAllPropertiesAdmin,
//     properties,
//     isLoading,
//     error,
//     approveProperty,
//     rejectProperty,
//     blockPropertyByAdmin,
//     unblockPropertyByAdmin,
//     totalPages,
//   } = useAuthStore();

//   const navigate = useNavigate();

//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [sortOption, setSortOption] = useState("createdAt-desc");

//   const propertiesPerPage = 10;

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     const [sortByField, sortOrderDir] = sortOption.split("-");

//     getAllPropertiesAdmin({
//       page: currentPage,
//       limit: propertiesPerPage,
//       search: debouncedSearch,
//       sortBy: sortByField,
//       sortOrder: sortOrderDir,
//     });
//   }, [currentPage, debouncedSearch, sortOption]);

//   /* ================= DEBOUNCE ================= */

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//     }, 500);

//     return () => clearTimeout(handler);
//   }, [searchQuery]);

//   const handleClearSearch = () => {
//     setSearchQuery("");
//     setDebouncedSearch("");
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleViewProperty = (propertyId: string) => {
//     navigate(`/admin/properties/${propertyId}`);
//   };

//   /* ================= ACTIONS ================= */

//   const handleApprove = async (propertyId: string) => {
//     if (!window.confirm("Do you want to approve the property")) return;
//     try {
//       await approveProperty(propertyId);
//       toast.success("Property approved successfully!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to approve property");
//     }
//   };

//   const handleReject = async (propertyId: string) => {
//     if (!window.confirm("Do you want to reject the property")) return;
//     try {
//       await rejectProperty(propertyId);
//       toast.success("Property rejected successfully!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to reject property");
//     }
//   };

//   const handleBlock = async (propertyId: string) => {
//     if (!window.confirm("Do you want to block the property")) return;
//     try {
//       await blockPropertyByAdmin(propertyId);
//       toast.success("Property blocked successfully!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to block property");
//     }
//   };

//   const handleUnblock = async (propertyId: string) => {
//     if (!window.confirm("Do you want to unblock property")) return;
//     try {
//       await unblockPropertyByAdmin(propertyId);
//       toast.success("Property unblocked successfully!");
//     } catch (error: any) {
//       toast.error(error.message || "Failed to unblock property");
//     }
//   };

//   /* ================= LOADING LOGIC ================= */

//   // Full page loader only on first load
//   if (isLoading && properties.length === 0) {
//     return (
//       // <AdminLayout>
//         <div className="flex items-center justify-center min-h-[400px]">
//           <div className="text-lg text-gray-600">
//             Loading properties...
//           </div>
//         </div>
//       // </AdminLayout>
//     );
//   }

//   return (
//     // <AdminLayout>
//       <div className="space-y-6 p-6">
//         {/* HEADER */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <h1 className="text-2xl font-semibold text-gray-800">
//             Property Management
//           </h1>

//           <div className="flex gap-4 flex-wrap">
//             {/* SEARCH */}
//             <div className="relative w-full md:w-64">
//               <input
//                 type="text"
//                 placeholder="Search properties..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setCurrentPage(1);
//                 }}
//                 className="w-full border px-3 py-2 rounded pr-8"
//               />
//               {searchQuery && (
//                 <button
//                   onClick={handleClearSearch}
//                   className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//                 >
//                   ❌
//                 </button>
//               )}
//             </div>

//             {/* SORT */}
//             <select
//               value={sortOption}
//               onChange={(e) => setSortOption(e.target.value)}
//               className="px-4 py-2 border rounded-lg bg-white"
//             >
//               <option value="createdAt-desc">Newest</option>
//               <option value="createdAt-asc">Oldest</option>
//               <option value="pricePerMonth-asc">Price: Low → High</option>
//               <option value="pricePerMonth-desc">Price: High → Low</option>
//             </select>
//           </div>
//         </div>

//         {/* TABLE */}
//         <div className="relative bg-white shadow rounded-lg overflow-hidden">
//           {/* Soft Updating Indicator */}
//           {isLoading && properties.length > 0 && (
//             <div className="absolute top-2 right-4 text-xs text-gray-400">
//               Updating...
//             </div>
//           )}

//           {error && (
//             <div className="p-4 text-center text-red-500">{error}</div>
//           )}

//           {properties.length === 0 && !isLoading ? (
//             <p className="p-6 text-gray-500 text-center">
//               No properties found.
//             </p>
//           ) : (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
//                     Image
//                   </th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
//                     Title
//                   </th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
//                     Location
//                   </th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
//                     Price / Month
//                   </th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
//                     Status
//                   </th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
//                     Created At
//                   </th>
//                   <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-200">
//                 {properties.map((p) => (
//                   <tr key={p.id} className="hover:bg-gray-50 transition">
//                     <td className="px-6 py-4">
//                       {p.images?.length > 0 ? (
//                         <img
//                           src={p.images[0]}
//                           alt={p.title}
//                           className="w-16 h-16 object-cover rounded"
//                         />
//                       ) : (
//                         <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-400 rounded">
//                           No Image
//                         </div>
//                       )}
//                     </td>

//                     <td className="px-6 py-4 text-sm font-medium text-gray-900">
//                       {p.title}
//                     </td>

//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {p.district}, {p.state}
//                     </td>

//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       ₹{p.pricePerMonth}
//                     </td>

//                     <td className="px-6 py-4 text-sm">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs ${
//                           p.status === "active"
//                             ? "bg-green-100 text-green-800"
//                             : p.status === "pending"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : p.status === "blocked"
//                             ? "bg-red-100 text-red-800"
//                             : p.status === "booked"
//                             ? "bg-blue-100 text-blue-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {p.status}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {p.createdAt
//                         ? new Date(p.createdAt).toLocaleDateString()
//                         : "N/A"}
//                     </td>

//                     <td className="px-6 py-4 text-sm">
//                       <div className="flex items-center gap-3">
//                         {p.status === "pending" && (
//                           <>
//                             <button
//                               onClick={() => handleApprove(p.id)}
//                               className="text-green-600 hover:text-green-800"
//                             >
//                               <CheckCircle size={18} />
//                             </button>
//                             <button
//                               onClick={() => handleReject(p.id)}
//                               className="text-red-600 hover:text-red-800"
//                             >
//                               <XCircle size={18} />
//                             </button>
//                           </>
//                         )}

//                         {p.status === "active" && (
//                           <button
//                             onClick={() => handleBlock(p.id)}
//                             className="text-red-600 hover:text-red-800"
//                           >
//                             <Ban size={18} />
//                           </button>
//                         )}

//                         {p.status === "blocked" && (
//                           <button
//                             onClick={() => handleUnblock(p.id)}
//                             className="text-green-600 hover:text-green-800"
//                           >
//                             <Ban size={18} />
//                           </button>
//                         )}

//                         <button
//                           onClick={() => handleViewProperty(p.id)}
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           <Eye size={16} />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>

//         {/* PAGINATION */}
//         {totalPages > 1 && (
//           <div className="flex justify-center items-center gap-2 pt-4">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//               className="px-3 py-1 border rounded disabled:opacity-50"
//             >
//               Prev
//             </button>

//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => handlePageChange(i + 1)}
//                 className={`px-3 py-1 border rounded ${
//                   currentPage === i + 1 ? "bg-blue-500 text-white" : ""
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//               className="px-3 py-1 border rounded disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     // </AdminLayout>
//   );
// }

// export default AdminProperties;