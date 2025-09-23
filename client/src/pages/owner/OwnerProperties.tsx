
// import { useState, useEffect } from "react";
// import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
// //import OwnerLayout from "../../layouts/Owner/OwnerLayout";
// import OwnerLayout from "../../layouts/owner/OwnerLayout";
// import { useAuthStore } from "../../stores/authStore";
// import { useNavigate } from "react-router-dom";


// // interface Property {
// //   id: string;
// //   title: string;
// //   location: string;
// //   status: "Approved" | "Pending" | "Rejected";
// //   price: number;
// //   bookings: number;
// //   image: string;
// // }

// interface Property {
//   id: string;
//   title: string;
//   type: string;
//   description: string;
//   houseNumber: string;
//   street: string;
//   city: string;
//   district: string;
//   state: string;
//   pincode: number;
//   pricePerMonth: number;
//   bedrooms: number;
//   bathrooms: number;
//   furnishing: string;
//   maxGuests: number;
//   minLeasePeriod: number;
//   maxLeasePeriod: number;
//   features: string[];
//   images: string[];
//   status: "pending" | "active" | "blocked" | "booked" | "rejected";
//   createdAt: Date;
// }


// // const dummyProperties: Property[] = [
// //   {
// //     id: "1",
// //     title: "Cozy Beach House",
// //     location: "Goa, India",
// //     status: "Approved",
// //     price: 120,
// //     bookings: 12,
// //     image: "https://via.placeholder.com/150",
// //   },
// //   {
// //     id: "2",
// //     title: "Mountain View Cottage",
// //     location: "Manali, India",
// //     status: "Pending",
// //     price: 80,
// //     bookings: 5,
// //     image: "https://via.placeholder.com/150",
// //   },
// //   {
// //     id: "3",
// //     title: "City Center Apartment",
// //     location: "Mumbai, India",
// //     status: "Rejected",
// //     price: 100,
// //     bookings: 2,
// //     image: "https://via.placeholder.com/150",
// //   },
// // ];

// const OwnerProperties = () => {
//   const [searchTerm, setSearchTerm] = useState("");
  
//  // const {userData} = useAuthStore();
//  const { userData, getOwnerProperties, properties, isLoading, error } =
//   useAuthStore((state) => ({
//       userData: state.userData,
//       getOwnerProperties: state.getOwnerProperties,
//       properties: state.properties as Property[],
//       isLoading: state.isLoading,
//       error: state.error,
//     }));

//   const isApproved = userData?.approvalStatus === 'approved';
//   const navigate = useNavigate(); 

//   useEffect(() => {
//     if (isApproved) {
//       getOwnerProperties();
//     }
//   }, [isApproved, getOwnerProperties]);

//   const handleAddProperty = () => {
//     if (isApproved) {
//       navigate("/owner/add-property"); // ✅ navigate to add property page
//     }
//   };

//   // const filteredProperties = dummyProperties.filter((property) =>
//   //   property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //   property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //   property.status.toLowerCase().includes(searchTerm.toLowerCase())
//   // );

//     const filteredProperties = properties?.filter(
//     (property) =>
//       property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       property.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       property.type.toLowerCase().includes(searchTerm.toLowerCase())
//   ) || [];

//   const getStatusInfo = (status: Property['status']) => {
//     switch (status) {
//       case 'active':
//         return { text: 'Active', color: 'bg-green-100 text-green-600' };
//       case 'pending':
//         return { text: 'Pending', color: 'bg-yellow-100 text-yellow-600' };
//       case 'blocked':
//         return { text: 'Blocked', color: 'bg-red-100 text-red-600' };
//       case 'booked':
//         return { text: 'Booked', color: 'bg-blue-100 text-blue-600' };
//       case 'rejected':
//         return { text: 'Rejected', color: 'bg-red-100 text-red-600' };
//       default:
//         return { text: status, color: 'bg-gray-100 text-gray-600' };
//     }
//   };

