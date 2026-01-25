
import { useEffect } from "react";
import ModernAdminLayout from "../../layouts/admin/AdminLayout";
import { useAuthStore } from "../../stores/authStore";
import DashboardPieChart from "../../components/common/DashboardPieChart";
import { Clock } from "lucide-react";


const getPendingCount = (
  data: { status: string; count: number }[] | undefined
): number => {
  return data?.find(item => item.status === "pending")?.count ?? 0;
};


const AdminDashboard = () => {
  const { dashboardStats, fetchAdminDashboardStats } = useAuthStore();

  useEffect(() => {
    fetchAdminDashboardStats();
  }, []);

  if (!dashboardStats) {
    return (
      <ModernAdminLayout>
        <p className="text-center mt-10">Loading dashboard...</p>
      </ModernAdminLayout>
    );
  }

  const pendingOwners = getPendingCount(dashboardStats.owners);
  const pendingProperties = getPendingCount(dashboardStats.properties);

  return (
    <ModernAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Platform overview & pending actions
          </p>
        </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-admin-card rounded-xl p-6 shadow flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Owner Approvals
              </p>
              <h2 className="text-3xl font-bold mt-2">
                {pendingOwners}
              </h2>
            </div>
            <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full">
              <Clock size={24} />
            </div>
          </div>

          <div className="bg-admin-card rounded-xl p-6 shadow flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pending Property Approvals
              </p>
              <h2 className="text-3xl font-bold mt-2">
                {pendingProperties}
              </h2>
            </div>
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
              <Clock size={24} />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <DashboardPieChart title="Users" data={dashboardStats.users} />
          <DashboardPieChart title="Owners" data={dashboardStats.owners} />
          <DashboardPieChart title="Properties" data={dashboardStats.properties} />
          <DashboardPieChart title="Bookings" data={dashboardStats.bookings} />
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminDashboard;
