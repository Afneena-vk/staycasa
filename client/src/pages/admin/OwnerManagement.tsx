
import React, { useState, useEffect } from "react";
import { Eye, Ban, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { adminService } from "../../services/adminService";
import ConfirmModal from "../../components/common/ConfirmModal";

import PageHeader from "../../components/Admin/common/PageHeader";
import SearchInput from "../../components/Admin/common/SearchInput";
import FilterSelect from "../../components/Admin/common/FilterSelect";
import AlertMessage from "../../components/Admin/common/AlertMessage";
import DataTable from "../../components/Admin/common/DataTable";
import Pagination from "../../components/Admin/common/Pagination";
import axios from "axios";
import { toast } from "react-toastify";


const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  businessAddress: string;
  businessName: string;
  document?: string;
  status: "active" | "blocked";
  isVerified: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

// ─ Approval badge helper 
const ApprovalBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
        styles[status] ?? "bg-slate-50 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
};

// ─ Status badge helper 
const StatusBadge: React.FC<{ status: string }> = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${
      status === "active"
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-red-50 text-red-700 border-red-200"
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${
        status === "active" ? "bg-emerald-500" : "bg-red-500"
      }`}
    />
    {status}
  </span>
);

// ─ Document Modal 
const DocumentModal: React.FC<{ url: string | null; onClose: () => void }> = ({
  url,
  onClose,
}) => {
  if (!url) return null;
  return (
    <div
      className="fixed inset-0 bg-black/60  flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Document Viewer</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4">
          <iframe
            src={url}
            title="Document Viewer"
            className="w-full h-[500px] rounded-lg border border-slate-100"
          />
        </div>
      </div>
    </div>
  );
};

// ─ Main Component
const OwnerManagement: React.FC = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { approveOwner, rejectOwner } = useAuthStore();
  const getOwners = useAuthStore((state) => state.getOwners);
  const navigate = useNavigate();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    action: null as null | (() => Promise<void>),
});


const openConfirmModal = (
  title: string,
  message: string,
  action: () => Promise<void>
) => {
  setConfirmConfig({ title, message, action });
  setIsConfirmOpen(true);
};


  const limit = 10;

  // ─ Fetch
  const fetchOwners = async () => {
    try {
      setLoading(true);
      const response = await getOwners({
        page: currentPage,
        limit,
        search: debouncedSearch,
        status: statusFilter,
        sortBy: "createdAt",
        sortOrder: "desc",
      });
    //  setOwners(response.owners);
    setOwners(
  response.owners.map((o) => ({
    ...o,
    createdAt: new Date(o.createdAt),
    updatedAt: new Date(o.updatedAt),
  }))
);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    // } catch (error) {
    //   console.error("Failed to fetch owners:", error);
    } catch (err: unknown) {
  setError(getErrorMessage(err));

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [currentPage, debouncedSearch, statusFilter]);

  // ─ Debounce 
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  // ─ Actions


  const handleApprove = (ownerId: string) => {
  openConfirmModal(
    "Approve Owner",
    "Are you sure you want to approve this owner?",
    async () => {
      try {
        setActionLoading(`approve-${ownerId}`);
        const res = await approveOwner(ownerId);
        setOwners((prev) =>
          prev.map((o) => (o.id === ownerId ? { ...o, approvalStatus: "approved" } : o))
        );
        //setSuccess(res?.message || "Owner approved successfully");
        toast.success(res?.message || "Owner approved successfully");
        setError(null);
      } catch (err: unknown) {
        //setError(getErrorMessage(err));
         toast.error(getErrorMessage(err));
      } finally {
        setActionLoading(null);
        setIsConfirmOpen(false);
      }
    }
  );
};

  // const handleReject = async (ownerId: string) => {
  //   if (!window.confirm("Are you sure you want to reject this owner?")) return;
  //   try {
  //     setActionLoading(`reject-${ownerId}`);
  //     await rejectOwner(ownerId);
  //     setOwners((prev) =>
  //       prev.map((o) => (o.id === ownerId ? { ...o, approvalStatus: "rejected" } : o))
  //     );
    
  //   } catch (err: unknown) {
  // setError(getErrorMessage(err));

  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  const handleReject = (ownerId: string) => {
  openConfirmModal(
    "Reject Owner",
    "Are you sure you want to reject this owner?",
    async () => {
      try {
        setActionLoading(`reject-${ownerId}`);
        await rejectOwner(ownerId);
        setOwners((prev) =>
          prev.map((o) => (o.id === ownerId ? { ...o, approvalStatus: "rejected" } : o))
        );
        toast.success("Owner rejected successfully");
      } catch (err: unknown) {
       // setError(getErrorMessage(err));
       toast.error(getErrorMessage(err));
      } finally {
        setActionLoading(null);
        setIsConfirmOpen(false);
      }
    }
  );
};



  const handleBlock = (ownerId: string) => {
  openConfirmModal(
    "Block Owner",
    "Are you sure you want to block this owner?",
    async () => {
      try {
        setActionLoading(`block-${ownerId}`);
        await adminService.blockOwner(ownerId);
        setOwners((prev) =>
          prev.map((o) => (o.id === ownerId ? { ...o, status: "blocked" } : o))
        );
        toast.success("Owner blocked successfully"); 
      } catch (err: unknown) {
        // setError(getErrorMessage(err));
        toast.error(getErrorMessage(err));
      } finally {
        setActionLoading(null);
        setIsConfirmOpen(false);
      }
    }
  );
};



  const handleUnblock = (ownerId: string) => {
  openConfirmModal(
    "Unblock Owner",
    "Are you sure you want to unblock this owner?",
    async () => {
      try {
        setActionLoading(`unblock-${ownerId}`);
        await adminService.unblockOwner(ownerId);
        setOwners((prev) =>
          prev.map((o) => (o.id === ownerId ? { ...o, status: "active" } : o))
        );
        toast.success("Owner unblocked successfully");
      } catch (err: unknown) {
        // setError(getErrorMessage(err));
        toast.error(getErrorMessage(err)); 
      } finally {
        setActionLoading(null);
        setIsConfirmOpen(false);
      }
    }
  );
};

  const handleViewOwner = (ownerId: string) => {
    navigate(`/admin/owners/${ownerId}`);
  };

  // ─ Initial loader
  if (loading && owners.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading owners…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <PageHeader title="Owner Management" subtitle={`${totalCount} total owners`}>
        <SearchInput
          value={search}
          onChange={setSearch}
          onClear={handleClearSearch}
          placeholder="Search owners…"
        />
        <FilterSelect
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as "all" | "active" | "blocked")}
          options={statusOptions}
          ariaLabel="Filter by status"
        />
      </PageHeader>

      {/* ── Alerts ── */}
      {success && (
        <AlertMessage type="success" message={success} onClose={() => setSuccess(null)} />
      )}
      {error && (
        <AlertMessage type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* ── Table ── */}
      <DataTable
        loading={loading && owners.length > 0}
        isEmpty={owners.length === 0 && !loading}
        emptyMessage="No owners found."
        colSpan={6}
      >
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {["Owner", "Business", "Document", "Status", "Approval", "Actions"].map((h) => (
              <th
                key={h}
                className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {owners.map((owner) => (
            <tr key={owner.id} className="hover:bg-slate-50/70 transition duration-100">
              {/* Owner info */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {owner.profileImage ? (
                    <img
                      src={owner.profileImage}
                      alt={owner.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br  from-blue-400 to-blue-950  flex items-center justify-center text-white text-sm font-bold">
                      {owner.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{owner.name}</p>
                    <p className="text-xs text-slate-500 truncate">{owner.email}</p>
                    <p className="text-xs text-slate-400">{owner.phone}</p>
                  </div>
                </div>
              </td>

              {/* Business */}
              <td className="px-5 py-4">
                <p className="text-sm font-medium text-slate-800">{owner.businessName}</p>
                <p className="text-xs text-slate-500 mt-0.5">{owner.businessAddress}</p>
              </td>

              {/* Document */}
              <td className="px-5 py-4">
                {owner.document ? (
                  <button
                    onClick={() => setSelectedDoc(owner.document!)}
                    className="text-xs font-medium text-blue-900 hover:text-blue-600 underline underline-offset-2 transition"
                  >
                    View Document
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 italic">No document</span>
                )}
              </td>

              {/* Status */}
              <td className="px-5 py-4">
                <StatusBadge status={owner.status} />
              </td>

              {/* Approval */}
              <td className="px-5 py-4">
                <ApprovalBadge status={owner.approvalStatus} />
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  {owner.approvalStatus === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(owner.id)}
                        disabled={actionLoading === `approve-${owner.id}`}
                        title="Approve"
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                      >
                        <CheckCircle size={17} />
                      </button>
                      <button
                        onClick={() => handleReject(owner.id)}
                        disabled={actionLoading === `reject-${owner.id}`}
                        title="Reject"
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                      >
                        <XCircle size={17} />
                      </button>
                    </>
                  )}

                  {owner.approvalStatus === "approved" && (
                    <button
                      onClick={() => handleReject(owner.id)}
                      disabled={actionLoading === `reject-${owner.id}`}
                      title="Revoke Approval"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                    >
                      <XCircle size={17} />
                    </button>
                  )}

                  {owner.approvalStatus === "rejected" && (
                    <button
                      onClick={() => handleApprove(owner.id)}
                      disabled={actionLoading === `approve-${owner.id}`}
                      title="Approve Again"
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                    >
                      <CheckCircle size={17} />
                    </button>
                  )}

                  {owner.status === "active" ? (
                    <button
                      onClick={() => handleBlock(owner.id)}
                      title="Block"
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                    >
                      <Ban size={17} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnblock(owner.id)}
                      title="Unblock"
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition"
                    >
                      <Ban size={17} />
                    </button>
                  )}

                  <button
                    onClick={() => handleViewOwner(owner.id)}
                    title="View Details"
                    className="p-1.5 rounded-lg text-blue-900 hover:bg-blue-50 transition"
                  >
                    <Eye size={17} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>

      {/* ── Pagination ── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        limit={limit}
        itemLabel="owners"
        onPageChange={setCurrentPage}
      />

      {/* ── Document Modal ── */}
      <DocumentModal url={selectedDoc} onClose={() => setSelectedDoc(null)} />

        <ConfirmModal
  isOpen={isConfirmOpen}
  title={confirmConfig.title}
  message={confirmConfig.message}
  isLoading={!!actionLoading}
  onCancel={() => setIsConfirmOpen(false)}
  onConfirm={() => confirmConfig.action && confirmConfig.action()}
/>
    </div>
  );
};

export default OwnerManagement;