//   return (
//     <OwnerLayout>
//       {/* Header + Add Button */}
//       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
//         <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
//           My Properties
//         </h1>
//         {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition">
//           <FaPlus /> Add New Property
//         </button> */}

//         <button 
//           onClick={handleAddProperty}
//           disabled={!isApproved}
//           className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition ${
//           isApproved 
//           ? 'bg-blue-600 hover:bg-blue-700 text-white' 
//           : 'bg-gray-400 cursor-not-allowed text-gray-200'
//   }`}
// >
//   <FaPlus /> 
//   Add New Property
// </button>


//       </div>
//       {!isApproved && (
//   <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
//     <div className="flex items-center">
//       <div className="ml-3">
//         <p className="text-sm text-yellow-700">
//           <strong>Account Pending Approval:</strong> 
//           {userData?.approvalStatus === 'pending' && " Your account is under review. You cannot add properties until approved."}
//           {userData?.approvalStatus === 'rejected' && " Your account has been rejected. Please contact support."}
//         </p>
//       </div>
//     </div>
//   </div>
// )}

//       {/* Search Bar */}
//       <div className="flex items-center gap-2 mb-6">
//         <div className="relative w-full max-w-sm">
//           <FaSearch className="absolute left-3 top-3 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by title, location, or status..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//         {/* Loading & Error States */}
//       {isLoading && (
//         <p className="text-center text-gray-500">Loading properties...</p>
//       )}
//       {error && <p className="text-center text-red-500">{error}</p>}


//       {/* Summary Cards */}
//       {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//           <h2 className="text-sm text-slate-500">Total Properties</h2>
//           <p className="text-xl font-bold">{dummyProperties.length}</p>
//         </div>
//         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//           <h2 className="text-sm text-slate-500">Approved</h2>
//           <p className="text-xl font-bold">
//             {dummyProperties.filter((p) => p.status === "Approved").length}
//           </p>
//         </div>
//         <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//           <h2 className="text-sm text-slate-500">Pending</h2>
//           <p className="text-xl font-bold">
//             {dummyProperties.filter((p) => p.status === "Pending").length}
//           </p>
//         </div>
//       </div> */}

//             {properties && properties.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
//           <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//             <h2 className="text-sm text-slate-500">Total Properties</h2>
//             <p className="text-xl font-bold">{properties.length}</p>
//           </div>
//           <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//             <h2 className="text-sm text-slate-500">Active</h2>
//             <p className="text-xl font-bold">
//               {properties.filter((p) => p.status === "active").length}
//             </p>
//           </div>
//           <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//             <h2 className="text-sm text-slate-500">Pending</h2>
//             <p className="text-xl font-bold">
//               {properties.filter((p) => p.status === "pending").length}
//             </p>
//           </div>
//           <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//             <h2 className="text-sm text-slate-500">Booked</h2>
//             <p className="text-xl font-bold">
//               {properties.filter((p) => p.status === "booked").length}
//             </p>
//           </div>
//         </div>
//       )}
// <div className="overflow-x-auto">
//         <table className="min-w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
//           <thead className="bg-slate-100 dark:bg-slate-700">
//             <tr>
//               <th className="px-4 py-2 text-left">Image</th>
//               <th className="px-4 py-2 text-left">Title</th>
//               <th className="px-4 py-2 text-left">Type</th>
//               <th className="px-4 py-2 text-left">Location</th>
//               <th className="px-4 py-2 text-left">Status</th>
//               <th className="px-4 py-2 text-left">Price/Month</th>
//               <th className="px-4 py-2 text-left">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredProperties.length > 0 ? (
//               filteredProperties.map((property) => {
//                 const statusInfo = getStatusInfo(property.status);
//                 return (
//                   <tr
//                     key={property.id}
//                     className="border-t dark:border-slate-700"
//                   >
//                     <td className="px-4 py-2">
//                       <img
//                         src={property.images?.[0] || "https://via.placeholder.com/150"}
//                         alt={property.title}
//                         className="w-16 h-16 rounded-lg object-cover"
//                       />
//                     </td>
//                     <td className="px-4 py-2 font-medium">{property.title}</td>
//                     <td className="px-4 py-2">{property.type}</td>
//                     <td className="px-4 py-2">
//                       {property.city}, {property.state}
//                     </td>
//                     <td className="px-4 py-2">
//                       <span
//                         className={`px-3 py-1 text-xs rounded-full ${statusInfo.color}`}
//                       >
//                         {statusInfo.text}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2">₹{property.pricePerMonth.toLocaleString()}</td>
//                     <td className="px-4 py-2 flex gap-2">
//                       <button
//                         disabled={!isApproved}
//                         className={`p-2 rounded-lg ${
//                           isApproved
//                             ? "bg-blue-500 hover:bg-blue-600 text-white"
//                             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                         }`}
//                         title="View Property"
//                       >
//                         <FaEye size={14} />
//                       </button>
//                       <button
//                         disabled={!isApproved || property.status === "booked"}
//                         className={`p-2 rounded-lg ${
//                           isApproved && property.status !== "booked"
//                             ? "bg-green-500 hover:bg-green-600 text-white"
//                             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                         }`}
//                         title="Edit Property"
//                       >
//                         <FaEdit size={14} />
//                       </button>
//                       <button
//                         disabled={!isApproved || property.status === "booked"}
//                         className={`p-2 rounded-lg ${
//                           isApproved && property.status !== "booked"
//                             ? "bg-red-500 hover:bg-red-600 text-white"
//                             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                         }`}
//                         title="Delete Property"
//                       >
//                         <FaTrash size={14} />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               !isLoading && (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="text-center py-4 text-gray-500"
//                   >
//                     {searchTerm ? "No properties found matching your search" : "No properties found"}
//                   </td>
//                 </tr>
//               )
//             )}
//           </tbody>
//         </table>
//       </div>
      
