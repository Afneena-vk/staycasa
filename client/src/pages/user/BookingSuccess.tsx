
import React, { useState,useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

const BookingSuccess: React.FC = () => {
 
  const location = useLocation();
  const { booking,property,paymentId, orderId } = location.state || {};

 const clearBookingData = useAuthStore(state => state.clearBookingData);

 useEffect(() => {
    clearBookingData();
  }, [clearBookingData]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">Booking Confirmed!</h1>
        <p className="text-gray-700 mb-6">
          Your payment was successful and your booking has been confirmed.
        </p>

   
    
    {booking && property && (
          <div className="text-left text-gray-700 mb-6 space-y-2">
            <p><strong>Property:</strong> {property.title}</p>
            <p><strong>Location:</strong> {`${property.houseNumber}, ${property.street}, ${property.city}`}</p>
            <p><strong>Move-In Date:</strong> {new Date(booking.moveInDate).toLocaleDateString()}</p>
            <p><strong>Rental Period:</strong> {booking.rentalPeriod} months</p>
            <p><strong>Guests:</strong> {booking.guests}</p>
            <p><strong>Total Amount:</strong> ₹{booking.totalCost}</p>
          </div>
        )}



        
        {/* {paymentId && orderId && (
          <div className="text-gray-600 mb-6 text-sm">
            <p>Payment ID: <span className="font-medium">{paymentId}</span></p>
            <p>Order ID: <span className="font-medium">{orderId}</span></p>
          </div>
        )} */}

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
