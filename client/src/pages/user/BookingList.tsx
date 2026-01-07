

import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import { useNavigate } from "react-router-dom";

const BookingList = () => {
  const {
    bookings,
    page,
    totalPages,
    search,
    sortBy,
    sortOrder,
    status,
    startDate,
    endDate,
    setFilters,
    fetchBookings,
    bookingType
  } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState(search || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const navigate = useNavigate();


  // useEffect(() => {
  //   const delay = setTimeout(() => {
  //     setDebouncedSearch(searchQuery);
  //     setFilters({ search: searchQuery, page: 1 });
  //   }, 1000);
  //   return () => clearTimeout(delay);
  // }, [searchQuery]);

  // useEffect(() => {
  //   fetchBookings();
  // }, [page, debouncedSearch, sortBy, sortOrder, status, startDate, endDate]);

  useEffect(() => {
  const delay = setTimeout(() => {
    setFilters({ search: searchQuery, page: 1 });
  }, 1000);

  return () => clearTimeout(delay);
}, [searchQuery]);
useEffect(() => {
  fetchBookings();
}, [page, search, sortBy, sortOrder, status, startDate, endDate,bookingType]);



  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-28 px-4 md:px-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/2">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 pl-12 pr-4 rounded-full bg-white shadow-md focus:ring-2 focus:ring-blue-700 outline-none text-gray-700"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {/* Sort By */}
            <select
              value={
                sortBy === "moveInDate" && sortOrder === "asc"
                  ? "earliest"
                  : sortBy === "moveInDate" && sortOrder === "desc"
                  ? "latest"
                  : ""
              }
              onChange={(e) => {
                if (e.target.value === "earliest") setFilters({ sortBy: "moveInDate", sortOrder: "asc", page: 1 });
                else if (e.target.value === "latest") setFilters({ sortBy: "moveInDate", sortOrder: "desc", page: 1 });
              }}
              className="border px-3 py-2 rounded-lg shadow-sm bg-white"
            >
              <option value="">Sort By</option>
              <option value="earliest">Earliest Move In</option>
              <option value="latest">Latest Move In</option>
            </select>

            {/* Status */}
            <select
              value={status}
              onChange={(e) => setFilters({ status: e.target.value, page: 1 })}
              className="border px-3 py-2 rounded-lg shadow-sm bg-white"
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Past / Upcoming */}
            {/* <select
              onChange={(e) => {
                const type = e.target.value;
                if (type === "upcoming") {
                  setFilters({ startDate: new Date().toISOString(), endDate: undefined, page: 1 });
                } else if (type === "past") {
                  setFilters({ endDate: new Date().toISOString(), startDate: undefined, page: 1 });
                } else {
                  setFilters({ startDate: undefined, endDate: undefined, page: 1 });
                }
              }}
              className="border px-3 py-2 rounded-lg shadow-sm bg-white"
            >
              <option value="">All Bookings</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select> */}
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
        </div>
      
        {/* Booking Cards */}
<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {bookings.map((b) => (
    <div
      key={b.id}
      onClick={() => navigate(`/user/bookings/${b.id}`)}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex gap-4 items-center"
    >
      {/* Property Image */}
      {b.property?.images && b.property.images.length > 0 ? (
        <img
          src={b.property.images[0]}
          alt={b.property.title}
          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
        />
      ) : (
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
          No Image
        </div>
      )}

      {/* Text Content */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h3 className="text-md font-semibold text-gray-800">
            {b.property?.title || "Unnamed Property"}
          </h3>
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              b.paymentStatus === "completed"
                ? "bg-green-100 text-green-800"
                : b.paymentStatus === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
           Booking is  {b.bookingStatus || "Pending"}
          </span>
        </div>

        <p className="text-gray-600 text-sm">
          <span className="font-medium">Move In:</span>{" "}
          {new Date(b.moveInDate).toLocaleDateString()}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Guests:</span> {b.guests}
        </p>
        <p className="text-gray-600 text-sm">
          <span className="font-medium">Total:</span> ${b.totalCost}
        </p>
      </div>
    </div>
  ))}
</div>


        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page <= 1}
            onClick={() => setFilters({ page: page - 1 })}
            className="px-4 py-2 bg-blue-950 text-white rounded disabled:opacity-40 hover:bg-blue-900 transition"
          >
            Previous
          </button>
          <span className="font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setFilters({ page: page + 1 })}
            className="px-4 py-2 bg-blue-950 text-white rounded disabled:opacity-40 hover:bg-blue-900 transition"
          >
            Next
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingList;
