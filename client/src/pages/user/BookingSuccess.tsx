

import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const BookingSuccess: React.FC = () => {
  const location = useLocation();
  const { booking, property} = location.state || {};

  const clearBookingData = useAuthStore((state) => state.clearBookingData);

  useEffect(() => {
    clearBookingData();
  }, [clearBookingData]);

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center">

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Booking Confirmed!
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment was successful and your booking has been confirmed.
        </p>

        {booking && property && (
          // <div className="text-left text-gray-700 mb-8">

          //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="text-gray-700 mb-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm max-w-md mx-auto">

              <p>
                <span className="font-semibold">Property:</span>{" "}
                {property.title}
              </p>

              <p>
                <span className="font-semibold">Guests:</span>{" "}
                {booking.guests}
              </p>

              <p>
                <span className="font-semibold">Move-In Date:</span>{" "}
                {new Date(booking.moveInDate).toLocaleDateString()}
              </p>

              <p>
                <span className="font-semibold">Rental Period:</span>{" "}
                {booking.rentalPeriod} months
              </p>

              <p className="sm:col-span-2">
                <span className="font-semibold">Location:</span>{" "}
                {`${property.houseNumber}, ${property.street}, ${property.city}`}
              </p>

              <p className="sm:col-span-2 text-lg font-semibold text-green-600">
                Total Paid: ₹{booking.totalCost}
              </p>

            </div>

          </div>
        )}

        <Link
          to="/user/bookings"
          className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
        >
          View My Bookings
        </Link>

      </div>
    </div>
  );
};

export default BookingSuccess;




