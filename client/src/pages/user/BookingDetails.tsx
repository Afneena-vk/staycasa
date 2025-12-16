

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";

const BookingDetails = () => {
  const { bookingId } = useParams();
//   const { selectedBooking, fetchBookingDetails, cancelBooking } =
 const { selectedBooking, fetchBookingDetails} = useAuthStore();
 const navigate = useNavigate();


  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails(bookingId);
    }
  }, [bookingId]);

  if (!selectedBooking) {
    return <div className="pt-40 text-center">Loading...</div>;
  }

  const b = selectedBooking;

  const moveInDate = new Date(b.moveInDate);
  const endDate = new Date(b.endDate);
  const today = new Date();

  const canCancel = today < moveInDate;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 pt-28 px-4 md:px-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Booking ID</p>
              <h2 className="font-semibold text-lg">{b.bookingId}</h2>

              <div className="flex gap-2 mt-2">
                {/* <span className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-800 capitalize">
                 Booking is {b.bookingStatus}
                </span>
                <span className="px-3 py-1 text-xs rounded bg-green-100 text-green-800 capitalize">
                 Payment {b.paymentStatus}
                </span> */}
              </div>
            </div>

            {canCancel && (
              <button
                // onClick={() => cancelBooking(b.id)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Cancel Booking
              </button>
            )}
          </div>

          {/* PROPERTY SUMMARY */}
          <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-3 gap-6">
            {/* Image */}
            <div
              className="cursor-pointer group"
              onClick={() => navigate(`/user/properties/${b.property.id}`)}
              >
              {b.property?.images?.length > 0 ? (
                <img
                  src={b.property.images[0]}
                  alt={b.property.title}
                  className="w-full h-40 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              {/* Property meta */}
              <div className="flex justify-between text-sm text-gray-600 mt-3">
                <span>{b.property.bedrooms} Beds</span>
                <span>{b.property.bathrooms} Baths</span>
                <span>{b.property.furnishing}</span>
              </div>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <h1 className="text-2xl font-semibold">
                {b.property.title}
              </h1>
              <p className="text-gray-600 mt-1">
                {b.property.description}
              </p>
            </div>
          </div>

          {/* BOOKING INFO */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Booking Information</h3>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Move-in</p>
                <p className="font-medium">{moveInDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Duration</p>
                <p className="font-medium">{b.rentalPeriod} months</p>
              </div>
              <div>
                <p className="text-gray-500">End Date</p>
                <p className="font-medium">{endDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Guests</p>
                <p className="font-medium">{b.guests}</p>
              </div>
            </div>
          </div>

          {/* PAYMENT INFO */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Payment Details</h3>

            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Rent / Month</p>
                <p className="font-medium">₹{b.rentPerMonth}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Cost</p>
                <p className="font-medium">₹{b.totalCost}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium capitalize">{b.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Property Address</h3>

            <p className="text-gray-700 text-sm leading-relaxed">
              {b.property.type}, {b.property.houseNumber}, {b.property.street},<br />
              {b.property.city}, {b.property.district}, {b.property.state} –{" "}
              {b.property.pincode}
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default BookingDetails;