//     </OwnerLayout>
//   );
// };

// export default OwnerProperties;



// // {/* Properties Table */}
// //       <div className="overflow-x-auto">
// //         <table className="min-w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
// //           <thead className="bg-slate-100 dark:bg-slate-700">
// //             <tr>
// //               <th className="px-4 py-2 text-left">Image</th>
// //               <th className="px-4 py-2 text-left">Title</th>
// //               <th className="px-4 py-2 text-left">Location</th>
// //               <th className="px-4 py-2 text-left">Status</th>
// //               <th className="px-4 py-2 text-left">Price/Night</th>
// //               <th className="px-4 py-2 text-left">Bookings</th>
// //               <th className="px-4 py-2 text-left">Actions</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredProperties.length > 0 ? (
// //               filteredProperties.map((property) => (
// //                 <tr
// //                   key={property.id}
// //                   className="border-t dark:border-slate-700"
// //                 >
// //                   <td className="px-4 py-2">
// //                     <img
// //                       src={property.image}
// //                       alt={property.title}
// //                       className="w-16 h-16 rounded-lg object-cover"
// //                     />
// //                   </td>
// //                   <td className="px-4 py-2 font-medium">{property.title}</td>
// //                   <td className="px-4 py-2">{property.location}</td>
// //                   <td className="px-4 py-2">
// //                     <span
// //                       className={`px-3 py-1 text-xs rounded-full ${
// //                         property.status === "Approved"
// //                           ? "bg-green-100 text-green-600"
// //                           : property.status === "Pending"
// //                           ? "bg-yellow-100 text-yellow-600"
// //                           : "bg-red-100 text-red-600"
// //                       }`}
// //                     >
// //                       {property.status}
// //                     </span>
// //                   </td>
// //                   <td className="px-4 py-2">${property.price}</td>
// //                   <td className="px-4 py-2">{property.bookings}</td>
// //                   <td className="px-4 py-2 flex gap-2">
// //                     {/* <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
// //                       <FaEye size={14} />
// //                     </button>
// //                     <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
// //                       <FaEdit size={14} />
// //                     </button>
// //                     <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
// //                       <FaTrash size={14} />
// //                     </button> */}
// //                     <button 
// //                     disabled={!isApproved}
// //                     className={`p-2 rounded-lg ${isApproved ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
// //                     >
// //                    <FaEye size={14} />
// //                    </button>
// //                    <button 
// //                    disabled={!isApproved}
// //                    className={`p-2 rounded-lg ${isApproved ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
// //                    >
// //                    <FaEdit size={14} />
// //                    </button>
// //                    <button 
// //                    disabled={!isApproved}
// //                    className={`p-2 rounded-lg ${isApproved ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
// //                    >
// //                   <FaTrash size={14} />
// //                   </button>
// //                   </td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan={7} className="text-center py-4 text-gray-500">
// //                   No properties found
// //                 </td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>













