
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { Eye, CheckCircle, XCircle, Ban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ConfirmModal from "../../components/common/ConfirmModal";

import PageHeader from "../../components/Admin/common/PageHeader";
import SearchInput from "../../components/Admin/common/SearchInput";
import FilterSelect from "../../components/Admin/common/FilterSelect";
import Pagination from "../../components/Admin/common/Pagination";

const statusOptions = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
  // { value: "booked", label: "Booked" },
  { value: "rejected", label: "Rejected" },
];

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


const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
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

function AdminProperties() {
  const {
    getAllPropertiesAdmin,
    properties,
    isLoading,
    error,
    approveProperty,
    rejectProperty,
    blockPropertyByAdmin,
    unblockPropertyByAdmin,
    totalPages,
  } = useAuthStore();

  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOption, setSortOption] = useState("createdAt-desc");
  const [statusFilter, setStatusFilter] = useState<string>(""); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
     title: string;
     message: string;
     action: () => Promise<void>;
    } | null>(null);

const [isActionLoading, setIsActionLoading] = useState(false);

const openConfirmModal = (
  title: string,
  message: string,
  action: () => Promise<void>
) => {
  setModalConfig({ title, message, action });
  setIsModalOpen(true);
};

  const propertiesPerPage = 9;

  useEffect(() => {
    const [sortByField, sortOrderDir] = sortOption.split("-");
     const sortOrder =
    sortOrderDir === "asc" || sortOrderDir === "desc"
      ? sortOrderDir
      : undefined;
    getAllPropertiesAdmin({
      page: currentPage,
      limit: propertiesPerPage,
      search: debouncedSearch,
      sortBy: sortByField,
      // sortOrder: sortOrderDir,
      sortOrder,
      status: statusFilter,
    });
  }, [currentPage, debouncedSearch, sortOption,  statusFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/admin/properties/${propertyId}`);
  };


const handleApprove = (propertyId: string) => {
  openConfirmModal(
    "Approve Property",
    "Are you sure you want to approve this property?",
    async () => {
      await approveProperty(propertyId);
      toast.success("Property approved successfully!");
    }
  );
};



const handleReject = (propertyId: string) => {
  openConfirmModal(
    "Reject Property",
    "Are you sure you want to reject this property?",
    async () => {
      await rejectProperty(propertyId);
      toast.success("Property rejected successfully!");
    }
  );
};



const handleBlock = (propertyId: string) => {
  openConfirmModal(
    "Block Property",
    "Are you sure you want to block this property?",
    async () => {
      await blockPropertyByAdmin(propertyId);
      toast.success("Property blocked successfully!");
    }
  );
};



const handleUnblock = (propertyId: string) => {
  openConfirmModal(
    "Unblock Property",
    "Are you sure you want to unblock this property?",
    async () => {
      await unblockPropertyByAdmin(propertyId);
      toast.success("Property unblocked successfully!");
    }
  );
};

  if (isLoading && properties.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">
            Loading properties…
          </p>
        </div>
      </div>
    );
  }

  const safeProperties = Array.isArray(properties) ? properties : [];

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <PageHeader title="Property Management">
        <SearchInput
          value={searchQuery}
          onChange={(val) => {
            setSearchQuery(val);
            setCurrentPage(1);
          }}
          onClear={handleClearSearch}
          placeholder="Search properties…"
        />
        <FilterSelect
          value={sortOption}
          onChange={setSortOption}
          options={sortOptions}
          ariaLabel="Sort properties"
        />

          <FilterSelect
           value={statusFilter}
           onChange={(val) => {
           setStatusFilter(val);
           setCurrentPage(1);
          }}
           options={statusOptions}
           ariaLabel="Filter by status"
         />
      </PageHeader>

      {/* ─ Error ─ */}
      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* ─ Soft updating indicator ─ */}
      {isLoading && safeProperties.length > 0 && (
        <div className="flex justify-end">
          <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Updating…
          </span>
        </div>
      )}

      {/* ─ Property Cards Grid ─ */}
      {safeProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {safeProperties.map((p) => {
            const priceFormatted = p.pricePerMonth?.toLocaleString() || "0";

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition duration-200 group"
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  {p.images?.length > 0 ? (
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/300";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      No image
                    </div>
                  )}

                  {/* Status badge overlay */}
                  <div className="absolute top-3 left-3">
                    <PropertyStatusBadge status={p.status} />
                  </div>

                  {/* Created date overlay */}
                  <div className="absolute bottom-3 right-3">
                    <span className="text-xs bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {p.createdAt
                        ? new Date(p.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-bold text-base text-slate-800 leading-snug line-clamp-1">
                      {p.title || "No Title"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {p.district}, {p.state}
                    </p>
                  </div>

                 
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-blue-600">
                      ₹{priceFormatted}
                      <span className="text-xs font-medium text-slate-400">
                        /mo
                      </span>
                    </span>

                   
                    <div className="flex items-center gap-1.5">
                      {/* Approve — only when pending */}
                      {p.status === "pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(p.id)}
                            title="Approve"
                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition"
                          >
                            <CheckCircle size={14} />
                          </button>
                          <button
                            onClick={() => handleReject(p.id)}
                            title="Reject"
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition"
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}

                      {/* Block — only when active */}
                      {p.status === "active" && (
                        <button
                          onClick={() => handleBlock(p.id)}
                          title="Block"
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition"
                        >
                          <Ban size={14} />
                        </button>
                      )}

                      {/* Unblock — only when blocked */}
                      {p.status === "blocked" && (
                        <button
                          onClick={() => handleUnblock(p.id)}
                          title="Unblock"
                          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition"
                        >
                          <Ban size={14} />
                        </button>
                      )}

                      {/* View — always shown */}
                      <button
                        onClick={() => handleViewProperty(p.id)}
                        title="View Details"
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition"
                      >
                        <Eye size={14} />
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
              No properties found.
            </p>
          </div>
        )
      )}

      {/* ─ Pagination ─ */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        // totalCount={safeProperties.length}
        totalCount={safeProperties.length}
        limit={propertiesPerPage}
        itemLabel="properties"
        onPageChange={(page) => setCurrentPage(page)}
      />

<ConfirmModal
  isOpen={isModalOpen}
  title={modalConfig?.title}
  message={modalConfig?.message || ""}
  isLoading={isActionLoading}
  onCancel={() => {
    setIsModalOpen(false);
    setModalConfig(null);
  }}
  onConfirm={async () => {
    if (!modalConfig) return;

    try {
      setIsActionLoading(true);
      await modalConfig.action();
    // } catch (error: any) {
    //   toast.error(error.message || "Something went wrong");
        } catch (error: unknown) {
  toast.error(getErrorMessage(error));

    } finally {
      setIsActionLoading(false);
      setIsModalOpen(false);
      setModalConfig(null);
    }
  }}
/>

    </div>
  );
}

export default AdminProperties;

