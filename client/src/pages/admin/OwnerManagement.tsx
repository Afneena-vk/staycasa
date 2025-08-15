


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/admin/AdminLayout";
import { api } from "../../api/api";
import { authService } from "../../services/authService";

interface Owner {
  id: string; 
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  status: "Active" | "Blocked";
  isVerified: boolean;
  profileImage?: string;
  documents: string[];
  updatedAt: string;
}

interface OwnersResponse {
  owners: Owner[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  message: string;
  status: number;
}

const OwnerManagement = () => {
  const navigate = useNavigate();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");
  //const [verificationFilter, setVerificationFilter] = useState<"all" | "verified" | "unverified">("all");
  const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const limit = 10; 

 
  const fetchOwners = async () => {
    try {
      setLoading(true);
      setError(null);

      
      const data: OwnersResponse = await authService.getOwners({
        page: currentPage,
        limit,
        status: statusFilter,
        sortBy,
        sortOrder,
        search,
      });
      
      setOwners(
        data.owners.map((owner) => ({
          ...owner,
          status: owner.status.charAt(0).toUpperCase() + owner.status.slice(1).toLowerCase() as "Active" | "Blocked",
        }))
      );

      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      
    } catch (err: any) {
      console.error('Error fetching owners:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to fetch owners'
      );
    } finally {
      setLoading(false);
    }
  };

  
  const toggleOwnerStatus = async (ownerId: string, currentStatus: string) => {
    const action = currentStatus === "Active" ? "block" : "unblock";
    try {
      await api.patch(`/admin/owners/${ownerId}/${action}`);
      
     
      fetchOwners();
    } catch (err: any) {
      console.error(`Error ${action}ing owner:`, err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        `Failed to ${action} owner`
      );
    }
  };

  
  const toggleOwnerVerification = async (ownerId: string, currentVerificationStatus: boolean) => {
    const action = currentVerificationStatus ? "unverify" : "verify";
    try {
      await api.patch(`/admin/owners/${ownerId}/${action}`);
      
      
      fetchOwners();
    } catch (err: any) {
      console.error(`Error ${action}ing owner:`, err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        `Failed to ${action} owner`
      );
    }
  };

  
  const handleViewOwner = (ownerId: string) => {
    navigate(`/admin/owners/${ownerId}`);
  };

  
  useEffect(() => {
    fetchOwners();
  }, [currentPage, statusFilter, sortBy, sortOrder]);

  
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1); 
      fetchOwners();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && owners.length === 0) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-gray-600">Loading owners...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Owner Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Total Owners: {totalCount}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            />
            
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "blocked")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>

            {/* Sort Options */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field as "name" | "email" | "createdAt");
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Owners Table */}
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-6 py-4">Owner Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id} className="border-t hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {owner.profileImage ? (
                        <img
                          src={owner.profileImage}
                          alt={owner.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-xs font-medium">
                            {owner.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span>{owner.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{owner.email}</td>
                  <td className="px-6 py-4">{owner.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      owner.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                      {owner.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleOwnerStatus(owner.id, owner.status)}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          owner.status === "Active"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {owner.status === "Active" ? "Block" : "Unblock"}
                      </button>
                      <button 
                        onClick={() => handleViewOwner(owner.id)} 
                        className="px-3 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {owners.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="text-center px-6 py-8 text-gray-500">
                    No owners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-6 py-3 rounded-lg shadow">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} owners
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Loading overlay for subsequent requests */}
        {loading && owners.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white px-6 py-4 rounded-lg shadow-lg">
              <div className="text-lg text-gray-600">Loading...</div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OwnerManagement;