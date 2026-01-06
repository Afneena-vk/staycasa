

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";

const BookingDetails = () => {
  const { bookingId } = useParams();
//   const { selectedBooking, fetchBookingDetails, cancelBooking } =
 const { selectedBooking, fetchBookingDetails, fetchCancelBooking} = useAuthStore();
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
  const createdAt = new Date(b.createdAt);
  const updatedAt = new Date(b.updatedAt || b.createdAt);
  const today = new Date();

  // const canCancel = today < moveInDate;
  const diffInDays = Math.ceil((moveInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const canCancel = 
         !b.isCancelled &&            
         b.bookingStatus === "confirmed" &&  
         b.paymentStatus === "completed" &&  
         diffInDays >= 5;        

const handleCancelBooking = async () => {
  if (!b) return;

  if (!window.confirm("Are you sure you want to cancel this booking?")) return;

  try {
    const res = await fetchCancelBooking(b.id);
    alert(res.message);
  } catch (err: any) {
    alert(err.response?.data?.error || err.message || "Cancellation failed");
  }
};


      const getStatusColor = (status: string, type: "booking" | "payment") => {
    if (type === "booking") {
      switch (status) {
        case "confirmed":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "cancelled":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    } else {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "pending":
          return "bg-yellow-100 text-yellow-800";
        case "failed":
          return "bg-red-100 text-red-800";
        case "refunded":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    }
  };

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
                <span className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-800 capitalize">
                 Booking is {b.bookingStatus}
                </span>
                <span className="px-3 py-1 text-xs rounded bg-green-100 text-green-800 capitalize">
                 Payment is {b.paymentStatus}
                </span>
              </div>
                 {b.paymentId && (
                <p className="text-xs text-gray-500 mt-1">
                  Payment ID: {b.paymentId}
                </p>
              )}
            </div>

            {canCancel && (
              <button
                onClick={handleCancelBooking}
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
                <p className="text-gray-500">Booked On</p>
                <p className="font-medium">{createdAt.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p className="font-medium">{updatedAt.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Move-in Date</p>
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

            {/* <div className="grid sm:grid-cols-3 gap-4 text-sm"> */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">PaymentId:</p>
                <p className="font-medium">{b.paymentId}</p>
              </div>
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
