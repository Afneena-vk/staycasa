
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";
import { Button } from "../../components/common/Button";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import {
  FaBed,
  FaBath,
  FaUserFriends,
  FaCouch,
  FaMapMarkerAlt,
  FaStar,
  FaCalendarAlt,
  FaWifi,
  FaParking,
  FaUtensils,
  FaPhoneAlt,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

type Maybe<T> = T | null | undefined;

const IconForFeature = ({ feature }: { feature: string }) => {
  const low = feature.toLowerCase();
  if (low.includes("wifi") || low.includes("internet")) return <FaWifi />;
  if (low.includes("parking")) return <FaParking />;
  if (low.includes("kitchen") || low.includes("cook")) return <FaUtensils />;
  // default
  return <FaStar />;
};

const formatDate = (iso?: string | Date | null) => {
  if (!iso) return "N/A";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString();
  } catch {
    return String(iso);
  }
};

const UserPropertyDetails = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const today = new Date().toISOString().split("T")[0];


  const getActivePropertyById = useAuthStore(
    (state) => state.getActivePropertyById
  );
  const property = useAuthStore((state) => state.selectedProperty);
  const loading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error); 
  const [checkIn, setCheckIn] = useState<string>("");
   //const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<string>("");
  const [guests, setGuests] = useState<number>(1);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);
  const [rentalPeriod, setRentalPeriod] = useState(property?.minLeasePeriod || 1)
  const [blockedDates, setBlockedDates] = useState<{ moveInDate: string; endDate: string }[]>([]);
  const fetchedRef = useRef(false);
  const navigate = useNavigate();

  const [mainIndex, setMainIndex] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
 
 

  //const [showOwnerPhone, setShowOwnerPhone] = useState(false);

  useEffect(() => {
    if (!propertyId) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    getActivePropertyById(propertyId);
    
  }, [propertyId]);

    useEffect(() => {
    if (!propertyId) return;

    const fetchBlockedDates = async () => {
      try {
        const res = await userService.getBlockedDates(propertyId);
        setBlockedDates(res.blockedDates);
      } catch (err) {
        console.error("Failed to fetch blocked dates", err);
      }
    };

    fetchBlockedDates();
  }, [propertyId]);

  useEffect(() => {
    
    setMainIndex(0);
    setGalleryOpen(false);
    //setShowOwnerPhone(false);
  }, [property?.id]);

  
  const images: string[] = property?.images ?? [];

   const handleBookNow = () => {
    navigate(`/user/checkout/${propertyId}`);
  };

    const isStartDateValid = (date: Date) => {
    if (!rentalPeriod) return true;

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setMonth(end.getMonth() + rentalPeriod);

    return !blockedDates.some(({ moveInDate, endDate }) => {
      const bookedStart = new Date(moveInDate);
      const bookedEnd = new Date(endDate);
      bookedStart.setHours(0, 0, 0, 0);
      bookedEnd.setHours(0, 0, 0, 0);

      return start <= bookedEnd && end >= bookedStart;
    });
  };

  return (
    <>
      <Header />

      <main className="bg-gray-50 min-h-screen">
        {/* Loading state */}
        {loading && (
          <div className="max-w-6xl mx-auto p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-80 bg-gray-200 rounded-lg" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-40 bg-gray-200 rounded-lg" />
            </div>
          </div>
        )}

        {/* Error / not found */}
        {!loading && !property && (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">Property not found</h2>
            <p className="text-gray-600">We couldn't find the requested property.</p>
          </div>
        )}

        {/* Main content */}
        {!loading && property && (
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            {/* HERO: two-column layout - left content, right sticky booking */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: images + info (span 2 cols) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Image gallery + thumbnails */}
                <div className="rounded-xl overflow-hidden bg-white shadow">
                  <div className="relative w-full h-[480px] md:h-[520px] bg-gray-100">
                    {images.length > 0 ? (
                      <img
                        src={images[mainIndex]}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    {/* left/right arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setMainIndex((i) => (i - 1 + images.length) % images.length)
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                          aria-label="Previous image"
                        >
                          <FaChevronLeft />
                        </button>

                        <button
                          onClick={() => setMainIndex((i) => (i + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
                          aria-label="Next image"
                        >
                          <FaChevronRight />
                        </button>
                      </>
                    )}

                    {/* view gallery */}
                    {/* {images.length > 0 && (
                      <button
                        onClick={() => setGalleryOpen(true)}
                        className="absolute right-4 bottom-4 bg-white/90 px-3 py-2 rounded-lg shadow"
                      >
                        View gallery
                      </button>
                    )} */}
                  </div>

                  {/* thumbnail strip */}
                  {images.length > 1 && (
                    <div className="p-3 bg-white flex items-center gap-3 overflow-x-auto">
                      {images.map((src, idx) => (
                        <button
                          key={idx}
                          className={`flex-shrink-0 rounded-md overflow-hidden border ${
                            idx === mainIndex ? "border-blue-600" : "border-gray-200"
                          }`}
                          onClick={() => setMainIndex(idx)}
                          aria-label={`Show image ${idx + 1}`}
                        >
                          <img
                            src={src}
                            alt={`${property.title} ${idx + 1}`}
                            className="w-28 h-20 object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Title / location / rating / quick facts */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{property.title}</h1>
                    <div className="flex items-center gap-3 text-gray-600 mt-2">
                      <span className="flex items-center gap-1">
                        <FaMapMarkerAlt />
                        <span>
                          {property.city}, {property.district}, {property.state}
                        </span>
                      </span>
                      {/* rating (if available) */}
                      {/* If you have rating fields, show them here */}
                    </div>
                  </div>

                  {/* simple badges / quick actions */}
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt />
                      <span>Posted: {formatDate(property.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick facts bar */}
                <div className="bg-white rounded-xl shadow p-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-md text-blue-700">
                        <FaBed />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Bedrooms</div>
                        <div className="font-medium">{property.bedrooms ?? "—"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-md text-blue-700">
                        <FaBath />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Bathrooms</div>
                        <div className="font-medium">{property.bathrooms ?? "—"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-md text-blue-700">
                        <FaUserFriends />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Max Guests</div>
                        <div className="font-medium">{property.maxGuests ?? "—"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-md text-blue-700">
                        <FaCouch />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Furnishing</div>
                        <div className="font-medium">{property.furnishing ?? "—"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-md text-blue-700">
                        <FaCalendarAlt />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Posted</div>
                        <div className="font-medium">{formatDate(property.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Overview & Description */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl p-5 shadow">
                      <h3 className="text-xl font-semibold mb-3">Overview</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {property.description}
                      </p>
                    </div>

                    {/* Amenities / features */}
                    <div className="bg-white rounded-xl p-5 shadow">
                      <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {(property.features ?? []).map((f: string, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                          >
                            <div className="text-lg text-blue-600">
                              <IconForFeature feature={f} />
                            </div>
                            <div>
                              <div className="text-sm text-gray-600"> </div>
                              <div className="font-medium">{f}</div>
                            </div>
                          </div>
                        ))}
                        {/* fallback if empty */}
                        {(property.features ?? []).length === 0 && (
                          <div className="text-gray-500">No amenities listed.</div>
                        )}
                      </div>
                    </div>

                    {/* Booking & Policies (collapsible-like) */}
                    <div className="bg-white rounded-xl p-5 shadow">
                      <h3 className="text-xl font-semibold mb-3">Booking & Policies</h3>
                      <div className="space-y-2 text-gray-700">
                        <div>
                          <strong>Lease Period:</strong>{" "}
                          {property.minLeasePeriod} to {property.maxLeasePeriod} months
                        </div>
                        {/* <div>
                          <strong>Cancellation Policy:</strong>{" "} */}
                          {/* property.cancellationPolicy fallback */}
                          {/* {((property as any).cancellationPolicy as Maybe<string>) ?? "Standard cancellation applies."}
                        </div> */}

                        {/* <div>
                          <strong>Check-in / Check-out:</strong>{" "}
                          {((property as any).checkInTime as Maybe<string>) ?? "N/A"} /{" "}
                          {((property as any).checkOutTime as Maybe<string>) ?? "N/A"}
                        </div> */}

                        <div className="mt-3">
                          {/* <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
                            // TODO: hook up booking flow
                            onClick={() => alert("Booking flow not implemented in this demo")}
                          >
                            Book Now
                          </button> */}
                          <Button
                              variant="blue"
                              onClick={handleBookNow}
                              >
                                Book Now
                              </Button>

                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right (in-column) small map + address + owner */}
                  <aside className="space-y-6">
                    {/* Address card */}
                    <div className="bg-white rounded-xl p-4 shadow">
                      <h4 className="font-semibold mb-2">Location</h4>
                      <div className="text-gray-700">
                        <div>{property.city}, {property.district}</div>
                        <div>{property.state} - {property.pincode}</div>
                        {/* <div className="text-sm text-gray-500 mt-2">
                          Exact street/house number is revealed after booking.
                        </div> */}
                      </div>
                    </div>

                    {/* Map placeholder */}
                    {/* <div className="bg-white rounded-xl p-2 shadow h-40 flex items-center justify-center text-gray-400"> */}
                      {/* Replace this with a real map (Leaflet / Google Maps) if you want */}
                      {/* <div className="text-center">
                        <FaMapMarkerAlt className="mx-auto text-2xl mb-2" />
                        <div>Map placeholder</div>
                      </div>
                    </div> */}

                    {/* Owner card */}
                    <div className="bg-white rounded-xl p-4 shadow">
                      <h4 className="font-semibold mb-3">Owner</h4>
                      <div className="flex items-center gap-3">
                        {/* <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                          {property.owner?.name?.[0] ?? "O"}
                        </div> */}
                        <div className="flex-1">
                          <div className="font-medium">{property.owner?.name ?? "-"}</div>
                          {/* <div className="text-sm text-gray-500">Owner</div> */}
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        {/* Contact button reveals phone (privacy) */}
                        {/* <button
                          onClick={() => setShowOwnerPhone((s) => !s)}
                          className="w-full px-3 py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
                        >
                          <FaPhoneAlt />
                          <span>{showOwnerPhone ? property.owner?.phone : "Contact Owner"}</span>
                        </button> */}

                        {/* other public info */}
                        {property.owner?.businessName && (
                          <div>
                            {/* {property.owner.businessName} */}
                            <strong>Business:</strong> {property.owner.businessName}
                          </div>
                        )}

                        {
                            property.owner?.businessAddress&&(
                                <div className="text-sm text-gray-600">
                          <strong>Address:</strong> {property.owner.businessAddress}
                          </div>
                            )
                        }
                      </div>
                    </div>
                  </aside>
                </section>

                {/* Reviews block (placeholder) */}
                {/* <div className="bg-white rounded-xl p-5 shadow mt-6"> */}
                  {/* <h3 className="text-xl font-semibold mb-3">Reviews</h3> */}
                  {/* If you have reviews array, map them here. */}
                  {/* <div className="text-gray-600">No reviews yet.</div>
                </div> */}
              </div>

              {/* Right: sticky booking panel (lg only) */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  <div className="bg-white rounded-xl p-5 shadow">
                    <div className="flex items-baseline justify-between gap-3">
                      <div>
                        <div className="text-sm text-gray-500">Monthly Rent</div>
                        <div className="text-2xl font-bold">₹{property.pricePerMonth}</div>
                        <div className="text-sm text-gray-500">/ month</div>
                      </div>

                      {/* <div className="text-right"> */}
                        {/* placeholder rating */}
                        {/* <div className="flex items-center gap-1 text-yellow-500">
                          <FaStar />
                          <span className="font-medium">4.7</span>
                        </div>
                        <div className="text-sm text-gray-500">125 reviews</div>
                      </div> */}
                    </div>

                    <div className="mt-4 space-y-2">
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Check-in</label>
    {/* <input
      type="date"
      value={checkIn}
      min={today}
      onChange={(e) => setCheckIn(e.target.value)}
      className="w-full border px-3 py-2 rounded-lg"
    /> */}
    <ReactDatePicker
  selected={checkIn ? new Date(checkIn) : null}
  onChange={(date: Date | null) =>
    setCheckIn(date ? date.toISOString().split("T")[0] : "")
  }
  minDate={new Date()}
  filterDate={isStartDateValid}
  className="w-full border px-3 py-2 rounded-lg"
  placeholderText="Select check-in date"
  dateFormat="yyyy-MM-dd"
/>

  </div>

  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Rental period</label>
    {/* <input
      type="date"
      value={checkOut}
      onChange={(e) => setCheckOut(e.target.value)}
      className="w-full border px-3 py-2 rounded-lg"
    /> */} 
    <input
  type="number"
  min={property?.minLeasePeriod || 1}
  max={property?.maxLeasePeriod || 12}
  value={rentalPeriod}
  onChange={(e) => setRentalPeriod(Number(e.target.value))}
  className="w-full border px-3 py-2 rounded-lg"
/>
  </div>

  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">Guests</label>
    <input
      type="number"
      min={1}
      max={property?.maxGuests ?? 10}
      value={guests}
      onChange={(e) => setGuests(Number(e.target.value))}
      className="w-full border px-3 py-2 rounded-lg"
    />
  </div>

  <Button
    variant="checkBlue"
    onClick={async () => {
      if (!checkIn || !rentalPeriod) {
        alert("check in date and rental Period are needed");
        return;
      }

      try {
       
        //  const response = await api.get(
        //   `/user/properties/${propertyId}/check-availability?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
        // );
        // const data = await authService.checkAvailability(propertyId!,checkIn,checkOut,guests)
           const data = await userService.checkAvailability(propertyId!,checkIn,rentalPeriod,guests)

        setAvailabilityMessage(data.message);
       // alert(data.message);
      } catch (err:any) {
        console.error(err);
        //alert("Error checking availability");
         //</div></div>setAvailabilityMessage("Error checking availability");
         setAvailabilityMessage(
        err.response?.data?.message || "Error checking availability"
      );
      }
    }}
    //className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
  >
    Check availability
  </Button>
 {availabilityMessage && (
    // <div className="mt-2 text-sm font-medium text-gray-700">
    //   {availabilityMessage}
    // </div>
      <div
    className={`mt-3 p-3 rounded-lg text-sm font-semibold 
      ${availabilityMessage.toLowerCase().includes("available")
        ? "bg-green-100 text-green-700 border border-green-300"
        : "bg-red-100 text-red-700 border border-red-300"
      }`}
  >
    {availabilityMessage}
  </div>
  )}
  <button
    onClick={() => alert("Start booking")}
    className="w-full px-4 py-2 border rounded-lg"
  >
    Message owner
  </button>
</div>


                    <div className="mt-4 text-sm text-gray-600">
                      <div><strong>Lease:</strong> {property.minLeasePeriod} - {property.maxLeasePeriod} months</div>
                      {/* <div><strong>Security Deposit:</strong> {(property as any).securityDeposit ? `₹${(property as any).securityDeposit}` : "Varies"}</div> */}
                    </div>
                  </div>

                  {/* small mobile-friendly card, hidden on lg */}
                  <div className="lg:hidden bg-white rounded-xl p-4 shadow">
                    <div className="text-sm text-gray-500">Rent</div>
                    <div className="text-xl font-bold">₹{property.pricePerMonth} / month</div>
                    <div className="mt-3">
                      <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg" onClick={() => alert("Booking flow")}>
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* gallery modal */}
        {galleryOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="relative max-w-5xl w-full">
              <button
                onClick={() => setGalleryOpen(false)}
                className="absolute right-2 top-2 p-2 rounded-full bg-white z-50"
                aria-label="Close gallery"
              >
                <FaTimes />
              </button>

              <div className="bg-white rounded-lg overflow-hidden">
                <div className="w-full h-[70vh] bg-gray-900 flex items-center justify-center">
                  {images.length > 0 ? (
                    <img src={images[mainIndex]} alt={`gallery ${mainIndex}`} className="max-h-[70vh] object-contain" />
                  ) : (
                    <div className="text-white">No images</div>
                  )}
                </div>

                <div className="p-3 flex items-center gap-2 overflow-x-auto bg-gray-50">
                  <button
                    onClick={() => setMainIndex((i) => (i - 1 + images.length) % images.length)}
                    className="p-2 rounded bg-white"
                  >
                    <FaChevronLeft />
                  </button>

                  {images.map((src, i) => (
                    <button key={i} onClick={() => setMainIndex(i)} className={`flex-shrink-0 border ${i === mainIndex ? "border-blue-600" : "border-gray-200"} rounded`}>
                      <img src={src} alt={`thumb ${i}`} className="w-28 h-20 object-cover" />
                    </button>
                  ))}

                  <button
                    onClick={() => setMainIndex((i) => (i + 1) % images.length)}
                    className="p-2 rounded bg-white"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
};

export default UserPropertyDetails;



// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { useAuthStore } from "../../stores/authStore";

// const UserPropertyDetails= () => {
//   const { propertyId } = useParams();
// //   const getPropertyById = useAuthStore((state) => state.getPropertyById);
// const getActivePropertyById = useAuthStore((state)=> state.getActivePropertyById)
//   const property = useAuthStore((state) => state.selectedProperty);

//   useEffect(() => {
//     console.log("Fetching property with ID:", propertyId);
//     getActivePropertyById(propertyId!);
//   }, [propertyId]);

//   console.log("Backend response:", property);

//   return <div>Check console...</div>;
// };

// export default UserPropertyDetails;  