// import { useEffect, useState } from "react";
// import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
// import OwnerLayout from "../../layouts/owner/OwnerLayout";
// import { useAuthStore } from "../../stores/authStore";
// import { useNavigate } from "react-router-dom";

// // Define the Property interface to match your backend model
// interface Property {
//   id: string;
//   title: string;
//   type: string;
//   description: string;
//   houseNumber: string;
//   street: string;
//   city: string;
//   district: string;
//   state: string;
//   pincode: number;
//   pricePerMonth: number;
//   bedrooms: number;
//   bathrooms: number;
//   furnishing: string;
//   maxGuests: number;
//   minLeasePeriod: number;
//   maxLeasePeriod: number;
//   features: string[];
//   images: string[];
//   status: "pending" | "active" | "blocked" | "booked" | "rejected";
//   createdAt: Date;
// }

// const OwnerProperties = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [localError, setLocalError] = useState<string | null>(null);

//   // try {
//     // const { userData, getOwnerProperties, properties, isLoading, error } =
//     //   useAuthStore((state) => ({
//     //     userData: state.userData,
//     //     getOwnerProperties: state.getOwnerProperties,
//     //     properties: state.properties,
//     //     isLoading: state.isLoading,
//     //     error: state.error,
//     //   }));
//     const userData = useAuthStore((state) => state.userData);
// const getOwnerProperties = useAuthStore((state) => state.getOwnerProperties);
// const properties = useAuthStore((state) => state.properties);
// const isLoading = useAuthStore((state) => state.isLoading);
// const error = useAuthStore((state) => state.error);
// const deleteProperty = useAuthStore((state) => state.deleteProperty);
// // const { deleteProperty } = useAuthStore((state) => ({
// //   deleteProperty: state.deleteProperty,
// // }));

// // Add this here

// // const handleDelete = async (propertyId: string) => {
// //   const confirmDelete = window.confirm(
// //     "Are you sure you want to delete this property?"
// //   );
// //   if (!confirmDelete) return;

// //   try {
// //     await deleteProperty(propertyId);
// //     alert("Property deleted successfully!");
// //   } catch (err) {
// //     console.error("Error deleting property:", err);
// //     alert("Failed to delete property.");
// //   }
// // };

//     const isApproved = userData?.approvalStatus === "approved";
//     const navigate = useNavigate();

//     // useEffect(() => {
//     //   try {
//     //     if (isApproved && getOwnerProperties) {
//     //       getOwnerProperties();
//     //     }
//     //   } catch (err) {
//     //     console.error("Error fetching properties:", err);
//     //     setLocalError("Failed to fetch properties");
//     //   }
//     // }, [isApproved, getOwnerProperties]);
// //     useEffect(() => {
// //   if (isApproved) {
// //     getOwnerProperties?.();
// //   }
// // }, [isApproved]);
// useEffect(() => {
//     if (isApproved) {
//       getOwnerProperties?.().catch((err) => {
//         console.error("Error fetching properties:", err);
//         setLocalError("Failed to fetch properties");
//       });
//     }
//   }, [isApproved, getOwnerProperties]);


//     const handleAddProperty = () => {
//       try {
//         if (isApproved) {
//           navigate("/owner/add-property");
//         }
//       } catch (err) {
//         console.error("Navigation error:", err);
//         setLocalError("Navigation failed");
//       }
//     };

//      const handleDelete = async (propertyId: string) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this property?"
//     );
//     if (!confirmDelete) return;

//     try {
//       await deleteProperty(propertyId);
//       alert("Property deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting property:", err);
//       alert("Failed to delete property.");
//     }
//   };

//     // Safe array handling for properties
//     const safeProperties = Array.isArray(properties) ? properties : [];

//     // Apply search filter with safe property access
//     const filteredProperties = safeProperties.filter((property) => {
//       if (!property) return false;
      
//       const title = property.title || "";
//       const city = property.city || "";
//       const status = property.status || "";
//       const type = property.type || "";
      
//       return (
//         title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         city.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         status.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         type.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     });

//     // Helper function to get status display text and color
//     const getStatusInfo = (status: string) => {
//       switch (status) {
//         case 'active':
//           return { text: 'Active', color: 'bg-green-100 text-green-600' };
//         case 'pending':
//           return { text: 'Pending', color: 'bg-yellow-100 text-yellow-600' };
//         case 'blocked':
//           return { text: 'Blocked', color: 'bg-red-100 text-red-600' };
//         case 'booked':
//           return { text: 'Booked', color: 'bg-blue-100 text-blue-600' };
//         case 'rejected':
//           return { text: 'Rejected', color: 'bg-red-100 text-red-600' };
//         default:
//           return { text: status || 'Unknown', color: 'bg-gray-100 text-gray-600' };
//       }
//     };

//     // Safe count function
//     const getStatusCount = (statusType: string) => {
//       return safeProperties.filter((p) => p && p.status === statusType).length;
//     };

//     return (
//       <OwnerLayout>
//         {/* Header + Add Button */}
//         <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
//           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
//             My Properties
//           </h1>

//           <button
//             onClick={handleAddProperty}
//             disabled={!isApproved}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition ${
//               isApproved
//                 ? "bg-blue-600 hover:bg-blue-700 text-white"
//                 : "bg-gray-400 cursor-not-allowed text-gray-200"
//             }`}
//           >
//             <FaPlus />
//             Add New Property
//           </button>
//         </div>

//         {!isApproved && (
//           <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
//             <p className="text-sm text-yellow-700">
//               <strong>Account Pending Approval:</strong>
//               {userData?.approvalStatus === "pending" &&
//                 " Your account is under review. You cannot add properties until approved."}
//               {userData?.approvalStatus === "rejected" &&
//                 " Your account has been rejected. Please contact support."}
//             </p>
//           </div>
//         )}

//         {/* Search Bar */}
//         <div className="flex items-center gap-2 mb-6">
//           <div className="relative w-full max-w-sm">
//             <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search by title, location, type, or status..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         </div>

//         {/* Loading & Error States */}
//         {isLoading && (
//           <p className="text-center text-gray-500">Loading properties...</p>
//         )}
        
//         {(error || localError) && (
//           <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
//             <p className="text-red-700">{error || localError}</p>
//           </div>
//         )}

//         {/* Summary Cards */}
//         {safeProperties.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
//             <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//               <h2 className="text-sm text-slate-500">Total Properties</h2>
//               <p className="text-xl font-bold">{safeProperties.length}</p>
//             </div>
//             <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//               <h2 className="text-sm text-slate-500">Active</h2>
//               <p className="text-xl font-bold">{getStatusCount("active")}</p>
//             </div>
//             <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//               <h2 className="text-sm text-slate-500">Pending</h2>
//               <p className="text-xl font-bold">{getStatusCount("pending")}</p>
//             </div>
//             <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
//               <h2 className="text-sm text-slate-500">Booked</h2>
//               <p className="text-xl font-bold">{getStatusCount("booked")}</p>
//             </div>
//           </div>
//         )}

