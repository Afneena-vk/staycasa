
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import AdminLayout from "../../layouts/admin/AdminLayout";
import { Eye, CheckCircle, XCircle, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';


function AdminProperties() {
  const { getAllPropertiesAdmin, properties, isLoading, error, approveProperty, rejectProperty, blockPropertyByAdmin, unblockPropertyByAdmin} = useAuthStore();
  const navigate = useNavigate();

   const [searchQuery, setSearchQuery] = useState("");
   const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
   const [currentPage, setCurrentPage] = useState(1);
   const propertiesPerPage = 10;

  
  useEffect(() => {
  getAllPropertiesAdmin({
     page: currentPage,
    limit: 10,
    search: debouncedSearch,
    sortBy: "createdAt",
    sortOrder: "desc",
  }
  
  );
}, [currentPage,  debouncedSearch]);

useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearch(searchQuery); 
  }, 1000); 

  return () => clearTimeout(handler); 
}, [searchQuery]);

const handleClearSearch = () => {
  setSearchQuery("");
   setDebouncedSearch("");
    setCurrentPage(1);
}


const currentProperties = properties;
const totalPages = useAuthStore((state) => state.totalPages);



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewProperty = (propertyId: string) => {
  navigate(`/admin/properties/${propertyId}`);
};



const handleApprove = async (propertyId: string) => {
  const confirmation = window.confirm("Do you want to approve the property");
  if(!confirmation) return;
  try {
    await approveProperty(propertyId);
    //alert("Property approved successfully");
    toast.success("Property approved successfully!");
  } catch (error: any) {
    console.error("Approval failed", error);
    toast.error(error.message || "Failed to approve property");
  }
};

const handleReject = async (propertyId: string) => {
  const confirmation = window.confirm("Do you want to reject the property");
  if(!confirmation) return;
  try {
    await rejectProperty(propertyId);
    
    toast.success("Property rejected successfully!");
  } catch (error: any) {
    console.error("Rejection failed", error);
    toast.error(error.message || "Failed to reject property");
  }
};

const handleBlock = async (propertyId: string) => {
   const confirmation = window.confirm("Do you want to block the property");
  if(!confirmation) return;
  try {
   
    await blockPropertyByAdmin(propertyId);
    
    toast.success("Property blocked successfully!");
  } catch (error: any) {
    console.error("Blocking failed", error);
    toast.error(error.message || "Failed to block property");
  }
};

const handleUnblock = async (propertyId: string) => {
   const confirmation = window.confirm("Do you want to unblock property");
  if(!confirmation) return;
  try {
   
    await unblockPropertyByAdmin(propertyId);
    
    toast.success("Property unblocked successfully!");
  } catch (error: any) {
    console.error("unblocking failed", error);
    toast.error(error.message || "Failed to unblock property");
  }
};

  if (isLoading)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-gray-600">Loading properties...</div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <div className="p-6 text-center text-red-500">{error}</div>
      </AdminLayout>
    );

 

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Property Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Total Properties: {properties.length}
            </p>
          </div>
          {/* <div> */}
          <div className="relative w-full md:w-64">
    <input
      type="text"
      placeholder="Search properties..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); 
      }}
      // className="border px-3 py-1 rounded w-full md:w-64"
      className="w-full border px-3 py-1 rounded pr-8" 
    />
     {searchQuery && (
    <button
      onClick={handleClearSearch}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
      aria-label="Clear search"
    >
      ❌
    </button>
  )}
    
  </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {properties.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No properties found.</p>
          ) : (
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                     Image
                    </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price / Month
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProperties.map((p) => (
               
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                 {p.images && p.images.length > 0 ? (
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-16 h-16 object-cover rounded"
                  />
                 ) : (
                  <div className="w-16 h-16 bg-gray-200 flex items-center justify-center text-gray-400 rounded">
                No Image
                </div>
                )}
            </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {p.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {p.city}, {p.state}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      ₹{p.pricePerMonth}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {/* <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          p.status === "active"
                            ? "bg-green-100 text-green-800"
                            : p.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.status}
                      </span> */}
                      <span
  className={`px-2 py-1 rounded-full text-xs ${
    p.status === "active"
      ? "bg-green-100 text-green-800"
      : p.status === "pending"
      ? "bg-yellow-100 text-yellow-800"
      : p.status === "blocked"
      ? "bg-red-100 text-red-800"
      : p.status === "booked"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800" 
  }`}
>
  {p.status}
</span>

                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
  <div className="flex items-center gap-3">
                        {p.status === 'pending' &&(
                            <>
                            <button
                             type="button"
                            onClick={()=> handleApprove(p.id)}
                              className="text-green-600 hover:text-green-800"
        title="Approve Property"
                            >
                            <CheckCircle size={18} />
                            </button>
                            <button 
                             onClick={() => handleReject(p.id)}
        className="text-red-600 hover:text-red-800"
        title="Reject Property"
        >
 <XCircle size={18} />
                            </button>
                            </>
                            
                        )}

                         {p.status === "active" && (
    <button
      onClick={() => handleBlock(p.id)}
      className="text-red-600 hover:text-red-800"
      title="Block Property"
    >
      <Ban size={18} />
    </button>
  )}
 {p.status === "blocked" && (
    <button
      onClick={() => handleUnblock(p.id)}
      className="text-green-600 hover:text-green-800"
      title="Unblock Property"
    >
      <Ban size={18} />
    </button>
  )}
                      <button
                        onClick={() => handleViewProperty(p.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="View Property"
                      >
                        <Eye size={16} />
                       
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>


         

          )}
        </div>

                    

            
      </div>
      <div className="flex justify-center items-center gap-2 p-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
    </AdminLayout>
  );
}

export default AdminProperties;
