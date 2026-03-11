
import { useEffect, useState } from "react";
import { FaCheck, FaTimes, FaEye, FaSearch } from "react-icons/fa";
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
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwnerBookings();
  }, [page, limit, search, status, paymentStatus, bookingType, sortBy, sortOrder]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setFilters({ search: searchTerm, page: 1 });
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case "confirmed":
        return { text: "Confirmed", color: "bg-green-100 text-green-800" };
      case "cancelled":
        return { text: "Cancelled", color: "bg-red-100 text-red-800" };
      case "completed":
        return { text: "Completed", color: "bg-blue-100 text-blue-800" };
      default:
        return { text: status || "Unknown", color: "bg-gray-100 text-gray-600" };
    }
  };

  const handleOwnerCancel = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await fetchOwnerCancelBooking(bookingId);
    } catch {
      alert("Failed to cancel booking");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
        Owner Bookings
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="relative w-full sm:w-64">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user / property"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-indigo-500"
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
          onChange={(e) => setFilters({ paymentStatus: e.target.value, page: 1 })}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Payments</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          value={bookingType}
          onChange={(e) =>
            setFilters({
              bookingType: e.target.value
                ? (e.target.value as "upcoming" | "past" | "ongoing")
                : undefined,
              page: 1,
            })
          }
          className="border px-3 py-2 rounded"
        >
          <option value="">All Bookings</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="ongoing">Ongoing</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
          <h2 className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</h2>
          <p className="text-xl font-bold">{total}</p>
        </div>
      </div>

      {/* Booking Table */}
      <div className="overflow-x-auto rounded-lg shadow-sm bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
                Booking ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
                User
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
                Property
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
                Move-In
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
                End Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
                Guests
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
                Payment
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-gray-200">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {bookings.length > 0 ? (
              bookings.map((b) => {
                const badge = getStatusBadge(b.bookingStatus);
                return (
                  <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                    <td className="px-4 py-3 text-sm">{b.bookingId}</td>
                    <td className="px-4 py-3 text-sm">{b.user?.name || "N/A"}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <img
                        src={b.property.images?.[0] || "https://via.placeholder.com/50"}
                        alt={b.property.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-xs">{b.property.title}</span>
                        <span className="text-gray-500 text-sm truncate max-w-xs">{b.property.city}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {new Date(b.moveInDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {new Date(b.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">{b.guests}</td>
                    <td className="px-4 py-3 text-sm">{b.paymentStatus}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 text-xs rounded-full ${badge.color}`}>
                        {badge.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => handleOwnerCancel(b.id)}
                        disabled={b.bookingStatus !== "confirmed"}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded disabled:opacity-50"
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                      <button
                        onClick={() => navigate(`/owner/bookings/${b.id}`)}
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
                  <td colSpan={9} className="text-center py-10 text-gray-500">
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
            className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-indigo-600 text-white" : ""}`}
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
  );
};

export default OwnerBookings;

