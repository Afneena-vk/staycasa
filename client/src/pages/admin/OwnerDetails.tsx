

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/admin/AdminLayout";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";

interface Owner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  businessName: string;
  businessAddress: string;
  documents: string[];
  isBlocked: boolean;
  //isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const OwnerDetails: React.FC = () => {
  const { ownerId } = useParams<{ ownerId: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<Owner | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOwnerDetails = async () => {
    try {
      setLoading(true);
      const data = await authService.getOwnerDetails(ownerId!);
      setOwner(data.owner);
    } catch {
      toast.error("Failed to load owner details");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async () => {
    if (!owner) return;
    try {
      setActionLoading(true);
      if (owner.isBlocked) {
        await authService.unblockOwner(owner._id);
        toast.success("Owner unblocked");
      } else {
        await authService.blockOwner(owner._id);
        toast.success("Owner blocked");
      }
      fetchOwnerDetails();
    } catch {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerDetails();
  }, [ownerId]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px] text-lg text-gray-600">
          Loading owner details...
        </div>
      </AdminLayout>
    );
  }

  if (!owner) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <button onClick={() => navigate("/admin/owners")} className="text-blue-600 hover:text-blue-800">
            ← Back to Owners
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            Owner not found
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
              onClick={() => navigate("/admin/owners")}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              ← Back to Owners
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Owner Details</h1>
              <p className="text-sm text-gray-600">Complete information about the owner</p>
            </div>
          </div>
          <button
            onClick={handleBlockToggle}
            disabled={actionLoading}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              owner.isBlocked
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            } ${actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {actionLoading ? "Processing..." : owner.isBlocked ? "Unblock Owner" : "Block Owner"}
          </button>
        </div>

        {/* Details Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-8">
            <div className="flex items-center gap-6">
              {owner.profileImage ? (
                <img
                  src={owner.profileImage}
                  alt={owner.name}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center border-4 border-white">
                  <span className="text-2xl font-bold text-gray-600">
                    {owner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-white">
                <h2 className="text-2xl font-bold">{owner.name}</h2>
                <p className="text-purple-100">{owner.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      owner.isBlocked
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {owner.isBlocked ? "Blocked" : "Active"}
                  </span>
                  {/* <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      owner.isVerified
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {owner.isVerified ? "Verified" : "Unverified"}
                  </span> */}
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                Business Information
              </h3>
              <p><strong>Business Name:</strong> {owner.businessName}</p>
              <p><strong>Business Address:</strong> {owner.businessAddress}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
                Contact Information
              </h3>
              <p><strong>Phone:</strong> {owner.phone}</p>
              <p><strong>Email:</strong> {owner.email}</p>
              <p><strong>Joined:</strong> {formatDate(owner.createdAt)}</p>
              <p><strong>Last Updated:</strong> {formatDate(owner.updatedAt)}</p>
            </div>
          </div>

          {/* Documents */}
          <div className="p-6 border-t">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Documents</h4>
            {owner.documents.length > 0 ? (
              <ul className="list-disc pl-6 space-y-2">
                {owner.documents.map((doc, index) => (
                  <li key={index}>
                    <a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Document {index + 1}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OwnerDetails;
