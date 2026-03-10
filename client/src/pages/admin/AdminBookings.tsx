
import { useEffect, useState } from "react";
import { FaSearch, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";


import PageHeader from "../../components/Admin/common/PageHeader";
import SearchInput from "../../components/Admin/common/SearchInput";
import FilterSelect from "../../components/Admin/common/FilterSelect";
import DataTable from "../../components/Admin/common/DataTable";
import Pagination from "../../components/Admin/common/Pagination";

const bookingStatusOptions = [
  { value: "", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

const paymentStatusOptions = [
  { value: "", label: "All Payments" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

const bookingTypeOptions = [
  { value: "", label: "All Bookings" },
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "past", label: "Past" },
];

// ─ Booking status badge (inline)
const BookingStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    completed: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
        styles[status] ?? "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
};

const AdminBookings = () => {
  const {
    bookings,
    page,
    limit,
    totalPages,
    total,
    search,
    status,
    paymentStatus,
    bookingType,
    sortBy,
    sortOrder,
    isLoading,
    error,
    setFilters,
    fetchAdminBookings,
  } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState(search);
  const navigate = useNavigate();

  
  useEffect(() => {
    fetchAdminBookings();
  }, [page, limit, search, status, paymentStatus, bookingType, sortBy, sortOrder]);

 
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({ search: searchTerm, page: 1 });
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilters({ search: "", page: 1 });
  };

  // ─Initial loader
  if (isLoading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading bookings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <PageHeader title="All Bookings" subtitle={total ? `${total} total bookings` : undefined}>
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={handleClearSearch}
          placeholder="Search booking / user / property"
          icon={<FaSearch size={13} />}
        />
        <FilterSelect
          value={status}
          onChange={(v) => setFilters({ status: v, page: 1 })}
          options={bookingStatusOptions}
          ariaLabel="Filter by booking status"
        />
        <FilterSelect
          value={paymentStatus}
          onChange={(v) => setFilters({ paymentStatus: v, page: 1 })}
          options={paymentStatusOptions}
          ariaLabel="Filter by payment status"
        />
        <FilterSelect
          value={bookingType ?? ""}
          onChange={(v) =>
            setFilters({
              bookingType: v ? (v as "upcoming" | "past" | "ongoing") : undefined,
              page: 1,
            })
          }
          options={bookingTypeOptions}
          ariaLabel="Filter by booking type"
        />
      </PageHeader>

      {/* ── Error ── */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* ── Table ── */}
      <DataTable
        loading={isLoading && bookings.length > 0}
        isEmpty={bookings.length === 0 && !isLoading}
        emptyMessage="No bookings found."
        colSpan={10}
      >
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {[
              "Booking ID",
              "User",
              "Owner",
              "Property",
              "Move-In",
              "End",
              "Amount",
              "Payment",
              "Status",
              "Action",
            ].map((h) => (
              <th
                key={h}
                className="px-4 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-50">
          {bookings.map((b) => (
            <tr
              key={b.id}
              className="hover:bg-slate-50/70 transition duration-100"
            >
              <td className="px-4 py-4 text-sm font-mono text-slate-700">{b.bookingId}</td>

              <td className="px-4 py-4 text-sm text-slate-600">{b.user?.email || "—"}</td>

              <td className="px-4 py-4 text-sm text-slate-600">{b.owner?.name || "—"}</td>

              {/* Property */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2.5 min-w-[200px]">
                  <img
                    src={b.property.images?.[0] || "https://via.placeholder.com/60"}
                    alt={b.property.title || "Property image"}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate max-w-[140px]">
                      {b.property.title}
                    </p>
                    <p className="text-xs text-slate-500">{b.property.city}</p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                {new Date(b.moveInDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                {new Date(b.endDate).toLocaleDateString()}
              </td>

              <td className="px-4 py-4 text-sm font-medium text-slate-700">₹{b.totalCost}</td>

              <td className="px-4 py-4 text-sm capitalize text-slate-600">{b.paymentStatus}</td>

              <td className="px-4 py-4">
                <BookingStatusBadge status={b.bookingStatus} />
              </td>

              {/* Action */}
              <td className="px-4 py-4">
                <button
                  onClick={() => navigate(`/admin/bookings/${b.id}`)}
                  title="View"
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  <FaEye size={13} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>

      {/* ── Pagination ── */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalCount={total}
        limit={limit}
        itemLabel="bookings"
        onPageChange={(p) => setFilters({ page: p })}
      />
    </div>
  );
};

export default AdminBookings;



// import { useEffect, useState } from "react";
// import { FaSearch, FaEye } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import AdminLayout from "../../layouts/admin/AdminLayout";
// import { useAuthStore } from "../../stores/authStore";

// const AdminBookings = () => {
//   const {
//     bookings,
//     page,
//     limit,
//     totalPages,
//     total,
//     search,
//     status,
//     paymentStatus,
//     bookingType,
//     sortBy,
//     sortOrder,
//     isLoading,
//     error,
//     setFilters,
//     fetchAdminBookings,
//   } = useAuthStore();

//   const [searchTerm, setSearchTerm] = useState(search);
//   //const [debouncedSearch, setDebouncedSearch] = useState("");
//   //const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();

//   // Fetch bookings
//   useEffect(() => {
//     fetchAdminBookings();
//   }, [
//     page,
//     limit,
//     search,
//     status,
//     paymentStatus,
//     bookingType,
//     sortBy,
//     sortOrder,
//   ]);


//   useEffect(() => {
//     const handler = setTimeout(() => {
//      // setDebouncedSearch(searchTerm);
//       setFilters({ search: searchTerm, page: 1 });
//     }, 1000);

//     return () => clearTimeout(handler);
//   }, [searchTerm]);

//   const handleClearSearch = () => {
//   setSearchTerm("");
//   //setDebouncedSearch("");
//   //setCurrentPage(1);
//   setFilters({ search: "", page: 1 });
// };



//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "confirmed":
//         return "bg-green-100 text-green-700";
//       case "cancelled":
//         return "bg-red-100 text-red-700";
//       case "completed":
//         return "bg-blue-100 text-blue-700";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   if (isLoading && bookings.length === 0) {
//   return (
//     // <AdminLayout>
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-lg text-gray-600">
//           Loading bookings...
//         </div>
//       </div>
//     // </AdminLayout>
//   );
// }

//   return (
//     // <AdminLayout>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
//           All Bookings
//         </h1>

//         {/* Filters */}
//         <div className="flex flex-wrap gap-3 mb-4">
//           {/* Search */}
//           <div className="relative w-full sm:w-64">
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search booking / user / property"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
//             />
//             {searchTerm && (
//     <button
//       onClick={handleClearSearch}
//       className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//       aria-label="Clear search"
//     >
//       ❌
//     </button>
//   )}
//           </div>

//           {/* Booking Status */}
//           <select
//             value={status}
//             onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
//             className="border px-3 py-2 rounded"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="confirmed">Confirmed</option>
//             <option value="cancelled">Cancelled</option>
//             <option value="completed">Completed</option>
//           </select>

//           {/* Payment Status */}
//           <select
//             value={paymentStatus}
//             onChange={(e) =>
//               setFilters({ paymentStatus: e.target.value, page: 1 })
//             }
//             className="border px-3 py-2 rounded"
//           >
//             <option value="">All Payments</option>
//             <option value="pending">Pending</option>
//             <option value="completed">Completed</option>
//             <option value="failed">Failed</option>
//             <option value="refunded">Refunded</option>
//           </select>

//           {/* Booking Type */}
//           <select
//             value={bookingType}
//             onChange={(e) =>
//               setFilters({
//                 bookingType: e.target.value
//                   ? (e.target.value as "upcoming" | "past" | "ongoing")
//                   : undefined,
//                 page: 1,
//               })
//             }
//             className="border px-3 py-2 rounded"
//           >
//             <option value="">All Bookings</option>
//             <option value="upcoming">Upcoming</option>
//             <option value="ongoing">Ongoing</option>
//             <option value="past">Past</option>
//           </select>
//         </div>

//         {/* Loading & Error */}

//         {error && (
//           <p className="text-center text-red-500">{error}</p>
//         )}

//         {/* Summary */}
//         {/* {bookings.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
//             <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow">
//               <h2 className="text-sm text-slate-500">Total Bookings</h2>
//               <p className="text-xl font-bold">{total}</p>
//             </div>
//           </div>
//         )} */}

//         {/* Table */}
//         <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl shadow relative">
//                     {isLoading && bookings.length > 0 && (
//             <div className="absolute top-2 right-4 text-xs text-gray-400">
//               Updating...
//             </div>
//           )}
//           <table className="min-w-full border-collapse">
//             <thead className="bg-slate-100 dark:bg-slate-700">
//               <tr>
//                 <th className="px-4 py-3 text-left">Booking ID</th>
//                 <th className="px-4 py-3 text-left">User</th>
//                 <th className="px-4 py-3 text-left">Owner</th>
//                 <th className="px-4 py-3 text-left">Property</th>
//                 <th className="px-4 py-3">Move-In</th>
//                 <th className="px-4 py-3">End</th>
//                 <th className="px-4 py-3">Amount</th>
//                 <th className="px-4 py-3">Payment</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {bookings.length > 0 ? (
//                 bookings.map((b) => (
//                   <tr
//                     key={b.id}
//                     className="border-t dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
//                   >
//                     <td className="px-4 py-3">{b.bookingId}</td>
//                     <td className="px-4 py-3">
//                       {b.user?.email || "—"}
//                     </td>
//                     <td className="px-4 py-3">
//                       {b.owner?.name || "—"}
//                     </td>                   
//                     <td className="px-4 py-3 flex items-center gap-2 min-w-[220px]">
//                       <img
//                         src={
//                           b.property.images?.[0] ||
//                           "https://via.placeholder.com/60"
//                         }
//                          alt={b.property.title || "Property image"}
//                         className="w-14 h-14 rounded object-cover"
//                       />
//                       <div>
//                         <div className="font-medium truncate max-w-xs">
//                           {b.property.title}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {b.property.city}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       {new Date(b.moveInDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       {new Date(b.endDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3">₹{b.totalCost}</td>
//                     <td className="px-4 py-3 capitalize">
//                       {b.paymentStatus}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-3 py-1 text-xs rounded-full ${getStatusBadge(
//                           b.bookingStatus
//                         )}`}
//                       >
//                         {b.bookingStatus}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <button
//                         onClick={() =>
//                           navigate(`/admin/bookings/${b.id}`)
//                         }
//                         className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
//                         title="View"
//                       >
//                         <FaEye />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 !isLoading && (
//                   <tr>
//                     <td
//                       colSpan={10}
//                       className="text-center py-10 text-gray-500"
//                     >
//                       No bookings found
//                     </td>
//                   </tr>
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="flex justify-center items-center gap-2 mt-6">
//           <button
//             disabled={page === 1}
//             onClick={() => setFilters({ page: page - 1 })}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>

//           {Array.from({ length: totalPages }, (_, i) => (
//             <button
//               key={i}
//               onClick={() => setFilters({ page: i + 1 })}
//               className={`px-3 py-1 border rounded ${
//                 page === i + 1 ? "bg-blue-500 text-white" : ""
//               }`}
//             >
//               {i + 1}
//             </button>
//           ))}

//           <button
//             disabled={page === totalPages}
//             onClick={() => setFilters({ page: page + 1 })}
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     // </AdminLayout>
//   );
// };

// export default AdminBookings;