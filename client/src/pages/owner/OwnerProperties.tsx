

import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import PageHeader from "../../components/Admin/common/PageHeader";
import SearchInput from "../../components/Admin/common/SearchInput";
import FilterSelect from "../../components/Admin/common/FilterSelect";
import Pagination from "../../components/Admin/common/Pagination";
import ConfirmModal from "../../components/common/ConfirmModal";

interface Property {
  id: string;
  title: string;
  type: string;
  description: string;
  city: string;
  state: string;
  pricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  status: "pending" | "active" | "blocked" | "booked" | "rejected";
  createdAt: Date;
}

const sortOptions = [
  { value: "createdAt-desc", label: "Newest" },
  { value: "createdAt-asc", label: "Oldest" },
  { value: "pricePerMonth-asc", label: "Price: Low → High" },
  { value: "pricePerMonth-desc", label: "Price: High → Low" },
];

const statusStyleMap: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  blocked: "bg-red-50 text-red-700 border-red-200",
  booked: "bg-blue-50 text-blue-700 border-blue-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const PropertyStatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
      statusStyleMap[status] ?? "bg-slate-50 text-slate-600 border-slate-200"
    }`}
  >
    {status || "Unknown"}
  </span>
);

const OwnerProperties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("createdAt-desc");
  const [localError, setLocalError] = useState<string | null>(null);

  const userData = useAuthStore((state) => state.userData);
  const getOwnerProperties = useAuthStore((state) => state.getOwnerProperties);
  const properties = useAuthStore((state) => state.properties);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const deleteProperty = useAuthStore((state) => state.deleteProperty);
  const totalPages = useAuthStore((state) => state.totalPages);
  const currentSubscription = useAuthStore((state) => state.currentSubscription);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    action: null | (() => Promise<void>);
 }>({ title: "", message: "", action: null });

  const subscriptionLoading = useAuthStore(
  (state) => state.subscriptionLoading
);

  const navigate = useNavigate();
  const location = useLocation();

  const isApproved = userData?.approvalStatus === "approved";
  const hasActiveSubscription =
    currentSubscription?.hasActiveSubscription === true;
    const maxProperties = currentSubscription?.subscription?.maxProperties || 0;
const usedProperties = currentSubscription?.subscription?.usedProperties || 0;

const propertyLimitReached = usedProperties >= maxProperties;

  const propertiesPerPage = 9;

 
  useEffect(() => {
    if (isApproved) {
      const [sortByField, sortOrderDir] = sortOption.split("-");
      const sortOrder = sortOrderDir === "asc" || sortOrderDir === "desc" ? sortOrderDir : undefined;
      getOwnerProperties({
        page: currentPage,
        limit: propertiesPerPage,
        search: debouncedSearch,
        sortBy: sortByField,
        // sortOrder: sortOrderDir,
        sortOrder,
      });
    }
  }, [isApproved, currentPage, debouncedSearch, sortOption]);

  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchTerm]);


  useEffect(() => {
    if (location.state?.success) {
      toast.success(location.state.success, {
        toastId: "property-update-success",
      });
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, navigate]);


  const handleAddProperty = () => {
    try {
      if (isApproved) navigate("/owner/add-property");
    } catch (err) {
      console.error("Navigation error:", err);
      setLocalError("Navigation failed");
    }
  };

 const openConfirmModal = (
  title: string,
  message: string,
  action: () => Promise<void>
) => {
  setConfirmConfig({ title, message, action });
  setIsConfirmOpen(true);
};


  const handleDelete = (propertyId: string) => {
  openConfirmModal(
    "Delete Property",
    "Are you sure you want to delete this property?",
    async () => {
      try {
        await deleteProperty(propertyId);
        toast.success("Property deleted successfully!");
      } catch (err) {
        console.error("Error deleting property:", err);
        toast.error("Failed to delete property.");
      } finally {
        setIsConfirmOpen(false);
      }
    }
  );
};

  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const safeProperties = Array.isArray(properties) ? properties : [];

  return (
    <div className="space-y-5">

      {/* ─ Header ─ */}
      <PageHeader title="My Properties">
        {/* ─ Approval / Subscription Messages ─ */}
{!isApproved && (
  <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-lg">
    <strong>Account Pending Approval:</strong>
    {userData?.approvalStatus === "pending" &&
      " Your account is under review. You cannot add properties until approved."}
    {userData?.approvalStatus === "rejected" &&
      " Your account has been rejected. Please contact support."}
  </div>
)}

{isApproved && !hasActiveSubscription && !subscriptionLoading && (
  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
    You don’t have an active subscription. Please subscribe to a plan to add properties.
  </div>
)}
{isApproved && hasActiveSubscription && propertyLimitReached && (
  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
    Property limit reached for your current plan.  
    Your plan allows <strong>{maxProperties}</strong> properties and you have already used all available slots.
  </div>
)}
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={handleClearSearch}
          placeholder="Search by title, location, type…"
          icon={<FaSearch size={13} />}
          className="w-full sm:w-72"
        />
        <FilterSelect
          value={sortOption}
          onChange={setSortOption}
          options={sortOptions}
          ariaLabel="Sort properties"
        />
        {/* Add property button */}
        <button
          onClick={handleAddProperty}
          disabled={!isApproved || !hasActiveSubscription || propertyLimitReached}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition ${
            isApproved && hasActiveSubscription
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-slate-200 cursor-not-allowed text-slate-400"
          }`}
        >
          <FaPlus size={12} />
          Add Property
        </button>
      </PageHeader>

      {/* ─ Error ─ */}
      {(error || localError) && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error || localError}
        </div>
      )}

      {/* ─ Initial loader ─ */}
      {isLoading && safeProperties.length === 0 && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-500 font-medium">
              Loading properties…
            </p>
          </div>
        </div>
      )}

      {/* ─ Property Cards Grid ─ */}
      {!isLoading || safeProperties.length > 0 ? (
        <>
          {safeProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {safeProperties.map((property) => {
                const priceFormatted =
                  property.pricePerMonth?.toLocaleString() || "0";
                const isBooked = property.status === "booked";

                return (
                  <div
                    key={property.id}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition duration-200 group"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={
                          property.images?.[0] ||
                          "https://via.placeholder.com/300"
                        }
                        alt={property.title || "Property"}
                        className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/300";
                        }}
                      />
                      {/* Status badge overlay */}
                      <div className="absolute top-3 left-3">
                        <PropertyStatusBadge status={property.status} />
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="font-bold text-base text-slate-800 leading-snug line-clamp-1">
                          {property.title || "No Title"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          {property.type || "N/A"} •{" "}
                          {property.city}, {property.state}
                        </p>
                      </div>

                      {/* Price + actions */}
                      <div className="mt-4 flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-indigo-600">
                          ₹{priceFormatted}
                          <span className="text-xs font-medium text-slate-400">
                            /mo
                          </span>
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* View */}
                          <button
                            onClick={() =>
                              navigate(`/owner/properties/${property.id}`)
                            }
                            title="View"
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                          >
                            <FaEye size={13} />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() =>
                              navigate(
                                `/owner/properties/${property.id}/edit`
                              )
                            }
                            disabled={isBooked}
                            title="Edit"
                            className={`p-2 rounded-lg transition ${
                              !isBooked
                                ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <FaEdit size={13} />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(property.id)}
                            disabled={isBooked}
                            title="Delete"
                            className={`p-2 rounded-lg transition ${
                              !isBooked
                                ? "bg-red-50 hover:bg-red-100 text-red-600"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            !isLoading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg
                  className="w-14 h-14 text-slate-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 9.75L12 3l9 6.75V21a.75.75 0 01-.75.75H3.75A.75.75 0 013 21V9.75z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 21V12h6v9"
                  />
                </svg>
                <p className="text-slate-500 font-medium text-sm">
                  {searchTerm
                    ? "No properties found matching your search"
                    : "No properties found"}
                </p>
              </div>
            )
          )}

          {/* ─ Pagination ─ */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={safeProperties.length}
            limit={propertiesPerPage}
            itemLabel="properties"
            onPageChange={setCurrentPage}
          />
          <ConfirmModal
  isOpen={isConfirmOpen}
  title={confirmConfig.title}
  message={confirmConfig.message}
  isLoading={isLoading}
  onCancel={() => setIsConfirmOpen(false)}
  onConfirm={() => confirmConfig.action && confirmConfig.action()}
/>
        </>
      ) : null}
    </div>
  );
};

export default OwnerProperties;
