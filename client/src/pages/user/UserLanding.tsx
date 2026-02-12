// import React, {useEffect} from "react";
// import Header from "../../components/User/Header";
// import Footer from "../../components/User/Footer";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../../stores/authStore";
// const UserLanding: React.FC = () => {

//   const navigate = useNavigate();
//     const {
//     fetchLatestActiveProperties,
//     latestProperties,
//     isLoading,
//   } = useAuthStore();

//   useEffect(() => {
//     fetchLatestActiveProperties(6);
//   }, []);
//   const { isAuthenticated } = useAuthStore(); 
//   // const handleBookStay = () => {
//   //   if (isAuthenticated) {
      
//   //     navigate("/user/properties");
//   //   } else {
     
//   //     navigate("/user/login"); 
//   //   }
//   // };
//   const handleBookStay = () => {
//   navigate("/user/properties"); 
// };


//   return (
//     <div className="flex flex-col min-h-screen">
     
//       <Header />

    
//       {/* <section className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white pt-28 pb-20"> */}
      
//       <section className="flex-1 bg-gradient-to-r from-blue-950 to-blue-800 text-white pt-28 pb-20">
//         <div className="container mx-auto px-6 text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-6">
//             Your Dream Vacation Starts Here
//           </h1>
//           <p className="text-lg max-w-2xl mx-auto mb-8">
//             Discover and book unique vacation homes, cabins, and villas across the globe.
//             Your perfect getaway is just a few clicks away.
//           </p>

//           {/* <Link
//             to="/destinations"
//             className="bg-white text-blue-950 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
//           >
//             Explore Now
//           </Link> */}
//           <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
//             {/* <Link
//               to="/properties"
//               className="bg-white text-blue-950 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
//             >
//               Book a Stay
//             </Link> */}
//             <button
//     onClick={handleBookStay}
//     className="bg-white text-blue-950 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
//   >
//     Book a Stay
//   </button>

//             <Link
//               to="/owner/signup"
//               className="bg-transparent border border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-blue-950 transition"
//             >
//               Host Your Place
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Featured Destinations */}
//       <section className="py-16 bg-gray-50">
//         <div className="container mx-auto px-6">
//           <h2 className="text-3xl  text-blue-950  font-bold text-center mb-12">Featured Destinations</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Card */}
//             {/* {["Bali", "Santorini", "Swiss Alps"].map((place, i) => (
//               <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden">
//                 <img
//                   src={`https://source.unsplash.com/600x400/?${place}`}
//                   alt={place}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-6">
//                   <h3 className="text-xl font-semibold">{place}</h3>
//                   <p className="text-gray-600 mt-2">
//                     Experience the beauty of {place} with stunning views and luxurious stays.
//                   </p>
//                 </div>
//               </div>
//             ))} */}
//             {latestProperties.map((property) => (
//   <div
//     key={property._id}
//     className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
//     onClick={() => navigate(`/user/properties/${property._id}`)}
//   >
//     <img
//       src={property.images?.[0] || "/placeholder.jpg"}
//       alt={property.title}
//       className="w-full h-48 object-cover"
//     />
//     <div className="p-6">
//       <h3 className="text-xl font-semibold">{property.title}</h3>
//       <p className="text-gray-600 mt-2">
//         {property.location?.city}, {property.location?.state}
//       </p>
//       <p className="text-sm text-gray-500 mt-1">
//         ₹ {property.pricePerMonth} / month
//       </p>
//     </div>
//   </div>
// ))}

//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />
//     </div>
//   );
// };

// export default UserLanding;

import React, { useEffect, useCallback, useMemo } from "react";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { Property } from "../../types/property";

const HERO_IMAGE = "https://res.cloudinary.com/dvqdfv7yt/image/upload/images_5_detqkr.jpg";


const PropertyCard = React.memo(
  ({ property, onClick }: { property: Property; onClick: (id: string) => void }) => {
    return (
      <div
        className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
        onClick={() => onClick(property.id)}
      >
        <div className="relative overflow-hidden">
          <img
            src={property.images?.[0] || "/placeholder.jpg"}
            alt={property.title}
            className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {property.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {/* {property.city}, {property.location?.state} */}
            {property.city}, {property.district}, {property.state}
          </p>
          <p className="text-blue-900 font-semibold mt-2">
            ₹ {property.pricePerMonth} / month
          </p>
        </div>
      </div>
    );
  }
);

const UserLanding: React.FC = () => {
  const navigate = useNavigate();

  const {
    fetchLatestActiveProperties,
    latestProperties,
    isLoading,
  } = useAuthStore();

  useEffect(() => {
    fetchLatestActiveProperties(6);
  }, [fetchLatestActiveProperties]);

  const handleBookStay = useCallback(() => {
    navigate("/user/properties");
  }, [navigate]);

  const handleCardClick = useCallback(
    // (id: string) => {
    (id: string) => {
      navigate(`/user/properties/${id}`);
    },
    [navigate]
  );

  const latestCards = useMemo(() => {
    return latestProperties.map((property) => (
      <PropertyCard
        key={property.id}
        property={property}
        onClick={handleCardClick}
      />
    ));
  }, [latestProperties, handleCardClick]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* HERO SECTION */}
      {/* <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white pt-28 pb-24">
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] opacity-10" />
        <div className="relative container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Find Your Perfect Stay, <br className="hidden md:block" /> Month by
            Month
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-blue-100">
            Flexible monthly stays in verified vacation homes, villas and
            apartments. Designed for comfort, work, and lifestyle.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={handleBookStay}
              className="bg-white text-blue-950 font-semibold px-10 py-4 rounded-xl hover:bg-gray-100 transition shadow-lg"
            >
              Explore Stays
            </button>

            <Link
              to="/owner/signup"
              className="border border-white/70 text-white font-semibold px-10 py-4 rounded-xl hover:bg-white hover:text-blue-950 transition"
            >
              Become a Host
            </Link>
          </div>
        </div>
      </section> */}
      {/* HERO SECTION */}
<section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden text-white">
  {/* Background Image */}
  <img
    src="https://res.cloudinary.com/dvqdfv7yt/image/upload/images_5_detqkr.jpg"
    alt="Vacation home stay"
    className="absolute inset-0 h-full w-full object-cover"
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/50" />

  {/* Content */}
  <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
      Find Your Perfect Short-Term Stay
    </h1>

    <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-gray-200">
      Comfortable, verified vacation homes for monthly stays – move in with ease.
    </p>

    <div className="flex flex-col sm:flex-row gap-4">
      <button
        onClick={handleBookStay}
        className="bg-white text-blue-950 font-semibold px-10 py-4 rounded-xl hover:bg-gray-100 transition shadow-xl"
      >
        Explore Stays
      </button>

      <Link
        to="/owner/signup"
        className="border border-white text-white font-semibold px-10 py-4 rounded-xl hover:bg-white hover:text-blue-950 transition"
      >
        Become a Host
      </Link>
    </div>
  </div>
</section>


      {/* LATEST PROPERTIES */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950">
              Latest Stays
            </h2>
            <button
              onClick={handleBookStay}
              className="text-blue-900 font-medium hover:underline"
            >
              View all →
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 bg-gray-200 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : latestProperties.length === 0 ? (
            <p className="text-center text-gray-500">
              No properties available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {latestCards}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default UserLanding;

