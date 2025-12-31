
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import OwnerLayout from "../../layouts/owner/OwnerLayout";
import { useAuthStore } from "../../stores/authStore";

const OwnerBookingDetails = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { selectedBooking, fetchBookingDetailsForOwner, isLoading, error } = useAuthStore();

  useEffect(() => {
    if (bookingId) fetchBookingDetailsForOwner(bookingId);
  }, [bookingId]);

  if (isLoading)
    return (
      <OwnerLayout>
        <p className="text-center mt-10 text-gray-500">Loading booking details...</p>
      </OwnerLayout>
    );

  if (error)
    return (
      <OwnerLayout>
        <p className="text-center mt-10 text-red-500">{error}</p>
      </OwnerLayout>
    );

  if (!selectedBooking)
    return (
      <OwnerLayout>
        <p className="text-center mt-10 text-gray-500">No booking found.</p>
      </OwnerLayout>
    );

  const b = selectedBooking;

  const statusBadge = (status: string) => {
    let color = "bg-gray-300 text-gray-800";
    if (status === "Confirmed") color = "bg-green-100 text-green-800";
    if (status === "Pending") color = "bg-yellow-100 text-yellow-800";
    if (status === "Cancelled") color = "bg-red-100 text-red-800";
    return <span className={`px-2 py-1 rounded-full text-sm font-semibold ${color}`}>{status}</span>;
  };

  return (
    <OwnerLayout>
      <div className="p-6 space-y-6 max-w-6xl mx-auto">

        {/* Back Button */}
        <button
          className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded shadow-sm transition"
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>

        {/* Booking Information */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-4 flex items-center justify-between">
            Booking Information
            {statusBadge(b.bookingStatus)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
            <p><strong>Booking ID:</strong> {b.bookingId}</p>
            <p><strong>Move-In Date:</strong> {new Date(b.moveInDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(b.endDate).toLocaleDateString()}</p>
            <p><strong>Guests:</strong> {b.guests}</p>
            <p><strong>Rental Period:</strong> {b.rentalPeriod} months</p>
            <p><strong>Rent Per Month:</strong> ${b.rentPerMonth}</p>
            <p><strong>Total Cost:</strong> ${b.totalCost}</p>
            <p><strong>Payment Method:</strong> {b.paymentMethod}</p>
            <p><strong>Payment Status:</strong> {b.paymentStatus}</p>
            {b.isCancelled && (
              <>
                {/* <p><strong>Cancellation Reason:</strong> {b.cancellationReason}</p> */}
                <p><strong>Refund Amount:</strong> ${b.refundAmount}</p>
              </>
            )}
          </div>
        </div>

        {/* Property Information */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-4">Property Information</h2>
          <p className="mb-2"><strong>Title:</strong> {b.property.title}</p>
          <p className="mb-2"><strong>Type:</strong> {b.property.type}</p>
          <p className="mb-2"><strong>Address:</strong> {b.property.houseNumber}, {b.property.street}, {b.property.city}, {b.property.state}, {b.property.pincode}</p>
          <p className="mb-2"><strong>Bedrooms:</strong> {b.property.bedrooms}</p>
          <p className="mb-2"><strong>Bathrooms:</strong> {b.property.bathrooms}</p>
          <p className="mb-2"><strong>Furnishing:</strong> {b.property.furnishing}</p>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {b.property.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Property ${i}`}
                className="w-40 h-40 object-cover rounded-lg flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* User Information */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-4">User Information</h2>
          <p><strong>Name:</strong> {b.user?.name}</p>
          <p><strong>Email:</strong> {b.user?.email}</p>
          {b.user?.phone && <p><strong>Phone:</strong> {b.user?.phone}</p>}
          {b.user?.address && (
            <p>
              <strong>Address:</strong> {b.user.address.houseNo}, {b.user.address.street}, {b.user.address.city}, {b.user.address.district}, {b.user.address.state}, {b.user.address.pincode}
            </p>
          )}
        </div>

      </div>
    </OwnerLayout>
  );
};

export default OwnerBookingDetails;
