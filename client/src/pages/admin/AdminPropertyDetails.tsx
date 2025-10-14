import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import AdminLayout from "../../layouts/admin/AdminLayout";

function AdminPropertyDetails() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const { getPropertyByAdmin, selectedProperty, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (propertyId) {
      getPropertyByAdmin(propertyId);
    }
  }, [propertyId, getPropertyByAdmin]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-500">Loading property details...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-red-500">{error}</div>
      </AdminLayout>
    );
  }

  if (!selectedProperty) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-gray-500">No property found.</div>
      </AdminLayout>
    );
  }

  const p = selectedProperty;
  const owner = p.owner;

  return (
    <AdminLayout>
      <div className="p-8 max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Properties
        </button>

        {/* Property Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">{p.title}</h1>
            <p className="text-gray-600 mt-1">
              {p.city}, {p.state} ({p.pincode})
            </p>
          </div>
          <span
            className={`px-3 py-1 text-sm rounded-full font-medium ${
              p.status === "active"
                ? "bg-green-100 text-green-800"
                : p.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : p.status === "blocked"
                ? "bg-red-100 text-red-800"
                : p.status === "booked"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {p.status.toUpperCase()}
          </span>
        </div>

        {/* Image Gallery */}
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {p.images && p.images.length > 0 ? (
            p.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Property Image ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">No images available</div>
          )}
        </div> */}
        {/* Image Gallery */}
<div>
  <h2 className="text-xl font-semibold text-gray-800 mb-3 border-b pb-2">
    Property Images
  </h2>
  {p.images && p.images.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {p.images.map((img: string, index: number) => (
        <div
          key={index}
          className="relative group overflow-hidden rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <img
            src={img}
            alt={`Property Image ${index + 1}`}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  ) : (
    <p className="text-gray-500 italic">No images available for this property.</p>
  )}
</div>


        {/* Property Details */}
        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Property Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Type:</strong> {p.type}</p>
            <p><strong>Price / Month:</strong> ₹{p.pricePerMonth}</p>
            <p><strong>Bedrooms:</strong> {p.bedrooms}</p>
            <p><strong>Bathrooms:</strong> {p.bathrooms}</p>
            <p><strong>Furnishing:</strong> {p.furnishing}</p>
            <p><strong>Max Guests:</strong> {p.maxGuests}</p>
            <p><strong>Lease Period:</strong> {p.minLeasePeriod} – {p.maxLeasePeriod} months</p>
            <p><strong>Features:</strong> {p.features?.join(", ") || "None"}</p>
          </div>

          <p className="text-gray-700 mt-2">
            <strong>Description:</strong> {p.description}
          </p>
        </div>

        {/* Owner Details */}
        {owner && (
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Owner Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
              <p><strong>Name:</strong> {owner.name}</p>
              <p><strong>Email:</strong> {owner.email}</p>
              <p><strong>Phone:</strong> {owner.phone}</p>
              <p><strong>Business Name:</strong> {owner.businessName || "—"}</p>
              <p className="md:col-span-2">
                <strong>Business Address:</strong> {owner.businessAddress || "—"}
              </p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminPropertyDetails;
