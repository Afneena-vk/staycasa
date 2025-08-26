
import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
//import OwnerLayout from "../../layouts/Owner/OwnerLayout";
import OwnerLayout from "../../layouts/owner/OwnerLayout";
import { useAuthStore } from "../../stores/authStore";

interface Property {
  id: string;
  title: string;
  location: string;
  status: "Approved" | "Pending" | "Rejected";
  price: number;
  bookings: number;
  image: string;
}

const dummyProperties: Property[] = [
  {
    id: "1",
    title: "Cozy Beach House",
    location: "Goa, India",
    status: "Approved",
    price: 120,
    bookings: 12,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "2",
    title: "Mountain View Cottage",
    location: "Manali, India",
    status: "Pending",
    price: 80,
    bookings: 5,
    image: "https://via.placeholder.com/150",
  },
  {
    id: "3",
    title: "City Center Apartment",
    location: "Mumbai, India",
    status: "Rejected",
    price: 100,
    bookings: 2,
    image: "https://via.placeholder.com/150",
  },
];

const OwnerProperties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {userData} = useAuthStore();
  const isApproved = userData?.approvalStatus === 'approved';

  const filteredProperties = dummyProperties.filter((property) =>
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <OwnerLayout>
      {/* Header + Add Button */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          My Properties
        </h1>
        {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition">
          <FaPlus /> Add New Property
        </button> */}

        <button 
          disabled={!isApproved}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition ${
          isApproved 
          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
          : 'bg-gray-400 cursor-not-allowed text-gray-200'
  }`}
>
  <FaPlus /> 
  Add New Property
</button>


      </div>
      {!isApproved && (
  <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
    <div className="flex items-center">
      <div className="ml-3">
        <p className="text-sm text-yellow-700">
          <strong>Account Pending Approval:</strong> 
          {userData?.approvalStatus === 'pending' && " Your account is under review. You cannot add properties until approved."}
          {userData?.approvalStatus === 'rejected' && " Your account has been rejected. Please contact support."}
        </p>
      </div>
    </div>
  </div>
)}

      {/* Search Bar */}
      <div className="flex items-center gap-2 mb-6">
        <div className="relative w-full max-w-sm">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, location, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
          <h2 className="text-sm text-slate-500">Total Properties</h2>
          <p className="text-xl font-bold">{dummyProperties.length}</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
          <h2 className="text-sm text-slate-500">Approved</h2>
          <p className="text-xl font-bold">
            {dummyProperties.filter((p) => p.status === "Approved").length}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-md">
          <h2 className="text-sm text-slate-500">Pending</h2>
          <p className="text-xl font-bold">
            {dummyProperties.filter((p) => p.status === "Pending").length}
          </p>
        </div>
      </div>

      {/* Properties Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Location</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Price/Night</th>
              <th className="px-4 py-2 text-left">Bookings</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <tr
                  key={property.id}
                  className="border-t dark:border-slate-700"
                >
                  <td className="px-4 py-2">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{property.title}</td>
                  <td className="px-4 py-2">{property.location}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        property.status === "Approved"
                          ? "bg-green-100 text-green-600"
                          : property.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {property.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">${property.price}</td>
                  <td className="px-4 py-2">{property.bookings}</td>
                  <td className="px-4 py-2 flex gap-2">
                    {/* <button className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                      <FaEye size={14} />
                    </button>
                    <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">
                      <FaEdit size={14} />
                    </button>
                    <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg">
                      <FaTrash size={14} />
                    </button> */}
                    <button 
                    disabled={!isApproved}
                    className={`p-2 rounded-lg ${isApproved ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                   <FaEye size={14} />
                   </button>
                   <button 
                   disabled={!isApproved}
                   className={`p-2 rounded-lg ${isApproved ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                   >
                   <FaEdit size={14} />
                   </button>
                   <button 
                   disabled={!isApproved}
                   className={`p-2 rounded-lg ${isApproved ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                   >
                  <FaTrash size={14} />
                  </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </OwnerLayout>
  );
};

export default OwnerProperties;
