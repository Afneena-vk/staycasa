
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
