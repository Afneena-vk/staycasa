
import { useEffect, useState } from "react";
import ModernAdminLayout from "../../layouts/admin/AdminLayout";
import { FaUsers, FaCrown, FaBuilding, FaCheckCircle, FaTimesCircle, FaClock, FaBan, FaChartLine } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  bookedProperties: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  

  const adminTotalBookings = useAuthStore((state) => state.adminTotalBookingsCount);
  const adminUserStatistics = useAuthStore((state) => state.adminUserStatistics);
  
  const fetchAdminTotalBookings = useAuthStore((state) => state.fetchAdminTotalBookingsCount);
  const fetchAdminUserStatistics = useAuthStore( (state) => state.fetchAdminUserStatistics);


    const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    blockedUsers: 0,
    bookedProperties: 0,
  });

  
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        await fetchAdminUserStatistics();
        await fetchAdminTotalBookings();

        // setStats({
        //   totalUsers: adminUserStatistics?.totalUsers ?? 0,
        //   activeUsers: adminUserStatistics?.activeUsers ?? 0,
        //   blockedUsers: adminUserStatistics?.blockedUsers ?? 0,
        //   bookedProperties: adminTotalBookings ?? 0,
        // });

        setLastUpdated(new Date());
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);


  useEffect(() => {
    setStats({
      totalUsers: adminUserStatistics?.totalUsers ?? 0,
      activeUsers: adminUserStatistics?.activeUsers ?? 0,
      blockedUsers: adminUserStatistics?.blockedUsers ?? 0,
      bookedProperties: adminTotalBookings ?? 0,
    });
  }, [adminUserStatistics, adminTotalBookings]);


  const statsCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      // subtitle: `${adminUserStatistics?.activeUsers??0},active, ${adminUserStatistics?.blockedUsers ?? 0} blocked`,
      icon: FaUsers,
      color: "bg-blue-500",
      onClick: () => navigate("/admin/users"),
    },

    {
      title: "Booked Properties",
       value: stats.bookedProperties,
      // subtitle: `${stats.blockedProperties} blocked`,
      icon: FaCheckCircle,
      color: "bg-orange-500",
      onClick: () => navigate("/admin/properties"),
    },
  ];

 


  if (loading) {
    return (
      <ModernAdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-admin-primary"></div>
        </div>
      </ModernAdminLayout>
    );
  }

  return (
    <ModernAdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-admin-card-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your platform's performance and key metrics
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors text-sm font-medium"
            >
              Refresh Data
            </button> */}
            <button
              onClick={() => {
                fetchAdminUserStatistics();
                fetchAdminTotalBookings();
              }}
              className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary/90 transition-colors text-sm font-medium"
            >
              Refresh Data
            </button>            
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.title}
                onClick={stat.onClick}
                className="bg-admin-card rounded-xl p-6 shadow-card border border-admin-border hover:shadow-elevated transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-admin-card-foreground mt-2">
                      {stat.value}
                    </p>
                    {/* <p className="text-xs text-muted-foreground mt-2">{stat.subtitle}</p> */}
                  </div>
                  <div className={`w-14 h-14 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ModernAdminLayout>
  );
};

export default AdminDashboard;