
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import { api } from "../../api/api";
import { useAuthStore } from "../../stores/authStore";
import { UsersListResponseDto } from "../../types/admin";

import PageHeader from "../../components/Admin/common/PageHeader";
import SearchInput from "../../components/Admin/common/SearchInput";
import FilterSelect from "../../components/Admin/common/FilterSelect";
import AlertMessage from "../../components/Admin/common/AlertMessage";
import DataTable from "../../components/Admin/common/DataTable";
import Pagination from "../../components/Admin/common/Pagination";  
import axios from "axios";
import ConfirmModal from "../../components/common/ConfirmModal";
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

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "Active" | "Blocked";
  profileImage?: {
    url: string;
    publicId: string;
  };
  updatedAt: string;
}

interface UsersResponse {
  users: User[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  message: string;
  status: number;
}

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "blocked", label: "Blocked" },
];

const sortOptions = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  // { value: "name-asc", label: "Name A–Z" },
  // { value: "name-desc", label: "Name Z–A" },
  // { value: "email-asc", label: "Email A–Z" },
  // { value: "email-desc", label: "Email Z–A" },
];

const UserManagement = () => {
  const navigate = useNavigate();
  const getUsers = useAuthStore((state) => state.getUsers);
  const blockUser = useAuthStore((state) => state.blockUser);
const unblockUser = useAuthStore((state) => state.unblockUser);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "blocked">("all");
  const [sortValue, setSortValue] = useState("createdAt-desc");


  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    action: null | (() => Promise<void>);
  }>({ title: "", message: "", action: null });

  const limit = 10;

  const sortBy = sortValue.split("-")[0] as "name" | "email" | "createdAt";
  const sortOrder = sortValue.split("-")[1] as "asc" | "desc";

  // ─ Fetch 
  const fetchUsers = async () => {
    try {
      setLoading(true);
      //const data: UsersResponse = await getUsers({
     // const data = await getUsers({
     const data: UsersListResponseDto = await getUsers({
        page: currentPage,
        limit,
        status: statusFilter,
        sortBy,
        sortOrder,
        search: debouncedSearch,
      });

      setUsers(
        data.users.map((user) => ({
          ...user,
          status: (user.status.charAt(0).toUpperCase() +
            user.status.slice(1).toLowerCase()) as "Active" | "Blocked",
        }))
      );
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    
    } catch (err: unknown) {
  setError(getErrorMessage(err));

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearch, statusFilter, sortValue]);

  // ─ Debounce search 
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const handleClearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setCurrentPage(1);
  };

  const openConfirmModal = (title: string, message: string, action: () => Promise<void>) => {
    setConfirmConfig({ title, message, action });
    setIsConfirmOpen(true);
  };

  // ─ Actions

 const toggleUserStatus = (userId: string, currentStatus: string) => {
    const actionType = currentStatus === "Active" ? "block" : "unblock";

    openConfirmModal(
      `${actionType === "block" ? "Block" : "Unblock"} User`,
      `Are you sure you want to ${actionType} this user?`,
      async () => {
        try {
          setLoading(true);
          let res;
          if (actionType === "block") res = await blockUser(userId);
          else res = await unblockUser(userId);

          setUsers((prev) =>
            prev.map((user) =>
              user.id === userId ? { ...user, status: currentStatus === "Active" ? "Blocked" : "Active" } : user
            )
          );
          // setSuccess(res.message);
             toast.success(res.message);
        } catch (err: unknown) {
          // setError(getErrorMessage(err));
          toast.error(getErrorMessage(err));
        } finally {
          setIsConfirmOpen(false);
          setLoading(false);
        }
      }
    );
  };

  const handleViewUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  // ─ Initial full-page loader
  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading users…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      <PageHeader
        title="User Management"
        subtitle={`${totalCount} total users`}
      >
        <SearchInput
          value={search}
          onChange={setSearch}
          onClear={handleClearSearch}
          placeholder="Search by name or email"
        />
        <FilterSelect
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as "all" | "active" | "blocked")}
          options={statusOptions}
          ariaLabel="Filter by status"
        />
        <FilterSelect
          value={sortValue}
          onChange={setSortValue}
          options={sortOptions}
          ariaLabel="Sort users"
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
        loading={loading && users.length > 0}
        isEmpty={users.length === 0 && !loading}
        emptyMessage="No users found."
        colSpan={5}
      >
        <thead className="bg-slate-50 border-b border-slate-100">
          <tr>
            {["Username", "Email", "Phone", "Status", "Actions"].map((h) => (
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
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50/70 transition duration-100">
              {/* Name + avatar */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {user.profileImage?.url ? (
                    <img
                      src={user.profileImage.url}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-800">{user.name}</span>
                </div>
              </td>

              <td className="px-5 py-4 text-sm text-slate-600">{user.email}</td>
              <td className="px-5 py-4 text-sm text-slate-500">{user.phone || "—"}</td>

              {/* Status badge */}
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    user.status === "Active"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      user.status === "Active" ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />
                  {user.status}
                </span>
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleUserStatus(user.id, user.status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      user.status === "Active"
                        ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                    }`}
                  >
                    {user.status === "Active" ? "Block" : "Unblock"}
                  </button>
                  <button
                    onClick={() => handleViewUser(user.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 transition"
                  >
                    View Details
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
        itemLabel="users"
        onPageChange={setCurrentPage}
      />
          <ConfirmModal
        isOpen={isConfirmOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isLoading={loading}
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => confirmConfig.action && confirmConfig.action()}
      />
    </div>
  );
};

export default UserManagement;

