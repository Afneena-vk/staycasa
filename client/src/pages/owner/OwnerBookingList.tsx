
import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaEye, FaSearch } from "react-icons/fa";
import OwnerLayout from "../../layouts/owner/OwnerLayout";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

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
    startDate,
    endDate,
    bookingType,
    sortBy,
    sortOrder,
    isLoading,
    error,
    setFilters,
    fetchOwnerBookings,
    fetchOwnerCancelBooking
    // updateBookingStatus,
  } = useAuthStore();

  const [searchTerm, setSearchTerm] = useState(search);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const navigate = useNavigate();


  // useEffect(() => {
  //   fetchOwnerBookings();
  // }, [page, sortBy, sortOrder, debouncedSearch]);
    useEffect(() => {
    fetchOwnerBookings();
  }, [page, limit, search, status, paymentStatus, startDate, endDate, sortBy, sortOrder, bookingType]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setFilters({ search: searchTerm, page: 1 });
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // const handleBookingAction = async (bookingId: string, action: "confirm" | "cancel") => {
  //   try {
  //     await updateBookingStatus(bookingId, action);
  //     fetchOwnerBookings();
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to update booking status.");
  //   }
  // };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "Pending", color: "bg-yellow-100 text-yellow-600" };
      case "confirmed":
        return { text: "Confirmed", color: "bg-green-100 text-green-600" };
      case "cancelled":
        return { text: "Cancelled", color: "bg-red-100 text-red-600" };
      case "completed":
        return { text: "Completed", color: "bg-blue-100 text-blue-600" };
      default:
        return { text: status || "Unknown", color: "bg-gray-100 text-gray-600" };
    }
  };

  const handleOwnerCancel = async (bookingId: string) => {
  const confirm = window.confirm(
    "Are you sure you want to cancel this booking?"
  );
  if (!confirm) return;

  try {
    await fetchOwnerCancelBooking(bookingId);
  } catch (err) {
    alert("Failed to cancel booking");
  }
};

  return (
    <OwnerLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
          Owner Bookings
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="relative w-full sm:w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user / property"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
    <button
      onClick={() => {
        setSearchTerm("");              
        setFilters({ search: "", page: 1 });  
      }}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
      aria-label="Clear search"
    >
      ❌
    </button>
  )}
          </div>

          <select
            value={status}
            // onChange={(e) => { setFilters({ status: e.target.value, page: 1 }); fetchOwnerBookings(); }}
              onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={paymentStatus}
            //onChange={(e) => { setFilters({ paymentStatus: e.target.value, page: 1 }); fetchOwnerBookings(); }}
             onChange={(e) => setFilters({ paymentStatus: e.target.value, page: 1 })}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          {/* <input
            type="date"
            value={startDate || ""}
            onChange={(e) =>
              setFilters({ startDate: e.target.value || undefined, page: 1 })
            }
            className="border px-3 py-2 rounded"
          /> */}

          {/* End Date */}
          {/* <input
            type="date"
            value={endDate || ""}
            onChange={(e) =>
              setFilters({ endDate: e.target.value || undefined, page: 1 })
            }
            className="border px-3 py-2 rounded"
          /> */}

        <select
            value={bookingType}
            //onChange={(e) => { setFilters({ paymentStatus: e.target.value, page: 1 }); fetchOwnerBookings(); }}
             onChange={(e) => setFilters({ bookingType: e.target.value ? (e.target.value as "upcoming" | "past" | "ongoing") : undefined, page: 1 })}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Bookings</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="ongoing">Ongoing</option>
            
          </select>


        </div>

        {/* Loading & Error */}
        {isLoading && <p className="text-center text-gray-500">Loading bookings...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* Summary Cards */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h2 className="text-sm text-slate-500">Total Bookings</h2>
              <p className="text-xl font-bold">{total}</p>
            </div>
            {/* <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h2 className="text-sm text-slate-500">Pending</h2>
              <p className="text-xl font-bold">{bookings.filter(b => b.bookingStatus === "pending").length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h2 className="text-sm text-slate-500">Confirmed</h2>
              <p className="text-xl font-bold">{bookings.filter(b => b.bookingStatus === "confirmed").length}</p>
      

            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h2 className="text-sm text-slate-500">Cancelled</h2>
              <p className="text-xl font-bold">{bookings.filter(b => b.bookingStatus === "cancelled").length}</p>
            </div> */}
          </div>
        )}

        {/* Booking Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-2">Booking ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Property</th>
                <th className="px-4 py-2">Move-In</th>
                <th className="px-4 py-2">End Date</th>
                <th className="px-4 py-2">Guests</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((b) => {
                  const badge = getStatusBadge(b.bookingStatus);
                  return (
                    <tr key={b.id} className="border-t dark:border-slate-700">
                      <td className="px-4 py-2">{b.bookingId}</td>
                      <td className="px-4 py-2">{b.user?.name || "N/A"}</td>
                      <td className="px-4 py-2 flex items-center gap-2 min-w-[200px]">
                        <img
                          src={b.property.images?.[0] || "https://via.placeholder.com/50"}
                          alt={b.property.title}
                          className="w-16 h-16 rounded object-cover  flex-shrink-0"
                        />
                        {/* <div>
                          <div className="font-medium">{b.property.title}</div>
                          <div className="text-sm text-gray-500">{b.property.city}</div>
                        </div> */}
                      <div className="flex flex-col">
                          <div className="font-medium truncate max-w-xs">{b.property.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{b.property.city}</div>
                      </div>
                      </td>
                      {/* <td className="px-4 py-2">{new Date(b.moveInDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{new Date(b.endDate).toLocaleDateString()}</td> */}
                      <td className="px-4 py-2 whitespace-nowrap">{new Date(b.moveInDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 whitespace-nowrap">{new Date(b.endDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{b.guests}</td>
                      <td className="px-4 py-2">{b.paymentStatus}</td>
                      <td className="px-4 py-2">
                        <span className={`px-3 py-1 text-xs rounded-full ${badge.color}`}>
                          {badge.text}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        {/* <button
                          //onClick={() => handleBookingAction(b.id, "confirm")}
                          className="p-2 bg-green-500 hover:bg-green-600 text-white rounded"
                          disabled={b.bookingStatus !== "pending"}
                          title="Confirm"
                        >
                          <FaCheck />
                        </button> */}
                        <button
                          onClick= {() => handleOwnerCancel(b.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                          disabled={b.bookingStatus !== "confirmed"}
                          title="Cancel"
                        >
                          <FaTimes />
                        </button>
                        <button
                          onClick={() =>  navigate(`/owner/bookings/${b.id}`)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                          title="View"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                !isLoading && (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 p-4">
          <button
            disabled={page === 1}
            onClick={() => setFilters({ page: page - 1 })}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setFilters({ page: i + 1 })}
              className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-500 text-white" : ""}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={page === totalPages}
            onClick={() => setFilters({ page: page + 1 })}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerBookings;

