

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BookingFailure: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const reason =
    location.state?.reason ||
    "Your payment could not be completed. Please try again.";

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg text-center">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Payment Failed
        </h1>

        {/* Reason */}
        <p className="text-gray-600 mb-8 leading-relaxed">{reason}</p>

        {/* Optional booking details if available */}
        {location.state?.booking && location.state?.property && (
          <div className="text-gray-700 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm max-w-md mx-auto">
              <p>
                <span className="font-semibold">Property:</span>{" "}
                {location.state.property.title}
              </p>

              <p>
                <span className="font-semibold">Guests:</span>{" "}
                {location.state.booking.guests}
              </p>

              <p>
                <span className="font-semibold">Move-In Date:</span>{" "}
                {new Date(location.state.booking.moveInDate).toLocaleDateString()}
              </p>

              <p>
                <span className="font-semibold">Rental Period:</span>{" "}
                {location.state.booking.rentalPeriod} months
              </p>

              <p className="sm:col-span-2">
                <span className="font-semibold">Location:</span>{" "}
                {`${location.state.property.houseNumber}, ${location.state.property.street}, ${location.state.property.city}`}
              </p>

              <p className="sm:col-span-2 text-lg font-semibold text-red-600">
                Total: ₹{location.state.booking.totalCost}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/user/payment")}
            className="w-full rounded-xl bg-red-600 py-3 text-white font-medium hover:bg-red-700 transition"
          >
            Try Payment Again
          </button>

          <button
            onClick={() => navigate("/user/bookings")}
            className="w-full rounded-xl border border-gray-300 py-3 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            View My Bookings
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingFailure;