//         {/* Properties Table */}
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
//             <thead className="bg-slate-100 dark:bg-slate-700">
//               <tr>
//                 <th className="px-4 py-2 text-left">Image</th>
//                 <th className="px-4 py-2 text-left">Title</th>
//                 <th className="px-4 py-2 text-left">Type</th>
//                 <th className="px-4 py-2 text-left">Location</th>
//                 <th className="px-4 py-2 text-left">Status</th>
//                 <th className="px-4 py-2 text-left">Price/Month</th>
//                 <th className="px-4 py-2 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredProperties.length > 0 ? (
//                 filteredProperties.map((property) => {
//                   if (!property || !property.id) return null;
                  
//                   const statusInfo = getStatusInfo(property.status);
//                   const priceFormatted = property.pricePerMonth 
//                     ? property.pricePerMonth.toLocaleString() 
//                     : '0';
                  
//                   return (
//                     <tr
//                       key={property.id}
//                       className="border-t dark:border-slate-700"
//                     >
//                       <td className="px-4 py-2">
//                         <img
//                           src={
//                             property.images && property.images.length > 0
//                               ? property.images[0]
//                               : "https://via.placeholder.com/150"
//                           }
//                           alt={property.title || "Property"}
//                           className="w-16 h-16 rounded-lg object-cover"
//                           onError={(e) => {
//                             const target = e.target as HTMLImageElement;
//                             target.src = "https://via.placeholder.com/150";
//                           }}
//                         />
//                       </td>
//                       <td className="px-4 py-2 font-medium">
//                         {property.title || "No Title"}
//                       </td>
//                       <td className="px-4 py-2">{property.type || "N/A"}</td>
//                       <td className="px-4 py-2">
//                         {property.city || "N/A"}, {property.state || "N/A"}
//                       </td>
//                       <td className="px-4 py-2">
//                         <span
//                           className={`px-3 py-1 text-xs rounded-full ${statusInfo.color}`}
//                         >
//                           {statusInfo.text}
//                         </span>
//                       </td>
//                       <td className="px-4 py-2">₹{priceFormatted}</td>
//                       <td className="px-4 py-2 flex gap-2">
//                         <button
//                           disabled={!isApproved}
//                           onClick={()=> navigate(`/owner/properties/${property.id}`)}
//                           className={`p-2 rounded-lg ${
//                             isApproved
//                               ? "bg-blue-500 hover:bg-blue-600 text-white"
//                               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           }`}
//                           title="View Property"
//                         >
//                           <FaEye size={14} />
//                         </button>
//                         <button
//                           disabled={!isApproved || property.status === "booked"  as Property["status"]}
//                           onClick={()=> navigate(`/owner/properties/${property.id}/edit`)}
//                           className={`p-2 rounded-lg ${
//                             isApproved && property.status !== "booked"  as Property["status"]
//                               ? "bg-green-500 hover:bg-green-600 text-white"
//                               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           }`}
//                           title="Edit Property"
//                         >
//                           <FaEdit size={14} />
//                         </button>
//                         <button
//                           disabled={!isApproved || property.status === "booked"  as Property["status"]}
//                           onClick={() => handleDelete(property.id)}
//                           className={`p-2 rounded-lg ${
//                             isApproved && property.status !== "booked"  as Property["status"]
//                               ? "bg-red-500 hover:bg-red-600 text-white"
//                               : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                           }`}
//                           title="Delete Property"
//                         >
//                           <FaTrash size={14} />
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 !isLoading && (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="text-center py-8 text-gray-500"
//                     >
//                       {searchTerm 
//                         ? "No properties found matching your search" 
//                         : "No properties found"}
//                     </td>
//                   </tr>
//                 )
//               )}
//             </tbody>
//           </table>
//         </div>
//       </OwnerLayout>
//     );

//   // } catch (error) {
//   //   console.error("Component error:", error);
//   //   return (
//   //     <OwnerLayout>
//   //       <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
//   //         <h2 className="text-lg font-semibold text-red-800">Error Loading Properties</h2>
//   //         <p className="text-red-600">
//   //           There was an error loading your properties. Please try refreshing the page.
//   //         </p>
//   //         <details className="mt-2 text-sm text-red-500">
//   //           <summary>Error Details</summary>
//   //           <pre>{error instanceof Error ? error.message : String(error)}</pre>
//   //         </details>
//   //       </div>
//   //     </OwnerLayout>
//   //   );
//   // }
// };

// export default OwnerProperties;




import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import OwnerLayout from "../../layouts/owner/OwnerLayout";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

// Define the Property interface to match your backend model
interface Property {
  id: string;
  title: string;
  type: string;
  description: string;
  houseNumber: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: number;
  pricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  maxGuests: number;
  minLeasePeriod: number;
  maxLeasePeriod: number;
  features: string[];
  images: string[];
  status: "pending" | "active" | "blocked" | "booked" | "rejected";
  createdAt: Date;
}

const OwnerProperties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  try {
    // const { userData, getOwnerProperties, properties, isLoading, error } =
    //   useAuthStore((state) => ({
    //     userData: state.userData,
    //     getOwnerProperties: state.getOwnerProperties,
    //     properties: state.properties,
    //     isLoading: state.isLoading,
    //     error: state.error,
    //   }));
    const userData = useAuthStore((state) => state.userData);
const getOwnerProperties = useAuthStore((state) => state.getOwnerProperties);
const properties = useAuthStore((state) => state.properties);
const isLoading = useAuthStore((state) => state.isLoading);
const error = useAuthStore((state) => state.error);
const deleteProperty = useAuthStore((state) => state.deleteProperty);



    const isApproved = userData?.approvalStatus === "approved";
    const navigate = useNavigate();

    // useEffect(() => {
    //   try {
    //     if (isApproved && getOwnerProperties) {
    //       getOwnerProperties();
    //     }
    //   } catch (err) {
    //     console.error("Error fetching properties:", err);
    //     setLocalError("Failed to fetch properties");
    //   }
    // }, [isApproved, getOwnerProperties]);
    useEffect(() => {
  if (isApproved) {
    getOwnerProperties?.();
  }
}, [isApproved]);


    const handleAddProperty = () => {
      try {
        if (isApproved) {
          navigate("/owner/add-property");
        }
      } catch (err) {
        console.error("Navigation error:", err);
        setLocalError("Navigation failed");
      }
    };

    
const handleDelete = async (propertyId: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this property?"
  );
  if (!confirmDelete) return;

  try {
    await deleteProperty(propertyId);
    alert("Property deleted successfully!");
  } catch (err) {
    console.error("Error deleting property:", err);
    alert("Failed to delete property.");
  }
};

    // Safe array handling for properties
    const safeProperties = Array.isArray(properties) ? properties : [];

    // Apply search filter with safe property access
    const filteredProperties = safeProperties.filter((property) => {
      if (!property) return false;
      
      const title = property.title || "";
      const city = property.city || "";
      const status = property.status || "";
      const type = property.type || "";
      
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    // Helper function to get status display text and color
    const getStatusInfo = (status: string) => {
      switch (status) {
        case 'active':
          return { text: 'Active', color: 'bg-green-100 text-green-600' };
        case 'pending':
          return { text: 'Pending', color: 'bg-yellow-100 text-yellow-600' };
        case 'blocked':
          return { text: 'Blocked', color: 'bg-red-100 text-red-600' };
        case 'booked':
          return { text: 'Booked', color: 'bg-blue-100 text-blue-600' };
        case 'rejected':
          return { text: 'Rejected', color: 'bg-red-100 text-red-600' };
        default:
          return { text: status || 'Unknown', color: 'bg-gray-100 text-gray-600' };
      }
    };

    // Safe count function
    const getStatusCount = (statusType: string) => {
      return safeProperties.filter((p) => p && p.status === statusType).length;
    };

    return (
      <OwnerLayout>
        {/* Header + Add Button */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            My Properties
          </h1>

          <button
            onClick={handleAddProperty}
            disabled={!isApproved}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition ${
              isApproved
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 cursor-not-allowed text-gray-200"
            }`}
          >
            <FaPlus />
            Add New Property
          </button>
        </div>

        {!isApproved && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <p className="text-sm text-yellow-700">
              <strong>Account Pending Approval:</strong>
              {userData?.approvalStatus === "pending" &&
                " Your account is under review. You cannot add properties until approved."}
              {userData?.approvalStatus === "rejected" &&
                " Your account has been rejected. Please contact support."}
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="relative w-full max-w-sm">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, location, type, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Loading & Error States */}
        {isLoading && (
          <p className="text-center text-gray-500">Loading properties...</p>
        )}
        
        {(error || localError) && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <p className="text-red-700">{error || localError}</p>
          </div>
        )}

        {/* Summary Cards */}
        {safeProperties.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h2 className="text-sm text-slate-500">Total Properties</h2>
              <p className="text-xl font-bold">{safeProperties.length}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h2 className="text-sm text-slate-500">Active</h2>
              <p className="text-xl font-bold">{getStatusCount("active")}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h2 className="text-sm text-slate-500">Pending</h2>
              <p className="text-xl font-bold">{getStatusCount("pending")}</p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
              <h2 className="text-sm text-slate-500">Booked</h2>
              <p className="text-xl font-bold">{getStatusCount("booked")}</p>
            </div>
          </div>
        )}

        {/* Properties Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Price/Month</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => {
                  if (!property || !property.id) return null;
                  
                  const statusInfo = getStatusInfo(property.status);
                  const priceFormatted = property.pricePerMonth 
                    ? property.pricePerMonth.toLocaleString() 
                    : '0';
                  
                  return (
                    <tr
                      key={property.id}
                      className="border-t dark:border-slate-700"
                    >
                      <td className="px-4 py-2">
                        <img
                          src={
                            property.images && property.images.length > 0
                              ? property.images[0]
                              : "https://via.placeholder.com/150"
                          }
                          alt={property.title || "Property"}
                          className="w-16 h-16 rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://via.placeholder.com/150";
                          }}
                        />
                      </td>
                      <td className="px-4 py-2 font-medium">
                        {property.title || "No Title"}
                      </td>
                      <td className="px-4 py-2">{property.type || "N/A"}</td>
                      <td className="px-4 py-2">
                        {property.city || "N/A"}, {property.state || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${statusInfo.color}`}
                        >
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-4 py-2">₹{priceFormatted}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          disabled={!isApproved}
                          onClick={()=> navigate(`/owner/properties/${property.id}`)}
                          className={`p-2 rounded-lg ${
                            isApproved
                              ? "bg-blue-500 hover:bg-blue-600 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          title="View Property"
                        >
                          <FaEye size={14} />
                        </button>
                        <button
                          disabled={!isApproved || property.status === "booked"  as Property["status"]}
                          onClick={()=> navigate(`/owner/properties/${property.id}/edit`)}
                          className={`p-2 rounded-lg ${
                            isApproved && property.status !== "booked"  as Property["status"]
                              ? "bg-green-500 hover:bg-green-600 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          title="Edit Property"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          disabled={!isApproved || property.status === "booked"  as Property["status"]}
                          onClick={() => handleDelete(property.id)}
                          className={`p-2 rounded-lg ${
                            isApproved && property.status !== "booked"  as Property["status"]
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-gray-300 text-gray-500 cursor-not-allowed"
                          }`}
                          title="Delete Property"
                        >
                          <FaTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                !isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      {searchTerm 
                        ? "No properties found matching your search" 
                        : "No properties found"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </OwnerLayout>
    );

  } catch (error) {
    console.error("Component error:", error);
    return (
      <OwnerLayout>
        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <h2 className="text-lg font-semibold text-red-800">Error Loading Properties</h2>
          <p className="text-red-600">
            There was an error loading your properties. Please try refreshing the page.
          </p>
          <details className="mt-2 text-sm text-red-500">
            <summary>Error Details</summary>
            <pre>{error instanceof Error ? error.message : String(error)}</pre>
          </details>
        </div>
      </OwnerLayout>
    );
  }
};

export default OwnerProperties;