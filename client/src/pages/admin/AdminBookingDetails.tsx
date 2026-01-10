import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import AdminLayout from "../../layouts/admin/AdminLayout";
//import { STATUS_CODES } from "../../utils/constants";

const AdminBookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { 
    selectedBooking, 
    fetchBookingDetailsForAdmin, 
    isLoading, 
    error 
  } = useAuthStore();

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetailsForAdmin(bookingId);
    }
  }, [bookingId, fetchBookingDetailsForAdmin]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <span className="text-gray-500">Loading booking details...</span>
        </div>
      </AdminLayout>
    );
  }

  if (error || !selectedBooking) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-96">
          <span className="text-red-500">{error || "Booking not found"}</span>
        </div>
      </AdminLayout>
    );
  }

  const { property, user, owner, paymentStatus, bookingStatus } = selectedBooking;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Booking Details</h1>

        {/* Booking Summary */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-2">Booking Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><strong>Booking ID:</strong> {selectedBooking.bookingId}</div>
            <div><strong>Move-in Date:</strong> {new Date(selectedBooking.moveInDate).toLocaleDateString()}</div>
            <div><strong>End Date:</strong> {new Date(selectedBooking.endDate).toLocaleDateString()}</div>
            <div><strong>Rental Period:</strong> {selectedBooking.rentalPeriod} month(s)</div>
            <div><strong>Guests:</strong> {selectedBooking.guests}</div>
            <div><strong>Total Cost:</strong> ₹{selectedBooking.totalCost}</div>
            <div><strong>Payment Status:</strong> {paymentStatus}</div>
            <div><strong>Booking Status:</strong> {bookingStatus}</div>
          </div>
        </div>

        {/* Property Details */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Property Info</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <p className="mb-2"><strong>Title:</strong> {property.title}</p>
              <p className="mb-2"><strong>City:</strong> {property.city}</p>
              <p className="mb-2"><strong>Address:</strong> {property.address}</p>
              <p className="mb-2"><strong>Price per month:</strong> ₹{property.pricePerMonth}</p>
              <p className="mb-2"><strong>Bedrooms:</strong> {property.bedrooms}</p>
              <p className="mb-2"><strong>Bathrooms:</strong> {property.bathrooms}</p>
              <p className="mb-2"><strong>Furnishing:</strong> {property.furnishing}</p>
            </div>

            {/* Property Images */}
            {/* <div className="flex-1 grid grid-cols-2 gap-2">
              {property.images?.map((img, index) => (
                <img 
                  key={index} 
                  src={img} 
                  alt={`Property Image ${index + 1}`} 
                  className="w-full h-32 md:h-40 object-cover rounded-lg"
                />
              ))}
            </div> */} 
          <div className="flex-1">
            <img
              src={property.images?.[0] || "/placeholder.jpg"}
              alt="Property"
              className="w-full h-64 object-cover rounded-lg shadow"
            />
          </div>

          </div>
        </div>

        {/* User & Owner Details */}
        <div className="bg-white shadow rounded-lg p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User */}
          {user && (
            <div>
              <h2 className="text-xl font-medium mb-2">User Info</h2>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || "-"}</p>
            </div>
          )}

          {/* Owner */}
          {owner && (
            <div>
              <h2 className="text-xl font-medium mb-2">Owner Info</h2>
              <p><strong>Name:</strong> {owner.name}</p>
              <p><strong>Email:</strong> {owner.email}</p>
              <p><strong>Phone:</strong> {owner.phone}</p>
              <p><strong>Business Name:</strong> {owner.businessName}</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBookingDetails;
