

import { useEffect, useState } from "react";
import { FaTimes, FaEye, FaSearch } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";


import PageHeader from "../../components/Admin/common/PageHeader";
import SearchInput from "../../components/Admin/common/SearchInput";
import FilterSelect from "../../components/Admin/common/FilterSelect";
import DataTable from "../../components/Admin/common/DataTable";
import Pagination from "../../components/Admin/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";
import { toast } from "react-toastify";

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
  { value: "past", label: "Past" },
  { value: "ongoing", label: "Ongoing" },
];


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
      {status || "Unknown"}
    </span>
  );
};


const OwnerBookings = () => {
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
    fetchOwnerBookings,
    fetchOwnerCancelBooking,
  } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState(search);
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    action: null | (() => Promise<void>);
  }>({ title: "", message: "", action: null });

  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchOwnerBookings();
  }, [page, limit, search, status, paymentStatus, bookingType, sortBy, sortOrder]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters({ search: searchTerm, page: 1 });
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilters({ search: "", page: 1 });
  };

    const openConfirmModal = (title: string, message: string, action: () => Promise<void>) => {
    setConfirmConfig({ title, message, action });
    setIsConfirmOpen(true);
  };

  // const handleOwnerCancel = async (bookingId: string) => {
  //   if (!window.confirm("Are you sure you want to cancel this booking?")) return;
  //   try {
  //     await fetchOwnerCancelBooking(bookingId);
  //   } catch {
  //     alert("Failed to cancel booking");
  //   }
  // };

    const handleOwnerCancel = (bookingId: string) => {
    openConfirmModal(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      async () => {
        try {
          setModalLoading(true);
          await fetchOwnerCancelBooking(bookingId);
          toast.success("Booking cancelled successfully");
        } catch (err) {
          toast.error("Failed to cancel booking");
        } finally {
          setIsConfirmOpen(false);
          setModalLoading(false);
        }
      }
    );
  };

  if (isLoading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading bookings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <PageHeader
        title="Owner Bookings"
        subtitle={total ? `${total} total bookings` : undefined}
      >
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={handleClearSearch}
          placeholder="Search by user / property"
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
              bookingType: v
                ? (v as "upcoming" | "past" | "ongoing")
                : undefined,
              page: 1,
            })
          }
          options={bookingTypeOptions}
          ariaLabel="Filter by booking type"
        />
      </PageHeader>

      {/* ─Summary card ─*/}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Total Bookings
          </p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{total}</p>
        </div>
      </div>

      {/* ─ Error ─ */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* ─ Table ─ */}
      <DataTable
        loading={isLoading && bookings.length > 0}
        isEmpty={bookings.length === 0 && !isLoading}
        emptyMessage="No bookings found."
        colSpan={9}
      >
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {[
              "Booking ID",
              "User",
              "Property",
              "Move-In",
              "End Date",
              "Guests",
              "Payment",
              "Status",
              "Actions",
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
              {/* Booking ID */}
              <td className="px-4 py-4 text-sm font-mono text-slate-700">
                {b.bookingId}
              </td>

              {/* User */}
              <td className="px-4 py-4 text-sm text-slate-600">
                {b.user?.name || "N/A"}
              </td>

              {/* Property */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2.5 min-w-[180px]">
                  <img
                    src={b.property.images?.[0] || "https://via.placeholder.com/50"}
                    alt={b.property.title}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate max-w-[130px]">
                      {b.property.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate max-w-[130px]">
                      {b.property.city}
                    </p>
                  </div>
                </div>
              </td>

              {/* Move-In */}
              <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                {new Date(b.moveInDate).toLocaleDateString()}
              </td>

              {/* End Date */}
              <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                {new Date(b.endDate).toLocaleDateString()}
              </td>

              {/* Guests */}
              <td className="px-4 py-4 text-sm text-slate-600">{b.guests}</td>

              {/* Payment */}
              <td className="px-4 py-4 text-sm capitalize text-slate-600">
                {b.paymentStatus}
              </td>

              {/* Status */}
              <td className="px-4 py-4">
                <BookingStatusBadge status={b.bookingStatus} />
              </td>

              {/* Actions */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOwnerCancel(b.id)}
                    disabled={b.bookingStatus !== "confirmed"}
                    title="Cancel"
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <FaTimes size={12} />
                  </button>
                  <button
                    onClick={() => navigate(`/owner/bookings/${b.id}`)}
                    title="View"
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                  >
                    <FaEye size={12} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>

      {/* ─ Pagination ─ */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalCount={total}
        limit={limit}
        itemLabel="bookings"
        onPageChange={(p) => setFilters({ page: p })}
      />
       <ConfirmModal
        isOpen={isConfirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isLoading={modalLoading}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => confirmConfig.action && confirmConfig.action()}
      />
    </div>
  );
};

export default OwnerBookings;


// import { useEffect, useState } from "react";
// import { FaCheck, FaTimes, FaEye, FaSearch } from "react-icons/fa";
// import { useAuthStore } from "../../stores/authStore";
// import { useNavigate } from "react-router-dom";

// const OwnerBookings = () => {
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
//     fetchOwnerBookings,
//     fetchOwnerCancelBooking,
//   } = useAuthStore();

//   const [searchTerm, setSearchTerm] = useState(search);
//   const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchOwnerBookings();
//   }, [page, limit, search, status, paymentStatus, bookingType, sortBy, sortOrder]);

//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchTerm);
//       setFilters({ search: searchTerm, page: 1 });
//     }, 500);
//     return () => clearTimeout(handler);
//   }, [searchTerm]);

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "pending":
//         return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
//       case "confirmed":
//         return { text: "Confirmed", color: "bg-green-100 text-green-800" };
//       case "cancelled":
//         return { text: "Cancelled", color: "bg-red-100 text-red-800" };
//       case "completed":
//         return { text: "Completed", color: "bg-blue-100 text-blue-800" };
//       default:
//         return { text: status || "Unknown", color: "bg-gray-100 text-gray-600" };
//     }
//   };

//   const handleOwnerCancel = async (bookingId: string) => {
//     if (!window.confirm("Are you sure you want to cancel this booking?")) return;
//     try {
//       await fetchOwnerCancelBooking(bookingId);
//     } catch {
//       alert("Failed to cancel booking");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
//         Owner Bookings
//       </h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 mb-6 items-center">
//         <div className="relative w-full sm:w-64">
//           <FaSearch className="absolute left-3 top-3 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by user / property"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-10 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => {
//                 setSearchTerm("");
//                 setFilters({ search: "", page: 1 });
//               }}
//               className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//               aria-label="Clear search"
//             >
//               ❌
//             </button>
//           )}
//         </div>

//         <select
//           value={status}
//           onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
//           className="border px-3 py-2 rounded"
//         >
//           <option value="">All Status</option>
//           <option value="pending">Pending</option>
//           <option value="confirmed">Confirmed</option>
//           <option value="cancelled">Cancelled</option>
//           <option value="completed">Completed</option>
//         </select>

//         <select
//           value={paymentStatus}
//           onChange={(e) => setFilters({ paymentStatus: e.target.value, page: 1 })}
//           className="border px-3 py-2 rounded"
//         >
//           <option value="">All Payments</option>
//           <option value="pending">Pending</option>
//           <option value="completed">Completed</option>
//           <option value="failed">Failed</option>
//           <option value="refunded">Refunded</option>
//         </select>

//         <select
//           value={bookingType}
//           onChange={(e) =>
//             setFilters({
//               bookingType: e.target.value
//                 ? (e.target.value as "upcoming" | "past" | "ongoing")
//                 : undefined,
//               page: 1,
//             })
//           }
//           className="border px-3 py-2 rounded"
//         >
//           <option value="">All Bookings</option>
//           <option value="upcoming">Upcoming</option>
//           <option value="past">Past</option>
//           <option value="ongoing">Ongoing</option>
//         </select>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
//         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//           <h2 className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</h2>
//           <p className="text-xl font-bold">{total}</p>
//         </div>
//       </div>

//       {/* Booking Table */}
//       <div className="overflow-x-auto rounded-lg shadow-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
//         <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
//           <thead className="bg-slate-100 dark:bg-slate-700">
//             <tr>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
//                 Booking ID
//               </th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
//                 User
//               </th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
//                 Property
//               </th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
//                 Move-In
//               </th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
//                 End Date
//               </th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
//                 Guests
//               </th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
//                 Payment
//               </th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
//                 Status
//               </th>
//               <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
//             {bookings.length > 0 ? (
//               bookings.map((b) => {
//                 const badge = getStatusBadge(b.bookingStatus);
//                 return (
//                   <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
//                     <td className="px-4 py-3 text-sm">{b.bookingId}</td>
//                     <td className="px-4 py-3 text-sm">{b.user?.name || "N/A"}</td>
//                     <td className="px-4 py-3 flex items-center gap-2">
//                       <img
//                         src={b.property.images?.[0] || "https://via.placeholder.com/50"}
//                         alt={b.property.title}
//                         className="w-12 h-12 rounded object-cover"
//                       />
//                       <div className="flex flex-col">
//                         <span className="font-medium truncate max-w-xs">{b.property.title}</span>
//                         <span className="text-gray-500 text-sm truncate max-w-xs">{b.property.city}</span>
//                       </div>
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">
//                       {new Date(b.moveInDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap text-sm">
//                       {new Date(b.endDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-4 py-3 text-sm">{b.guests}</td>
//                     <td className="px-4 py-3 text-sm">{b.paymentStatus}</td>
//                     <td className="px-4 py-3 text-sm">
//                       <span className={`px-3 py-1 text-xs rounded-full ${badge.color}`}>
//                         {badge.text}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 flex gap-2">
//                       <button
//                         onClick={() => handleOwnerCancel(b.id)}
//                         disabled={b.bookingStatus !== "confirmed"}
//                         className="p-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
//                         title="Cancel"
//                       >
//                         <FaTimes />
//                       </button>
//                       <button
//                         onClick={() => navigate(`/owner/bookings/${b.id}`)}
//                         className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
//                         title="View"
//                       >
//                         <FaEye />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               !isLoading && (
//                 <tr>
//                   <td colSpan={9} className="text-center py-10 text-gray-500">
//                     No bookings found
//                   </td>
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-center items-center gap-2 p-4">
//         <button
//           disabled={page === 1}
//           onClick={() => setFilters({ page: page - 1 })}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Prev
//         </button>
//         {Array.from({ length: totalPages }, (_, i) => (
//           <button
//             key={i}
//             onClick={() => setFilters({ page: i + 1 })}
//             className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-indigo-600 text-white" : ""}`}
//           >
//             {i + 1}
//           </button>
//         ))}
//         <button
//           disabled={page === totalPages}
//           onClick={() => setFilters({ page: page + 1 })}
//           className="px-3 py-1 border rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default OwnerBookings;
