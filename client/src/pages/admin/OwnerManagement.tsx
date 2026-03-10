
import React, { useState, useEffect } from "react";
import { Eye, Ban, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { adminService } from "../../services/adminService";


import PageHeader from "../../components/Admin/common/PageHeader";
import SearchInput from "../../components/Admin/common/SearchInput";
import FilterSelect from "../../components/Admin/common/FilterSelect";
import AlertMessage from "../../components/Admin/common/AlertMessage";
import DataTable from "../../components/Admin/common/DataTable";
import Pagination from "../../components/Admin/common/Pagination";

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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
      setOwners(response.owners);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error) {
      console.error("Failed to fetch owners:", error);
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
  const handleApprove = async (ownerId: string) => {
    if (!window.confirm("Are you sure you want to approve this owner?")) return;
    try {
      setActionLoading(`approve-${ownerId}`);
      const res = await approveOwner(ownerId);
      setOwners((prev) =>
        prev.map((o) => (o.id === ownerId ? { ...o, approvalStatus: "approved" } : o))
      );
      setSuccess(res?.message || "Owner approved successfully");
      setError(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to approve owner");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (ownerId: string) => {
    if (!window.confirm("Are you sure you want to reject this owner?")) return;
    try {
      setActionLoading(`reject-${ownerId}`);
      await rejectOwner(ownerId);
      setOwners((prev) =>
        prev.map((o) => (o.id === ownerId ? { ...o, approvalStatus: "rejected" } : o))
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reject owner");
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlock = async (ownerId: string) => {
    if (!window.confirm("Are you sure you want to block this owner?")) return;
    try {
      setActionLoading(`block-${ownerId}`);
      await adminService.blockOwner(ownerId);
      setOwners((prev) =>
        prev.map((o) => (o.id === ownerId ? { ...o, status: "blocked" } : o))
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to block owner");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (ownerId: string) => {
    if (!window.confirm("Are you sure you want to unblock this owner?")) return;
    try {
      setActionLoading(`unblock-${ownerId}`);
      await adminService.unblockOwner(ownerId);
      setOwners((prev) =>
        prev.map((o) => (o.id === ownerId ? { ...o, status: "active" } : o))
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to unblock owner");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewOwner = (ownerId: string) => {
    navigate(`/admin/owners/${ownerId}`);
  };

  // ─ Initial loader
  if (loading && owners.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
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
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2 transition"
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
                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
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
    </div>
  );
};

export default OwnerManagement;

// import React, { useState, useEffect } from "react";
// import { Eye, Ban, CheckCircle, XCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// //import AdminLayout from "../../layouts/admin/AdminLayout";
// import { useAuthStore } from "../../stores/authStore";
// import { authService } from "../../services/authService";
// import { adminService } from "../../services/adminService";

// interface Owner {
//   id: string;
//   name: string;
//   email: string;  
//   phone: string;
//   profileImage?: string;
//   businessAddress: string;
//   businessName: string;
//   document?: string;
//   status: "active" | "blocked";
//   isVerified: boolean;
//   approvalStatus: "pending" | "approved" | "rejected";
//   createdAt: Date;
//   updatedAt: Date;
// }

// const OwnerManagement: React.FC = () => {
//   const [owners, setOwners] = useState<Owner[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<string | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");
//   const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [success, setSuccess] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
  


//   const { approveOwner, rejectOwner } = useAuthStore();
//   const getOwners = useAuthStore(state => state.getOwners);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchOwners();
//   // }, [currentPage, search, statusFilter]);
//   }, [currentPage, debouncedSearch, statusFilter]);

//   const fetchOwners = async () => {
//     try {
//       setLoading(true);
//       // const response = await authService.getOwners({
//       const response = await getOwners({
//         page: currentPage,
//         limit: 10,
//         // search,
//          search: debouncedSearch,
//         status: statusFilter,
//         sortBy: "createdAt",
//         sortOrder: "desc",
//       });
//       setOwners(response.owners);
//       setTotalPages(response.totalPages);
//       setTotalCount(response.totalCount);
//     } catch (error) {
//       console.error("Failed to fetch owners:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

// useEffect(() => {
//   const handler = setTimeout(() => {
//     setDebouncedSearch(search);
//   }, 500); 

//   return () => {
//     clearTimeout(handler);
//   };
// }, [search]);

// const handleClearSearch = () => {
//   setSearch("");
//   setDebouncedSearch("");
//   setCurrentPage(1); 
// };


//   const limit = 10; 

// const handlePreviousPage = () => {
//   if (currentPage > 1) {
//     setCurrentPage(currentPage - 1);
//   }
// };

// const handleNextPage = () => {
//   if (currentPage < totalPages) {
//     setCurrentPage(currentPage + 1);
//   }
// };

//   const handleApprove = async (ownerId: string) => { 
//     const confirmed = window.confirm("Are you sure you want to approve this owner?");
//       if (!confirmed) return;
//     try {
//       setActionLoading(`approve-${ownerId}`);
//       const res=await approveOwner(ownerId);

//       setOwners((prev) =>
//         prev.map((owner) =>
//          owner.id === ownerId
//           ? { ...owner, approvalStatus: "approved" }
//           : owner
//       )
//     );

//       setSuccess(res?.message || "Owner approved successfully");
//       setError(null);
//       // await fetchOwners();
  
//     } catch (err: any) {
//     setError(err?.response?.data?.message || "Failed to approve owner");
//   } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleReject = async (ownerId: string) => {  

//      const confirmed = window.confirm("Are you sure you want to reject this owner?");
//           if (!confirmed) return;

//     try {
//       setActionLoading(`reject-${ownerId}`);
//       await rejectOwner(ownerId);

//      setOwners((prev) =>
//        prev.map((owner) =>
//         owner.id === ownerId
//           ? { ...owner, approvalStatus: "rejected" }
//           : owner
//       )
//     );
//      } catch (err: any) {
//     setError(err?.response?.data?.message || "Failed to reject owner");

//       //await fetchOwners();
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleBlock = async (ownerId: string) => { 
//       const confirmed = window.confirm("Are you sure you want to block this owner?");
//            if (!confirmed) return;

//     try {
//       setActionLoading(`block-${ownerId}`);
//       await adminService.blockOwner(ownerId);
//       //await fetchOwners();

//     setOwners((prev) =>
//       prev.map((owner) =>
//         owner.id === ownerId
//           ? { ...owner, status: "blocked" }
//           : owner
//       )
//     );
//   } catch (err: any) {
//     setError(err?.response?.data?.message || "Failed to block owner");

//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleUnblock = async (ownerId: string) => { 

//      const confirmed = window.confirm("Are you sure you want to unblock this owner?");
//         if (!confirmed) return;

//     try {
//       setActionLoading(`unblock-${ownerId}`);
//       await adminService.unblockOwner(ownerId);

//     setOwners((prev) =>
//       prev.map((owner) =>
//         owner.id === ownerId
//           ? { ...owner, status: "active" }
//           : owner
//       )
//      );
//     } catch (err: any) {
//     setError(err?.response?.data?.message || "Failed to unblock owner");
//       //await fetchOwners();
//     } finally {
//       setActionLoading(null);
//     }
//   };

//   const handleViewOwner = (ownerId: string) => {
//     navigate(`/admin/owners/${ownerId}`);
//   };

//   const getStatusBadge = (status: string) =>
//     status === "active"
//       ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
//       : "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs";

//   const getApprovalBadge = (status: string) => {
//     switch (status) {
//       case "approved":
//         return "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs";
//       case "rejected":
//         return "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs";
//       default:
//         return "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs";
//     }
//   };

//   return (
//     // <AdminLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-semibold text-gray-800">Owner Management</h1>
//             <p className="text-sm text-gray-600 mt-1">Total Owners: {totalCount}</p>
//           </div>
//           <div className="flex gap-3">
//              <div className="relative w-full sm:w-64">
//             <input
//               type="text"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="px-3 py-2 border border-gray-300 rounded-md"
//             />
//     {search && (
//       <button
//         onClick={handleClearSearch}
//         className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//         aria-label="Clear search"
//       >
//         ❌
//       </button>
//     )}            
//             </div>
//             <select
//               value={statusFilter}
//               onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "blocked")}
//               className="px-3 py-2 border border-gray-300 rounded-md"
//             >
//               <option value="all">All</option>
//               <option value="active">Active</option>
//               <option value="blocked">Blocked</option>
//             </select>
//           </div>
//         </div>
// {/* Success Message */}
// {success && (
//   <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
//     <div className="flex justify-between items-center">
//       <span>{success}</span>
//       <button
//         onClick={() => setSuccess(null)}
//         className="text-green-500 hover:text-green-700"
//       >
//         ×
//       </button>
//     </div>
//   </div>
// )}

// {/* Error Message */}
// {error && (
//   <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
//     <div className="flex justify-between items-center">
//       <span>{error}</span>
//       <button
//         onClick={() => setError(null)}
//         className="text-red-500 hover:text-red-700"
//       >
//         ×
//       </button>
//     </div>
//   </div>
// )}

//         {/* Owners Table */}
//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Owner</th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Business</th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Document</th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Approval</th>
//                 <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {owners.map((owner) => (
//                 <tr key={owner.id}>
//                   <td className="px-6 py-4 flex items-center gap-3">
//                     {owner.profileImage ? (
//                       <img src={owner.profileImage} alt={owner.name} className="w-10 h-10 rounded-full object-cover" />
//                     ) : (
//                       <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
//                         <span className="text-gray-600 font-medium">{owner.name.charAt(0).toUpperCase()}</span>
//                       </div>
//                     )}
//                     <div>
//                       <p className="text-sm font-medium text-gray-900">{owner.name}</p>
//                       <p className="text-xs text-gray-500">{owner.email}</p>
//                       <p className="text-xs text-gray-500">{owner.phone}</p>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <p className="text-sm font-medium">{owner.businessName}</p>
//                     <p className="text-xs text-gray-500">{owner.businessAddress}</p>
//                   </td>

//                   {/* Document */}
//                   <td className="px-6 py-4">
//                     {owner.document ? (
//                       <button onClick={() => setSelectedDoc(owner.document!)} className="text-blue-600 hover:underline">
//                         View Document
//                       </button>
//                     ) : (
//                       <span className="text-gray-400 italic">No document</span>
//                     )}
//                   </td>

//                   <td className="px-6 py-4">
//                     <span className={getStatusBadge(owner.status)}>{owner.status}</span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={getApprovalBadge(owner.approvalStatus)}>{owner.approvalStatus}</span>
//                   </td>

//                   <td className="px-6 py-4 flex gap-2">
//                     {owner.approvalStatus === "pending" && (
//                       <>
//                         <button
//                           onClick={() => handleApprove(owner.id)}
//                           disabled={actionLoading === `approve-${owner.id}`}
//                           className="text-green-600 hover:text-green-800 " 
//                           title="approve"
//                         >
//                           <CheckCircle size={18} />
//                         </button>
//                         <button
//                           onClick={() => handleReject(owner.id)}
//                           disabled={actionLoading === `reject-${owner.id}`}
//                           className="text-red-600 hover:text-red-800"
//                            title="Reject"
//                         >
//                           <XCircle size={18} />
//                         </button>
//                       </>
//                     )}

//                     {owner.approvalStatus === "approved" && (
//                       <button
//                         onClick={() => handleReject(owner.id)}
//                         disabled={actionLoading === `reject-${owner.id}`}
//                         className="text-red-600 hover:text-red-800"
//                         title="Revoke Approval"
//                       >
//                         <XCircle size={18} />
//                       </button>
//                     )}

//                     {owner.approvalStatus === "rejected" && (
//                       <button
//                         onClick={() => handleApprove(owner.id)}
//                         disabled={actionLoading === `approve-${owner.id}`}
//                         className="text-green-600 hover:text-green-800"
//                         title="Approve Again"
//                       >
//                         <CheckCircle size={18} />
//                       </button>
//                     )}

//                     {owner.status === "active" ? (
//                       <button onClick={() => handleBlock(owner.id)} className="text-red-600 hover:text-red-800"  title="Block">
//                         <Ban size={18} />
//                       </button>
//                     ) : (
//                       <button onClick={() => handleUnblock(owner.id)} className="text-green-600 hover:text-green-800"  title="Unblock">
//                         <Ban size={18} />
//                       </button>
//                     )}

//                     <button
//                       onClick={() => handleViewOwner(owner.id)}
//                       className="text-blue-600 hover:text-blue-800"
//                       title="View Details"
//                     >
//                       <Eye size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {/* Pagination */}
// {totalPages > 1 && (
//   <div className="flex items-center justify-between bg-white px-6 py-3 rounded-lg shadow mt-4">
//     <div className="text-sm text-gray-700">
//       Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} owners
//     </div>
    
//     <div className="flex items-center gap-2">
//       <button
//         onClick={handlePreviousPage}
//         disabled={currentPage === 1}
//         className={`px-3 py-1 rounded border ${
//           currentPage === 1
//             ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//             : "bg-white text-gray-700 hover:bg-gray-50"
//         }`}
//       >
//         Previous
//       </button>
      
//       <span className="px-3 py-1 text-sm text-gray-700">
//         Page {currentPage} of {totalPages}
//       </span>
      
//       <button
//         onClick={handleNextPage}
//         disabled={currentPage === totalPages}
//         className={`px-3 py-1 rounded border ${
//           currentPage === totalPages
//             ? "bg-gray-100 text-gray-400 cursor-not-allowed"
//             : "bg-white text-gray-700 hover:bg-gray-50"
//         }`}
//       >
//         Next
//       </button>
//     </div>
//   </div>
// )}


//         {/* Document Modal */}
//         {selectedDoc && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full relative">
//               <button
//                 onClick={() => setSelectedDoc(null)}
//                 className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
//               >
//                 ✕
//               </button>
//               <div className="p-4">
//                 <iframe src={selectedDoc} title="Document Viewer" className="w-full h-[500px] rounded" />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     // </AdminLayout>
//   );
// };

// export default OwnerManagement;