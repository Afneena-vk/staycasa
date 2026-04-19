
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { userService } from "../../services/userService";
import { Button } from "../../components/common/Button";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Review from "../../components/common/Review";
import StarRating from "../../components/common/StarRating";
import axios from "axios";
 
import {
  FaBed, FaBath, FaUserFriends, FaCouch,
  FaMapMarkerAlt, FaStar, FaCalendarAlt,
  FaWifi, FaParking, FaUtensils,
  FaChevronLeft, FaChevronRight, FaTimes,
  FaShieldAlt, FaRegClock, FaCheckCircle,
} from "react-icons/fa";
 
//type Maybe<T> = T | null | undefined;
 
const IconForFeature = ({ feature }: { feature: string }) => {
  const low = feature.toLowerCase();
  if (low.includes("wifi") || low.includes("internet")) return <FaWifi />;
  if (low.includes("parking")) return <FaParking />;
  if (low.includes("kitchen") || low.includes("cook")) return <FaUtensils />;
  return <FaStar />;
};
 
const formatDate = (iso?: string | Date | null) => {
  if (!iso) return "N/A";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return String(iso);
  }
};
 
/* ─── Reusable Tailwind snippets (kept as constants for DRY-ness) ─── */
const CARD   = "bg-white rounded-2xl border border-slate-200 shadow-sm";
const BADGE  = "inline-flex items-center gap-1 px-2.5 py-0.5 bg-blue-50 rounded-full text-xs font-semibold text-blue-700 border border-blue-200";
const LABEL  = "block text-[0.75rem] font-bold tracking-[0.06em] uppercase text-slate-500 mb-1.5";
const INPUT  = "w-full border-[1.5px] border-slate-300 px-3.5 py-2.5 rounded-[10px] text-[0.9rem] text-slate-900 bg-[#f8faff] outline-none transition-all focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/10 focus:bg-white box-border";
 
/* Section title: rendered as a div + the ::before bar comes from .section-bar CSS class */
const SectionTitle = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`section-bar flex items-center gap-2.5 text-[1.1rem] font-bold text-slate-900 mb-4 ${className}`}>
    {children}
  </div>
);
 
