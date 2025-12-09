
import React from "react";
import { Link, useLocation } from "react-router-dom";

const BookingSuccess: React.FC = () => {
 
  const location = useLocation();
  const { paymentId, orderId } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-700 mb-6">
          Your payment was successful and your booking has been confirmed.
        </p>

        
        {paymentId && orderId && (
          <div className="text-gray-600 mb-6 text-sm">
            <p>Payment ID: <span className="font-medium">{paymentId}</span></p>
            <p>Order ID: <span className="font-medium">{orderId}</span></p>
          </div>
        )}

        <Link
          to="/user/bookings" 
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          View My Bookings
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess;
