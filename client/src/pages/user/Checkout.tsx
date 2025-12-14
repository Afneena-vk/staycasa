
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import { useAuthStore } from "../../stores/authStore";
import { authService } from "../../services/authService";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  //const { propertyId } = useParams();
const { propertyId } = useParams<{ propertyId: string }>();
const today = new Date().toISOString().split("T")[0];
  
  const getActivePropertyById = useAuthStore(
    (state) => state.getActivePropertyById
  );
  const property = useAuthStore((state) => state.selectedProperty);
  const loading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const bookingStore = useAuthStore();
  
  useEffect(() => {
    if (!propertyId) return;
    getActivePropertyById(propertyId);
  }, [propertyId]);


  const [moveInDate, setMoveInDate] = useState("");
  // const [rentalPeriod, setRentalPeriod] = useState<number | "">("");
  // const [guests, setGuests] = useState<number | "">("");
  const [rentalPeriod, setRentalPeriod] = useState<number | null>(null);
  const [guests, setGuests] = useState<number | null>(null);

  const [errors, setErrors] = useState({
  moveInDate: "",
  rentalPeriod: "",
  guests: "",
  backend: "",
});

  const navigate = useNavigate();
  const validateForm = () => {
  let newErrors = { moveInDate: "", rentalPeriod: "", guests: "", backend: "" };
  let valid = true;

  if (!moveInDate) {
    newErrors.moveInDate = "Move-in date is required.";
    valid = false;
  }

  if (!rentalPeriod) {
    newErrors.rentalPeriod = "Rental period is required.";
    valid = false;
  }

  if (!guests) {
    newErrors.guests = "Number of guests is required.";
    valid = false;
  }

  setErrors(newErrors);
  return valid;
};


  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors(prev => ({ ...prev, backend: "" })); 

    // if (!property) return;
     if (!validateForm()) return;

    if (!propertyId) {
     setErrors(prev => ({ ...prev, backend: "Invalid property ID" }));
  return;
}


    // if ( !moveInDate || !rentalPeriod || !guests) {
    //   alert("Please fill all required fields");
    //   return;
    // } 
     try {
    const response = await authService.checkAvailability(
      propertyId,
      moveInDate,
      // rentalPeriod,
      // guests
       rentalPeriod as number,
       guests as number
    );

    if (!response.available) {
      setErrors(prev => ({ ...prev, backend: response.message }));
      return;
    }

    bookingStore.setBookingData({
      propertyId,
      moveInDate,
      rentalPeriod: rentalPeriod as number,
      guests: guests as number,
    });
    console.log("Booking saved:", bookingStore.bookingData);


    navigate("/user/payment");

  } catch (err: any) {
    const msg = err?.response?.data?.message || "Server error. Try again later.";
    setErrors(prev => ({ ...prev, backend: msg }));
  }
};

  

  
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-xl text-red-600">
        {error}
      </div>
    );

  if (!property)
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Property not found
      </div>
    );

 
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-10 px-4">
          <Header />

      
      <div className="max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-10 text-gray-800">
          Book Your Stay 
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ------- PROPERTY SUMMARY ------- */}
          <div className="lg:col-span-1 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-gray-200">
            <img
              src={property.images?.[0] || ""}
              alt={property.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {property.title}
              </h2>

              <h3>
  {`${property.houseNumber}, ${property.street}, ${property.city}, ${property.district}, ${property.state} - ${property.pincode}`}
</h3>



              {/* <p className="text-gray-600 mt-1">{property.location}</p> */}

              <div className="mt-4">

                <p className="text-blue-700 text-xl font-bold">
                  ₹{property.pricePerMonth}/month
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Lease Period: {property.minLeasePeriod} – {property.maxLeasePeriod} months
                </p>
              </div>
            </div>
          </div>

          {/* ------- BOOKING FORM ------- */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Booking Details
            </h2>

            <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6" noValidate>

              {/* Move-in Date */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Move-in Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border"
                  value={moveInDate}
                  min={today}
                  onChange={(e) => setMoveInDate(e.target.value)}
                />
                {errors.moveInDate && (
  <p className="text-red-600 text-sm mt-1">{errors.moveInDate}</p>
)}
              </div>

              {/* Rental Period */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Rental Period (months)</label>
                <input
                  type="number"
                  min={property.minLeasePeriod}
                  max={property.maxLeasePeriod}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border"
                  // value={rentalPeriod}
                  value={rentalPeriod ?? ""}
                  // onChange={(e) => setRentalPeriod(Number(e.target.value))}
                  onChange={(e) => setRentalPeriod(e.target.value ? Number(e.target.value) : null)}
                />
               
{errors.rentalPeriod && (
  <p className="text-red-600 text-sm mt-1">{errors.rentalPeriod}</p>
)}

              </div>

              {/* Guests */}
              <div>
                <label className="block mb-1 text-gray-700 font-medium">Guests</label>
                <input
                  type="number"
                  min={1}
                  max={property.maxGuests} 
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 border"
                  // value={guests}
                  // onChange={(e) => setGuests(Number(e.target.value))}
                  value={guests ?? ""}
                  onChange={(e) => setGuests(e.target.value ? Number(e.target.value) : null)}

                />
                {errors.guests && (
  <p className="text-red-600 text-sm mt-1">{errors.guests}</p>
)}
              </div>

              {/* Submit */}
              <div className="col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 mt-4 bg-blue-600 text-white text-lg font-semibold rounded-xl shadow-md hover:bg-blue-700"
                >
                  Proceed to Payment
                </button>
              </div>
{errors.backend && (
  <div className="col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {errors.backend}
  </div>
)}

            </form>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
