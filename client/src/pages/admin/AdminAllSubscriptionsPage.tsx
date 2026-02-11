import { useEffect, useState } from "react";
import ModernAdminLayout from "../../layouts/admin/AdminLayout";
import { useAuthStore } from "../../stores/authStore";

const AdminAllSubscriptionsPage = () => {
  const {
    adminSubscriptions,
    adminSubscriptionsPagination,
    fetchAllAdminSubscriptions,
    subscriptionLoading,
    subscriptionError,
  } = useAuthStore();

  const [ownerNameInput, setOwnerNameInput] = useState("");
  const [planNameInput, setPlanNameInput] = useState("");

  const [filters, setFilters] = useState({
    ownerName: "",
    planName: "",
    status: "",
    page: 1,
    limit: 10,
  });

    useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({
        ...f,
        ownerName: ownerNameInput,
        page: 1,
      }));
    }, 1000); 

    return () => clearTimeout(timer);
  }, [ownerNameInput]);

    useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((f) => ({
        ...f,
        planName: planNameInput,
        page: 1,
      }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [planNameInput])

  useEffect(() => {
    fetchAllAdminSubscriptions({
      ownerName: filters.ownerName || undefined,
      planName: filters.planName || undefined,
      status: filters.status as any,
      page: filters.page,
      limit: filters.limit,
    });
  }, [filters]);

  return (
    <ModernAdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">All Subscriptions</h1>

        {/* Filters */}
        <div className="flex gap-3">
          <input
            placeholder="Owner name"
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
            // value={filters.ownerName}
              value={ownerNameInput}
            // onChange={(e) =>
            //   setFilters((f) => ({ ...f, ownerName: e.target.value, page: 1 }))
            // }
            onChange={(e) => setOwnerNameInput(e.target.value)}
          />
          <input
            placeholder="Plan name"
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
            // value={filters.planName}
             value={planNameInput}
            // onChange={(e) =>
            //   setFilters((f) => ({ ...f, planName: e.target.value, page: 1 }))
            // }
            onChange={(e) => setPlanNameInput(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({ ...f, status: e.target.value, page: 1 }))
            }
          >
            <option value="">All</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        {/* Table */}
        {subscriptionLoading ? (
          <p>Loading subscriptions...</p>
        ) : subscriptionError ? (
          <p className="text-red-500">{subscriptionError}</p>
        ) : (
          <div className="bg-slate-900 rounded-xl overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-800">
                <tr>
                  <th className="p-3">Owner</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Start</th>
                  <th className="p-3">End</th>
                  <th className="p-3">Type</th>
                </tr>
              </thead>
              <tbody>
                {adminSubscriptions.map((sub) => (
                  <tr key={sub.id} className="border-t border-slate-800">
                    <td className="p-3">{sub.owner.name}</td>
                    <td className="p-3">{sub.owner.email}</td>
                    <td className="p-3">{sub.plan.name}</td>
                    <td className="p-3">{sub.status}</td>
                    <td className="p-3">
                      {new Date(sub.startDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {new Date(sub.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">{sub.transactionType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}



{/* Pagination */}
{adminSubscriptionsPagination &&
  adminSubscriptionsPagination.totalPages > 1 && (
    <div className="flex items-center justify-between mt-6">
      {/* Left: Info */}
      <p className="text-sm text-slate-400">
        Showing{" "}
        {(adminSubscriptionsPagination.page - 1) * filters.limit + 1}–
        {Math.min(
          adminSubscriptionsPagination.page * filters.limit,
          adminSubscriptionsPagination.total
        )}{" "}
        of {adminSubscriptionsPagination.total} results
      </p>

      {/* Right: Controls */}
      <div className="flex items-center gap-2">
        <button
          disabled={adminSubscriptionsPagination.page === 1}
          onClick={() =>
            setFilters((f) => ({
              ...f,
              page: adminSubscriptionsPagination.page - 1,
            }))
          }
          // className="px-3 py-1.5 rounded-lg bg-slate-700 border border-slate-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition"
           className="px-3 py-1.5 rounded-lg bg-slate-700 text-white border border-slate-500 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:cursor-not-allowed transition"
        >
          ← Prev
        </button>

        {/* Page indicator */}
        <div className="px-3 py-1.5 rounded-lg bg-slate-900  text-slate-400 border border-slate-700 text-sm">
          Page{" "}
          <span className="font-semibold text-white">
            {adminSubscriptionsPagination.page}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-white">
            {adminSubscriptionsPagination.totalPages}
          </span>
        </div>

        <button
          disabled={
            adminSubscriptionsPagination.page ===
            adminSubscriptionsPagination.totalPages
          }
          onClick={() =>
            setFilters((f) => ({
              ...f,
              page: adminSubscriptionsPagination.page + 1,
            }))
          }
          className="px-3 py-1.5 rounded-lg bg-slate-800 border text-slate-400 border-slate-700 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 transition"
        >
          Next →
        </button>
      </div>
    </div>
  )}


      </div>
    </ModernAdminLayout>
  );
};

export default AdminAllSubscriptionsPage;
