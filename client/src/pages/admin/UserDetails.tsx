import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/admin/AdminLayout";
import { authService } from "../../services/authService";

interface Address {
  houseNo: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

interface UserDetails {
 
  id: string;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  status: "active" | "blocked";
  //isVerified: boolean;
  googleId?: string;
  address?: Address;
  createdAt: string;
  updatedAt: string;
}

const UserDetails = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  
  const fetchUserDetails = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
     
      const response = await authService.getUserDetails(userId); 
      setUser(response.user);
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.message || 
        'Failed to fetch user details'
      );
    } finally {
      setLoading(false);
    }
  };

  
  const toggleUserStatus = async () => {
    if (!user) return;

    const action = user.status === "active" ? "block" : "unblock";
    
    try {
      setActionLoading(true);
      
      if (action === "block") {
        await authService.blockUser(user.id);
      } else {
        await authService.unblockUser(user.id);
      }

     
      await fetchUserDetails();
    } catch (err: any) {
      console.error(`Error ${action}ing user:`, err);
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        `Failed to ${action} user`
      );
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hasCompleteAddress = (address?: Address) => {
    if (!address) return false;
    return address.houseNo || address.street || address.city || 
           address.district || address.state || address.pincode;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-gray-600">Loading user details...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <span>←</span>
            Back to Users
          </button>

          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error</h2>
            <p>{error || 'User not found'}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <span>←</span>
              Back to Users
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">User Details</h1>
              <p className="text-sm text-gray-600">Complete information about the user</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={toggleUserStatus}
            disabled={actionLoading}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              user.status === "active"
                ? "bg-red-100 text-red-700 hover:bg-red-200 disabled:bg-red-50"
                : "bg-green-100 text-green-700 hover:bg-green-200 disabled:bg-green-50"
            } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {actionLoading ? 'Processing...' : (user.status === "active" ? "Block User" : "Unblock User")}
          </button>
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

        {/* User Details Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8">
            <div className="flex items-center gap-6">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white">
                  <span className="text-2xl font-bold text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-100">{user.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {user.status === "active" ? "Active" : "Blocked"}
                  </span>
                  {/* <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    user.isVerified
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </span> */}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Basic Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Full Name</label>
                    <p className="text-gray-800 font-medium">{user.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email Address</label>
                    <p className="text-gray-800">{user.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone Number</label>
                    <p className="text-gray-800">{user.phone || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Account Type</label>
                    <p className="text-gray-800">
                      {user.googleId ? 'Google Account' : 'Email Account'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Status & Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                  Account Status
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <p className={`font-medium ${
                      user.status === "active" ? "text-green-600" : "text-red-600"
                    }`}>
                      {user.status === "active" ? "Active" : "Blocked"}
                    </p>
                  </div>
                  
                  {/* <div>
                    <label className="text-sm font-medium text-gray-600">Email Verification</label>
                    <p className={`font-medium ${
                      user.isVerified ? "text-blue-600" : "text-yellow-600"
                    }`}>
                      {user.isVerified ? "Verified" : "Pending Verification"}
                    </p>
                  </div> */}
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Member Since</label>
                    <p className="text-gray-800">{formatDate(user.createdAt)}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Updated</label>
                    <p className="text-gray-800">{formatDate(user.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            {hasCompleteAddress(user.address) && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                  Address Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.address?.houseNo && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">House/Building No</label>
                      <p className="text-gray-800">{user.address.houseNo}</p>
                    </div>
                  )}
                  
                  {user.address?.street && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Street</label>
                      <p className="text-gray-800">{user.address.street}</p>
                    </div>
                  )}
                  
                  {user.address?.city && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">City</label>
                      <p className="text-gray-800">{user.address.city}</p>
                    </div>
                  )}
                  
                  {user.address?.district && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">District</label>
                      <p className="text-gray-800">{user.address.district}</p>
                    </div>
                  )}
                  
                  {user.address?.state && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">State</label>
                      <p className="text-gray-800">{user.address.state}</p>
                    </div>
                  )}
                  
                  {user.address?.pincode && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Pincode</label>
                      <p className="text-gray-800">{user.address.pincode}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserDetails;