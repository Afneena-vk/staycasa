
import React, { useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Property } from "../../stores/slices/propertySlice";
import Header from "../../components/User/Header";
import Footer from "../../components/User/Footer";
import PropertyFilterSidebar from "../../components/Filters/PropertyFilterSidebar";
import SearchBar from "../../components/common/SearchBar";

const ActivePropertiesUser: React.FC = () => {
  const properties = useAuthStore((state) => state.properties);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const getActivePropertiesForUser = useAuthStore(
    (state) => state.getActivePropertiesForUser
  );

  useEffect(() => {
    getActivePropertiesForUser();
  }, []);

 const handleSearch = (query: string) => {
    //getActivePropertiesForUser({ search: query });
  };


  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <p>Loading active properties...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );

  if (!properties || properties.length === 0)
    return (
      <div>
        <Header />
        <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
          No active properties found.
        </div>
        <Footer />
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 mt-10 py-10">
        {/* <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Active Properties
        </h2> */}
         <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

         <div className="flex flex-col lg:flex-row gap-8">
           <div className="w-full lg:w-1/4">
            <PropertyFilterSidebar />
          </div>

           <div className="w-full lg:w-3/4">
            {(!properties || properties.length === 0) ? (
              <p className="text-gray-500 text-center">No active properties found.</p>
            ) : (

         <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property: Property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5"
            >
              {/* Images */}
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {property.title}
              </h3>

              {/* <p className="text-gray-600 mb-1">{property.type}</p> */}

              <p className="text-gray-500 text-sm mb-2">
                {property.city}, {property.district}, {property.state}
              </p>

              <p className="text-gray-900 font-bold text-lg mb-3">
                ₹{property.pricePerMonth}/month
              </p>
              

              {/* <div className="flex justify-between text-sm text-gray-600 mb-3">
                <span>Bedrooms: {property.bedrooms}</span>
                <span>Bathrooms: {property.bathrooms}</span>
              </div> */}

              {/* <p className="text-sm text-green-600 font-medium mb-3">
                Status: {property.status}
              </p> */}

              {/* {property.owner && (
                <div className="text-sm text-gray-500 mt-2">
                  <p className="font-semibold">Owner Info:</p>
                  <p>{property.owner.name}</p>
                  <p>{property.owner.email}</p>
                </div>
              )} */}
            </div>
          ))}
            </div>
</>
            )}
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActivePropertiesUser;