const UserPropertyDetails = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
 
  const getActivePropertyById = useAuthStore((s) => s.getActivePropertyById);
  const property              = useAuthStore((s) => s.selectedProperty);
  const loading               = useAuthStore((s) => s.isLoading);
  const fetchReviews          = useAuthStore((s) => s.fetchReviews);
  const reviews               = useAuthStore((s) => s.reviews);
  const reviewLoading         = useAuthStore((s) => s.reviewLoading);
 
  const [checkIn,              setCheckIn]              = useState<string>("");
  // const [checkOut,             setCheckOut]             = useState<string>("");
  const [guests,               setGuests]               = useState<number>(1);
  const [availabilityMessage,  setAvailabilityMessage]  = useState<string | null>(null);
  const [rentalPeriod,         setRentalPeriod]         = useState(property?.minLeasePeriod || 1);
  const [blockedDates,         setBlockedDates]         = useState<{ moveInDate: string; endDate: string }[]>([]);
  const [mainIndex,            setMainIndex]            = useState(0);
  const [galleryOpen,          setGalleryOpen]          = useState(false);
  const [showAllReviews,       setShowAllReviews]       = useState(false);
 
  const fetchedRef   = useRef(false);
  const navigate     = useNavigate();
  const PREVIEW_COUNT = 1;
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, PREVIEW_COUNT);
 
  useEffect(() => {
    if (!propertyId || fetchedRef.current) return;
    fetchedRef.current = true;
    getActivePropertyById(propertyId);
    fetchReviews(propertyId);
  }, [propertyId]);
 
  useEffect(() => {
    if (!propertyId) return;
    userService.getBlockedDates(propertyId)
      .then((res) => setBlockedDates(res.blockedDates))
      .catch((err) => console.error("Failed to fetch blocked dates", err));
  }, [propertyId]);
 
  useEffect(() => {
    setMainIndex(0);
    setGalleryOpen(false);
  }, [property?.id]);
 
  const images: string[] = property?.images ?? [];
 
  const handleBookNow = () => navigate(`/user/checkout/${propertyId}`);
 
  const isStartDateValid = (date: Date) => {
    if (!rentalPeriod) return true;
    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end   = new Date(start); end.setMonth(end.getMonth() + rentalPeriod);
    return !blockedDates.some(({ moveInDate, endDate }) => {
      const s = new Date(moveInDate); s.setHours(0, 0, 0, 0);
      const e = new Date(endDate);    e.setHours(0, 0, 0, 0);
      return start <= e && end >= s;
    });
  };
 
  const handleCheckAvailability = async () => {
    if (!checkIn || !rentalPeriod) {
      setAvailabilityMessage("Check-in date and rental period are required");
      return;
    }
    try {
      const data = await userService.checkAvailability(propertyId!, checkIn, rentalPeriod, guests);
      setAvailabilityMessage(data.message);
    } catch (err: unknown) {
      let message = "Error checking availability";
      if (axios.isAxiosError(err))     message = err.response?.data?.message || err.response?.data?.error || err.message || message;
      else if (err instanceof Error)   message = err.message;
      setAvailabilityMessage(message);
    }
  };
 
  const isAvailable = availabilityMessage?.toLowerCase().includes("available");
 
  return (
    <>
  <style>{`
  
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__input-container input {
          width: 100%;
          border: 1.5px solid #cbd5e1;
          padding: 10px 14px;
          border-radius: 10px;
          font-size: 0.9rem;
          color: #0f172a;
          background: #f8faff;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .react-datepicker__input-container input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
          background: #fff;
        }
      `}</style>
 
      {/* ROOT — pd-root */}
      <div className="bg-slate-100 min-h-screen">
  
 
        {/* ── LOADING ── */}
        {loading && (
          <div className="max-w-[1200px] mx-auto px-5 py-8 space-y-4">
            <div className="animate-pulse bg-slate-200 rounded-lg h-[400px]" />
            <div className="animate-pulse bg-slate-200 rounded-lg h-6 w-[38%]" />
            <div className="animate-pulse bg-slate-200 rounded-lg h-[110px]" />
          </div>
        )}
 
        {/* ── NOT FOUND ── */}
        {!loading && !property && (
          <div className="max-w-[560px] mx-auto mt-20 px-6 text-center">
            <div className="text-5xl mb-3">🏠</div>
            <h2 className="text-[1.7rem] font-bold text-slate-900 mb-2">Property Not Found</h2>
            <p className="text-slate-500">
              We couldn't find the requested property. It may have been removed or the link is invalid.
            </p>
          </div>
        )}
 
        {/* ── MAIN CONTENT ── */}
        {!loading && property && (
          <div className="max-w-[1200px] mx-auto px-5 py-7">
 
            {/* Breadcrumb — pd-badge */}
            <div className="flex items-center flex-wrap gap-1.5 mb-5 text-[0.82rem] text-slate-400">
              <span className="text-slate-500">Properties</span>
              <span>›</span>
              <span className="text-slate-700 font-semibold">{property.city}</span>
              <span>›</span>
              <span className={BADGE}>{property.title}</span>
            </div>
 
            {/* TWO-COLUMN LAYOUT — pd-layout / pd-sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
 
              {/* ═══ LEFT COLUMN ═══ */}
              <div className="flex flex-col gap-5">
 
                {/* IMAGE GALLERY — pd-card */}
                <div className={`${CARD} overflow-hidden`}>
                  {/* 16:9 hero */}
                  <div className="relative w-full pb-[56.25%] bg-slate-900">
                    {images.length > 0 ? (
                      <img
                        src={images[mainIndex]}
                        alt={property.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                        No image available
                      </div>
                    )}
 
                    {images.length > 1 && (
                      <>
                        {/* pd-arrow left */}
                        <button
                          onClick={() => setMainIndex((i) => (i - 1 + images.length) % images.length)}
                          aria-label="Previous image"
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 bg-white/90 border-0 w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer shadow-md text-blue-900 hover:bg-white hover:scale-[1.08] transition-all z-[2]"
                        >
                          <FaChevronLeft size={13} />
                        </button>
 
                        {/* pd-arrow right */}
                        <button
                          onClick={() => setMainIndex((i) => (i + 1) % images.length)}
                          aria-label="Next image"
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-white/90 border-0 w-[38px] h-[38px] rounded-full flex items-center justify-center cursor-pointer shadow-md text-blue-900 hover:bg-white hover:scale-[1.08] transition-all z-[2]"
                        >
                          <FaChevronRight size={13} />
                        </button>
 
                        {/* pd-img-counter */}
                        <div className="absolute bottom-3.5 right-3.5 bg-slate-900/55 text-white px-3 py-1 rounded-full text-[0.78rem] font-semibold backdrop-blur-sm">
                          {mainIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>
 
                  {/* Thumbnail strip — pd-thumb */}
                  {images.length > 1 && (
                    <div className="px-3.5 py-3 bg-white flex gap-2 overflow-x-auto">
                      {images.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setMainIndex(idx)}
                          aria-label={`Show image ${idx + 1}`}
                          className={`flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer bg-transparent p-0 transition-all hover:scale-[1.05] ${
                            idx === mainIndex ? "border-blue-600" : "border-transparent"
                          }`}
                        >
                          <img
                            src={src}
                            alt={`${property.title} ${idx + 1}`}
                            className="w-[88px] h-[60px] object-cover block"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
 
                {/* TITLE + LOCATION + RATING */}
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="flex-1">
                    <h1 className="text-[1.75rem] font-extrabold text-slate-900 leading-tight mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center flex-wrap gap-3.5">
                      <span className="flex items-center gap-1.5 text-slate-600 text-[0.9rem]">
                        <FaMapMarkerAlt className="text-blue-600" />
                        {property.city}, {property.district}, {property.state}
                      </span>
                      <span className={BADGE}>
                        <FaCalendarAlt size={10} /> Listed {formatDate(property.createdAt)}
                      </span>
                    </div>
                  </div>
 
                  <div>
                    {property.totalReviews > 0 ? (
                      <div className="flex flex-col items-end gap-1">
                        <StarRating rating={property.averageRating} />
                        <span className="text-[0.75rem] text-slate-400">
                          {property.totalReviews} review{property.totalReviews !== 1 ? "s" : ""}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-slate-300 text-[0.9rem]" />
                        ))}
                        <span className="text-[0.75rem] text-slate-400 ml-1">No reviews yet</span>
                      </div>
                    )}
                  </div>
                </div>
 
                {/* QUICK STATS — pd-card / pd-stat */}
                <div className={`${CARD} p-[18px]`}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                    {[
                      { icon: <FaBed />,         label: "Bedrooms",   value: property.bedrooms ?? "—" },
                      { icon: <FaBath />,        label: "Bathrooms",  value: property.bathrooms ?? "—" },
                      { icon: <FaUserFriends />, label: "Max Guests", value: property.maxGuests ?? "—" },
                      { icon: <FaCouch />,       label: "Furnishing", value: property.furnishing ?? "—" },
                      { icon: <FaCalendarAlt />, label: "Min Lease",  value: `${property.minLeasePeriod ?? "—"} mo` },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3.5 bg-[#f8faff] rounded-xl border border-[#e0e9ff]">
                        {/* pd-stat-icon */}
                        <div className="w-[38px] h-[38px] rounded-[10px] bg-blue-50 flex items-center justify-center text-blue-700 text-[0.95rem] flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          {/* pd-stat-label */}
                          <div className="text-[0.7rem] font-semibold tracking-[0.06em] uppercase text-slate-400">
                            {item.label}
                          </div>
                          {/* pd-stat-value */}
                          <div className="text-[0.95rem] font-bold text-slate-900 mt-px">
                            {String(item.value)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
 
                {/* DESCRIPTION — pd-card / pd-section-title */}
                <div className={`${CARD} p-6`}>
                  <SectionTitle>About this Property</SectionTitle>
                  <p className="text-slate-600 leading-[1.75] text-[0.95rem] m-0">
                    {property.description}
                  </p>
                </div>
 
                {/* AMENITIES — pd-card / pd-amenity */}
                <div className={`${CARD} p-6`}>
                  <SectionTitle>Amenities</SectionTitle>
                  {(property.features ?? []).length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(property.features ?? []).map((f: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#f8faff] rounded-[10px] border border-blue-100 text-[0.875rem] font-medium text-[#1e3a5f] hover:bg-blue-50 hover:border-blue-300 transition-colors duration-150 cursor-default"
                        >
                          <span className="text-blue-600 text-[0.95rem]">
                            <IconForFeature feature={f} />
                          </span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-[0.9rem] m-0">No amenities listed.</p>
                  )}
                </div>
 
                {/* POLICIES — pd-card / pd-policy-row */}
                <div className={`${CARD} p-6`}>
                  <SectionTitle>Booking & Policies</SectionTitle>
                  <div>
                    <div className="flex items-start gap-2.5 py-[11px] border-b border-slate-100 text-[0.9rem] text-slate-700">
                      <FaRegClock className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-slate-900">Rental Period:</strong>{" "}
                        {/* {property.minLeasePeriod} to {property.maxLeasePeriod} months */}
                          {property.minLeasePeriod === property.maxLeasePeriod
    ? `${property.minLeasePeriod} month${property.minLeasePeriod > 1 ? "s" : ""}`
    : `${property.minLeasePeriod} to ${property.maxLeasePeriod} months`}
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 py-[11px] text-[0.9rem] text-slate-700">
                      <FaShieldAlt className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-slate-900">Security:</strong>{" "}
                        Standard security deposit applies
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <Button variant="blue" onClick={handleBookNow}>Book Now</Button>
                  </div>
                </div>
 
                {/* LOCATION + OWNER — pd-loc-owner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 
                  {/* Location card */}
                  <div className={`${CARD} p-5`}>
                    <SectionTitle className="!mb-3">Location</SectionTitle>
                    <div className="text-slate-700 leading-[1.7] text-[0.9rem]">
                      <div className="font-bold text-slate-900">{property.city}, {property.district}</div>
                      <div>{property.state}</div>
                      <div className="text-slate-400 text-[0.82rem] mt-0.5">PIN: {property.pincode}</div>
                    </div>
                  </div>
 
                  {/* Owner card */}
                  <div className="bg-[#f8faff] rounded-2xl border border-slate-200 shadow-sm p-5">
                    <SectionTitle className="!mb-3.5">Listed By</SectionTitle>
                    <div className="flex items-center gap-3 mb-2.5">
                      {/* pd-owner-avatar */}
                      <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center text-white text-[1.3rem] font-bold flex-shrink-0">
                        {(property.owner?.name?.[0] ?? "O").toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-[0.95rem]">
                          {property.owner?.name ?? "Owner"}
                        </div>
                        {property.owner?.businessName && (
                          <div className="text-[0.78rem] text-slate-500">{property.owner.businessName}</div>
                        )}
                      </div>
                    </div>
                    {property.owner?.businessAddress && (
                      <div className="text-[0.82rem] text-slate-500 border-t border-[#e0e9ff] pt-2.5">
                        {property.owner.businessAddress}
                      </div>
                    )}
                  </div>
                </div>
 
                {/* REVIEWS — pd-card */}
                <div className={`${CARD} p-6`}>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-[18px]">
                    <SectionTitle className="!mb-0">Guest Reviews</SectionTitle>
                    {reviews.length > 0 && (
                      <span className={BADGE}>
                        {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
 
                  {/* pd-skeleton → animate-pulse */}
                  {reviewLoading && (
                    <div className="flex flex-col gap-2.5">
                      {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse bg-slate-200 rounded-lg h-20" />
                      ))}
                    </div>
                  )}
 
                  {!reviewLoading && reviews.length === 0 && (
                    <div className="text-center py-8 text-slate-400 rounded-xl bg-[#f8faff] border border-dashed border-blue-200">
                      <div className="text-[1.8rem] mb-2">💬</div>
                      <div className="font-semibold text-slate-600">No reviews yet</div>
                      <div className="text-[0.85rem] mt-1">Be the first to review this property.</div>
                    </div>
                  )}
 
                  {!reviewLoading && reviews.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {visibleReviews.map((review) => (
                        <div key={review.id} className="p-4 bg-[#f8faff] rounded-xl border border-[#e0e9ff]">
                          <Review review={review} />
                        </div>
                      ))}
                    </div>
                  )}
 
                  {reviews.length > PREVIEW_COUNT && (
                    <button
                      onClick={() => setShowAllReviews((prev) => !prev)}
                      className="mt-4 bg-transparent border-0 text-blue-600 font-bold text-[0.875rem] cursor-pointer p-0"
                    >
                      {showAllReviews ? "Show fewer reviews ↑" : `View all ${reviews.length} reviews ↓`}
                    </button>
                  )}
                </div>
 
              </div>
              {/* ═══ END LEFT ═══ */}
 
              {/* ═══ STICKY BOOKING PANEL ═══ — pd-booking / pd-booking-header */}
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-[20px] border border-blue-100 shadow-[0_4px_24px_rgba(37,99,235,0.10)] overflow-hidden">
 
                  {/* Booking header — gradient via Tailwind, circles via .booking-header CSS */}
                  <div className="booking-header relative px-[22px] py-6 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
                    <div className="relative z-[1]">
                      <div className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-white/55 mb-1">
                        Monthly Rent
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[2rem] font-extrabold text-white">
                          ₹{property.pricePerMonth?.toLocaleString("en-IN")}
                        </span>
                        <span className="text-white/50 text-[0.9rem]">/month</span>
                      </div>
                      <div className="mt-1.5 text-[0.8rem] text-white/45">
                        {/* Lease: {property.minLeasePeriod}–{property.maxLeasePeriod} months */}
                          {property.minLeasePeriod === property.maxLeasePeriod
    ? `Rent: ${property.minLeasePeriod} month${property.minLeasePeriod > 1 ? "s" : ""}`
    : `Rent: ${property.minLeasePeriod}–${property.maxLeasePeriod} months`}
                      </div>
                    </div>
                  </div>
 
                  {/* Form body */}
                  <div className="p-5 flex flex-col gap-3.5">
 
                    {/* Check-in */}
                    <div>
                      <label className={LABEL}>Check-in Date</label>
                      <ReactDatePicker
                        selected={checkIn ? new Date(checkIn) : null}
                        onChange={(date: Date | null) =>
                          setCheckIn(date ? date.toISOString().split("T")[0] : "")
                        }
                        minDate={new Date()}
                        filterDate={isStartDateValid}
                        placeholderText="Select check-in date"
                        dateFormat="dd MMM yyyy"
                      />
                    </div>
 
                    {/* Rental period — pd-input */}
                    <div>
                      <label className={LABEL}>Rental Period (months)</label>
                      <input
                        type="number"
                        min={property?.minLeasePeriod || 1}
                        max={property?.maxLeasePeriod || 12}
                        value={rentalPeriod}
                        onChange={(e) => setRentalPeriod(Number(e.target.value))}
                        className={INPUT}
                      />
                      <div className="text-[0.72rem] text-slate-400 mt-1">
                        {/* Min {property.minLeasePeriod} — Max {property.maxLeasePeriod} months */}
                          {property.minLeasePeriod === property.maxLeasePeriod
    ? `Rent: ${property.minLeasePeriod} month${property.minLeasePeriod > 1 ? "s" : ""}`
    : `Rent: ${property.minLeasePeriod}–${property.maxLeasePeriod} months`}
                      </div>
                    </div>
 
                    {/* Guests */}
                    <div>
                      <label className={LABEL}>Guests</label>
                      <input
                        type="number"
                        min={1}
                        max={property?.maxGuests ?? 10}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className={INPUT}
                      />
                    </div>
 
                    <Button variant="checkBlue" onClick={handleCheckAvailability}>
                      Check Availability
                    </Button>
 
                    {/* pd-avail ok / err */}
                    {availabilityMessage && (
                      <div
                        className={`mt-0.5 px-3.5 py-[11px] rounded-[10px] text-[0.875rem] font-semibold flex items-center gap-2 border ${
                          isAvailable
                            ? "bg-green-50 text-green-800 border-green-200"
                            : "bg-red-50 text-red-800 border-red-200"
                        }`}
                      >
                        <FaCheckCircle className="flex-shrink-0" />
                        {availabilityMessage}
                      </div>
                    )}
 
                    {/* Commented out in source — kept commented */}
                    {/* <div className="border-t border-slate-200 pt-3.5">
                      <button className="w-full py-[13px] bg-gradient-to-br from-blue-900 to-blue-600 text-white border-0 rounded-xl text-[0.95rem] font-bold cursor-pointer shadow-[0_4px_14px_rgba(37,99,235,0.28)] hover:opacity-90 hover:-translate-y-px transition-all"
                        onClick={handleBookNow}>
                        Book Now →
                      </button>
                    </div> */}
 
                    <div className="flex items-center justify-center gap-1.5 text-[0.75rem] text-slate-400">
                      <FaShieldAlt className="text-blue-500" />
                      Secure booking · No hidden charges
                    </div>
 
                  </div>
                </div>
              </div>
              {/* ═══ END SIDEBAR ═══ */}
 
            </div>
          </div>
        )}
 
        {/* GALLERY MODAL */}
        {galleryOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/85 flex items-center justify-center p-4">
            <div className="relative max-w-[900px] w-full">
              <button
                onClick={() => setGalleryOpen(false)}
                aria-label="Close gallery"
                className="absolute right-3 top-3 bg-white border-0 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer z-[51] text-slate-900"
              >
                <FaTimes />
              </button>
 
              <div className="bg-slate-900 rounded-[14px] overflow-hidden">
                <div className="w-full h-[70vh] flex items-center justify-center">
                  {images.length > 0 ? (
                    <img src={images[mainIndex]} alt={`gallery ${mainIndex}`}
                      className="max-h-[70vh] object-contain" />
                  ) : (
                    <div className="text-white">No images</div>
                  )}
                </div>
 
                <div className="p-3 flex items-center gap-2 overflow-x-auto bg-slate-800">
                  <button
                    onClick={() => setMainIndex((i) => (i - 1 + images.length) % images.length)}
                    className="px-2.5 py-1.5 bg-white border-0 rounded-md cursor-pointer"
                  >
                    <FaChevronLeft />
                  </button>
 
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setMainIndex(i)}
                      className={`flex-shrink-0 rounded-md overflow-hidden cursor-pointer bg-transparent p-0 border-2 ${
                        i === mainIndex ? "border-blue-500" : "border-transparent"
                      }`}
                    >
                      <img src={src} alt={`thumb ${i}`}
                        className="w-[88px] h-[60px] object-cover block" />
                    </button>
                  ))}
 
                  <button
                    onClick={() => setMainIndex((i) => (i + 1) % images.length)}
                    className="px-2.5 py-1.5 bg-white border-0 rounded-md cursor-pointer"
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
 
      </div>
    </>
  );
};
 
export default UserPropertyDetails;

