

import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import OwnerLayout from "../../layouts/owner/OwnerLayout";
import { useAuthStore } from "../../stores/authStore";
import {
  FaStar,
  FaBed,
  FaBath,
  FaUsers,
  FaCouch,
  FaMapMarkerAlt,
} from "react-icons/fa";

function OwnerPropertyDetails() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { selectedProperty, getOwnerPropertyById, isLoading, error } =
    useAuthStore();

  useEffect(() => {
    if (propertyId) {
      getOwnerPropertyById(propertyId);
    }
  }, [propertyId, getOwnerPropertyById]);

  if (isLoading)
    return <p className="text-center py-10 text-gray-600">Loading property...</p>;
  if (error)
    return <p className="text-center py-10 text-red-500">Error: {error}</p>;
  if (!selectedProperty)
    return <p className="text-center py-10 text-gray-600">No property found.</p>;

  return (
    <OwnerLayout>
    <div className="max-w-6xl mx-auto p-6">
      
<div className="rounded-xl overflow-hidden shadow-lg">
  {/* Main Image */}
  <img
    src={selectedProperty.images?.[0] || "/placeholder.jpg"}
    alt={selectedProperty.title}
    
     className="w-full max-h-[600px] object-cover rounded-xl"
  />

  {/* Horizontal Scrollable Thumbnails */}
  {selectedProperty.images?.length > 1 && (
    <div className="mt-4 flex gap-3 overflow-x-auto scrollbar-hide">
      {selectedProperty.images.slice(1).map((img: string, idx: number) => (
        <img
          key={idx}
          src={img}
          alt={`Property image ${idx + 1}`}
          className="w-40 h-28 object-cover rounded-lg shadow flex-shrink-0"
        />
      ))}
    </div>
  )}
</div>


      {/* Title & Location */}
      <div className="mt-6 flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold">{selectedProperty.title}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <FaMapMarkerAlt className="mr-2 text-red-500" />
            <span>
              {selectedProperty.houseNumber}, {selectedProperty.street},{" "}
              {selectedProperty.city}, {selectedProperty.state},{" "}
              {selectedProperty.pincode}
            </span>
          </div>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <p className="text-2xl font-semibold text-blue-600">
            ₹{selectedProperty.pricePerMonth.toLocaleString()} / month
          </p>
          <div className="flex items-center justify-end text-yellow-500 mt-1">
            {/* <FaStar /> */}
            {/* <span className="ml-1 text-gray-700">
              {selectedProperty.averageRating.toFixed(1)} (
              {selectedProperty.totalReviews} reviews)
            </span> */}
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="flex items-center gap-2">
          <FaBed className="text-blue-500" />
          <span>{selectedProperty.bedrooms} Bedrooms</span>
        </div>
        <div className="flex items-center gap-2">
          <FaBath className="text-blue-500" />
          <span>{selectedProperty.bathrooms} Bathrooms</span>
        </div>
        <div className="flex items-center gap-2">
          <FaUsers className="text-blue-500" />
          <span>Max {selectedProperty.maxGuests} Guests</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCouch className="text-blue-500" />
          <span>{selectedProperty.furnishing}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">About this property</h2>
        <p className="text-gray-700">{selectedProperty.description}</p>
      </div>

      {/* Features */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Features & Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {selectedProperty.features?.map((feature: string, idx: number) => (
            <span
              key={idx}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Rules & Policies */}
      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div>
          {/* <h2 className="text-xl font-semibold mb-2">House Rules</h2> */}
          {/* <p className="text-gray-700">
            {selectedProperty.rules || "No specific rules"}
          </p> */}
        </div>
        <div>
          {/* <h2 className="text-xl font-semibold mb-2">Cancellation Policy</h2> */}
          {/* <p className="text-gray-700">
            {selectedProperty.cancellationPolicy || "Standard cancellation applies"}
          </p> */}
        </div>
      </div>

      {/* Availability */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Availability</h2>
        {/* <p className="text-gray-700">
          Available from:{" "}
          <span className="font-medium">
            {new Date(selectedProperty.availableFrom).toDateString()}
          </span>
        </p> */}
        <p className="text-gray-700">
          Lease Period: {selectedProperty.minLeasePeriod} -{" "}
          {selectedProperty.maxLeasePeriod} months
        </p>
      </div>

      {/* Booking Status */}
      <div className="mt-8 p-4 rounded-xl border flex justify-between items-center bg-gray-50">
        {/* {selectedProperty.isBooked ? (
          <p className="text-red-500 font-semibold">
            This property is currently booked
          </p>
        ) : (
          <p className="text-green-600 font-semibold">Available for booking</p>
        )} */}
        {/* <button
          disabled={selectedProperty.isBooked}
          className={`px-6 py-2 rounded-lg font-medium ${
            selectedProperty.isBooked
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {selectedProperty.isBooked ? "Unavailable" : "Book Now"}
        </button> */}
      </div>
    </div>
    </OwnerLayout>
  );
}

export default OwnerPropertyDetails;
